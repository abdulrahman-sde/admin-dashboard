import { ordersRepository } from "../repositories/orders.repository.js";
import { customerRepository } from "../repositories/customers.repository.js";
import { productRepository } from "../repositories/products.repository.js";
import { couponsRepository } from "../repositories/coupons.repository.js";
import { paymentMethodsRepository } from "../repositories/payment-methods.repository.js";

import type {
  CreateOrderInput,
  GetOrdersQuery,
  UpdateOrderInput,
} from "../utils/validators/order.validator.js";
import type {
  OrderCreationResult,
  ServerOrderItem,
} from "../types/orders.types.js";
import { NotFoundError, ValidationError } from "../utils/errors.js";
import { calculateOrderPricing } from "../utils/pricing.utils.js";
import {
  generateOrderNumber,
  generateTransactionNumber,
} from "../utils/order.utils.js";
import {
  getSkipTake,
  getPaginationMeta,
  buildDateRangeFilter,
} from "../utils/query.utils.js";
import {
  type Prisma,
  PaymentMethod,
  FulfillmentStatus,
  PaymentStatus,
} from "@prisma/client";
import { couponsService } from "./coupons.service.js";

export const ordersService = {
  async createOrder(input: CreateOrderInput): Promise<OrderCreationResult> {
    const productIds = input.items.map((it) => it.productId);
    const products = await ordersRepository.findProductsByIds(productIds);
    const productById = new Map(products.map((p) => [p.id, p]));

    const serverItems: ServerOrderItem[] = input.items.map((it) => {
      const prod = productById.get(it.productId);
      if (!prod) throw new NotFoundError(`Product not found: ${it.productId}`);

      if (!prod.isUnlimitedStock) {
        const available = prod.stockQuantity ?? 0;
        if (available < it.quantity) {
          throw new ValidationError(
            `Insufficient stock for ${prod.name}. Available: ${available}, Requested: ${it.quantity}`
          );
        }
      }

      return {
        productId: it.productId,
        quantity: it.quantity,
        unitPrice: prod.price, // setting the price from the database
        totalPrice: prod.price * it.quantity,
        productName: prod.name,
        productImage: prod.images?.[0],
        productSku: prod.sku,
      };
    });

    const subtotal = serverItems.reduce(
      (sum, item) => sum + item.totalPrice,
      0
    );
    const shippingFee = input.shippingFee ?? 0;

    let discountAmount = input.discount ?? 0;
    let appliedCoupon: { id: string; code: string } | null = null;

    if (input.couponCode) {
      const couponResult = await couponsService.validateAndApplyCoupon(
        input.couponCode,
        subtotal,
        shippingFee
      );
      discountAmount = couponResult.discountAmount;
      appliedCoupon = {
        id: couponResult.coupon.id,
        code: couponResult.coupon.code,
      };
    }

    const pricing = calculateOrderPricing({
      items: serverItems,
      shippingFee,
      taxRate: 0, // In future, fetch tax rate based on location
      discountAmount,
    });

    let customerId = input.customerId;
    if (!customerId) {
      if (input.customer) {
        const created = await ordersRepository.createGuestCustomer({
          firstName: input.customer.firstName,
          lastName: input.customer.lastName,
          email: input.customer.email,
          phone: input.customer.phone,
        });
        customerId = created.id;
      } else {
        throw new ValidationError(
          "Customer information is required for checkout"
        );
      }
    }

    const orderNumber = generateOrderNumber();
    const transactionNumber = generateTransactionNumber();

    const shippingAddress = input.shippingAddress ?? undefined;
    const billingAddress = input.billingAddress ?? undefined;

    const orderData: Prisma.OrderCreateInput = {
      orderNumber,
      customer: { connect: { id: customerId } },
      sessionId: input.sessionId,

      subtotal: pricing.subtotal,
      taxAmount: pricing.taxAmount,
      shippingFee: pricing.shippingFee,
      discount: pricing.discount,
      totalAmount: pricing.totalAmount,

      couponId: appliedCoupon?.id,
      couponCode: appliedCoupon?.code,

      fulfillmentStatus: "PENDING",
      paymentStatus:
        input.paymentMethod === "CASH_ON_DELIVERY" ? "PENDING" : "COMPLETED",
      paymentMethod: input.paymentMethod as PaymentMethod,

      shippingAddress: shippingAddress ? { set: shippingAddress } : undefined,
      billingAddress: billingAddress ? { set: billingAddress } : undefined,
      notes: input.notes,
      ipAddress: input.ipAddress,
      userAgent: input.userAgent,
      country: input.country,
    };

    const paymentMethods = await paymentMethodsRepository.findAll();
    const activeMethod =
      paymentMethods.find((m) => m.isDefault && m.status === "ACTIVE") ||
      paymentMethods[0];

    const transactionData: Prisma.TransactionCreateInput = {
      transactionNumber,
      customer: { connect: { id: customerId } },
      order: { connect: undefined }, // Will be connected in repo

      amount: pricing.totalAmount,
      currency: "USD",
      paymentStatus:
        input.paymentMethod === "CASH_ON_DELIVERY" ? "PENDING" : "COMPLETED",
      paymentMethod: input.paymentMethod as PaymentMethod,
      paymentGateway: "MANUAL", // No real gateway involved

      gatewayTransactionId: null,
      gatewayResponse: null,
      ...(activeMethod && {
        storePaymentMethod: { connect: { id: activeMethod.id } },
      }),
    };

    const { order } = await ordersRepository.createOrderRecord({
      orderData,
      orderItems: serverItems,
      transactionData,
    });

    (async () => {
      await Promise.all([
        customerRepository.updateStats(customerId, order.totalAmount),
        ...serverItems.map((item) =>
          productRepository.incrementSales(item.productId, item.quantity)
        ),
      ]);

      if (appliedCoupon) {
        await couponsRepository.incrementUsage(appliedCoupon.id);
      }
    })();

    return {
      orderId: order.id,
      orderNumber: order.orderNumber,
      totalAmount: order.totalAmount,
    };
  },

  async getOrders(query: GetOrdersQuery) {
    const {
      page,
      limit,
      search,
      fulfillmentStatus,
      paymentStatus,
      startDate,
      endDate,
      customerId,
      sortBy,
      sortOrder,
    } = query;

    const where: Prisma.OrderWhereInput = {};
    const andConditions: Prisma.OrderWhereInput[] = [];

    if (search) {
      where.OR = [
        { orderNumber: { contains: search, mode: "insensitive" } },
        {
          customer: {
            OR: [
              { firstName: { contains: search, mode: "insensitive" } },
              { lastName: { contains: search, mode: "insensitive" } },
              { email: { contains: search, mode: "insensitive" } },
            ],
          },
        },
      ];
    }

    if (fulfillmentStatus) {
      andConditions.push({
        fulfillmentStatus: fulfillmentStatus as FulfillmentStatus,
      });
    }
    if (paymentStatus) {
      andConditions.push({ paymentStatus: paymentStatus as PaymentStatus });
    }

    const dateFilter = buildDateRangeFilter(startDate, endDate);
    if (dateFilter) {
      andConditions.push({ createdAt: dateFilter });
    }

    if (customerId) {
      andConditions.push({ customerId });
    }

    if (andConditions.length > 0) {
      where.AND = andConditions;
    }

    const { skip, take } = getSkipTake({ page, limit });

    const { orders, total } = await ordersRepository.findAll({
      skip,
      take,
      where,
      orderBy: { [sortBy]: sortOrder },
    });

    const stats = await ordersRepository.getFilterCounts();

    return {
      data: orders,
      pagination: getPaginationMeta(total, { page, limit }),
      meta: {
        all: stats.all,
        pending: stats.pending,
        completed: stats.delivered,
        canceled: stats.canceled,
      },
    };
  },
  async updateOrder(id: string, input: UpdateOrderInput) {
    const updated = await ordersRepository.updateStatus(id, {
      fulfillmentStatus: input.fulfillmentStatus as FulfillmentStatus,
      paymentStatus: input.paymentStatus as PaymentStatus,
    });

    return updated;
  },
};
