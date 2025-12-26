import { type Prisma, FulfillmentStatus, PaymentStatus } from "@prisma/client";
import { prisma } from "../lib/prisma.js";
import type {
  OrderStatsResult,
  OrderStatsFacetResult,
} from "../types/orders.types.js";

export const ordersRepository = {
  findProductsByIds(ids: string[]) {
    return prisma.product.findMany({
      where: { id: { in: ids } },
      select: {
        id: true,
        price: true,
        name: true,
        images: true,
        sku: true,
        stockQuantity: true,
        isUnlimitedStock: true,
      },
    });
  },

  // Guest customer creation: requires guest PII (email, name, phone)
  async createGuestCustomer(data: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  }) {
    // If a customer with this email already exists, return it instead of trying
    // to create a duplicate. This handles cases where a registered account
    // already exists or a previous guest was created.
    const existing = await prisma.customer.findUnique({
      where: { email: data.email },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        phone: true,
        isGuest: true,
        role: true,
      },
    });
    if (existing) return existing;

    return prisma.customer.create({
      data: {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phone: data.phone,
        isGuest: true,
        role: "GUEST",
        deletedAt: null,
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        phone: true,
        isGuest: true,
        role: true,
      },
    });
  },

  async createOrderRecord({
    orderData,
    orderItems,
    transactionData,
  }: {
    orderData: Prisma.OrderCreateInput;
    orderItems: Omit<Prisma.OrderItemCreateManyInput, "orderId">[];
    transactionData: Prisma.TransactionCreateInput; // Note: This type expects relations, but we might pass raw data
  }): Promise<{
    order: Prisma.OrderGetPayload<{}>;
    transaction: Prisma.TransactionGetPayload<{}>;
  }> {
    const result = await prisma.$transaction(async (tx) => {
      // 1. Create the Order
      const order = await tx.order.create({ data: orderData });

      // 2. Attach orderId to items and create them
      const itemsWithOrderId = orderItems.map((item) => ({
        ...item,
        orderId: order.id,
      }));

      if (itemsWithOrderId.length) {
        await tx.orderItem.createMany({ data: itemsWithOrderId });
      }

      // 3. Decrement stock
      for (const it of orderItems) {
        const prod = await tx.product.findUnique({
          where: { id: it.productId },
          select: { stockQuantity: true, isUnlimitedStock: true },
        });
        if (!prod)
          throw new Error(
            `Product not found during order commit: ${it.productId}`
          );
        if (!prod.isUnlimitedStock) {
          if ((prod.stockQuantity ?? 0) < it.quantity) {
            throw new Error(`Insufficient stock for product ${it.productId}`);
          }
          await tx.product.update({
            where: { id: it.productId },
            data: { stockQuantity: { decrement: it.quantity } },
          });
        }
      }

      // 4. Create Transaction linked to Order
      // We explicitly set orderId because we already created the order
      const txn = await tx.transaction.create({
        data: {
          ...transactionData,
          order: { connect: { id: order.id } },
        },
      });

      return { order, transaction: txn };
    });

    return result;
  },

  async findAll(params: {
    skip: number;
    take: number;
    where: Prisma.OrderWhereInput;
    orderBy: Prisma.OrderOrderByWithRelationInput;
  }) {
    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        skip: params.skip,
        take: params.take,
        where: params.where,
        orderBy: params.orderBy,
        select: {
          id: true,
          orderNumber: true,
          createdAt: true,
          totalAmount: true,
          paymentStatus: true,
          fulfillmentStatus: true,
          discount: true,
          couponCode: true,
          shippingFee: true,
          transaction: {
            select: { paymentMethod: true },
          },
          customer: {
            select: { firstName: true, lastName: true, email: true },
          },
          items: {
            take: 1,
            select: { productName: true, productImage: true, quantity: true },
          },
        },
      }),
      prisma.order.count({ where: params.where }),
    ]);

    return { orders, total };
  },

  async updateStatus(
    orderId: string,
    data: {
      fulfillmentStatus?: FulfillmentStatus;
      paymentStatus?: PaymentStatus;
    }
  ) {
    return prisma.$transaction(async (tx) => {
      // 1. Update Order
      const order = await tx.order.update({
        where: { id: orderId },
        data: {
          fulfillmentStatus: data.fulfillmentStatus,
          paymentStatus: data.paymentStatus,
        },
      });

      // 2. If Payment Status changed, update Transaction
      if (data.paymentStatus) {
        // Find transaction linked to this order
        const txn = await tx.transaction.findUnique({
          where: { orderId: orderId },
        });

        if (txn) {
          await tx.transaction.update({
            where: { id: txn.id },
            data: { paymentStatus: data.paymentStatus },
          });
        }
      }

      return order;
    });
  },

  getFilterCounts: async (): Promise<OrderStatsResult> => {
    const result = await prisma.order.aggregateRaw({
      pipeline: [
        {
          $facet: {
            total: [{ $count: "count" }],
            pending: [
              { $match: { fulfillmentStatus: "PENDING" } },
              { $count: "count" },
            ],
            delivered: [
              { $match: { fulfillmentStatus: "DELIVERED" } },
              { $count: "count" },
            ],
            canceled: [
              { $match: { fulfillmentStatus: "CANCELED" } },
              { $count: "count" },
            ],
          },
        },
      ],
    });

    const facetResult = result as unknown as OrderStatsFacetResult[];
    const data = facetResult[0];

    return {
      all: data?.total[0]?.count ?? 0,
      pending: data?.pending[0]?.count ?? 0,
      delivered: data?.delivered[0]?.count ?? 0,
      canceled: data?.canceled[0]?.count ?? 0,
    };
  },
};

export default ordersRepository;
// (no additional exports)
