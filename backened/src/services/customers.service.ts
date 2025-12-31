import type { Prisma, CustomerStatus } from "@prisma/client";
import { customerRepository } from "../repositories/customers.repository.js";
import type {
  GetCustomersQuery,
  UpdateCustomerInput,
  CreateCustomerInput,
} from "../utils/validators/customer.validator.js";
import { NotFoundError, ConflictError } from "../utils/errors.js";

export const customersService = {
  async getCustomers(query: GetCustomersQuery) {
    const { page, limit, search, status, sortBy, sortOrder } = query;

    const where: Prisma.CustomerWhereInput = {
      deletedAt: null,
    };
    const andConditions: Prisma.CustomerWhereInput[] = [];

    if (search) {
      where.OR = [
        { firstName: { contains: search, mode: "insensitive" } },
        { lastName: { contains: search, mode: "insensitive" } },
        { email: { contains: search, mode: "insensitive" } },
        { phone: { contains: search, mode: "insensitive" } },
      ];
    }

    // 2. Filters
    if (status)
      andConditions.push({ status: { equals: status as CustomerStatus } });

    if (andConditions.length > 0) {
      where.AND = andConditions;
    }

    const skip = (page - 1) * limit;

    // Execute Main Query
    const { customers, total } = await customerRepository.findAll({
      skip,
      take: limit,
      where,
      orderBy: { [sortBy]: sortOrder },
    });

    return {
      data: customers,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
        hasNextPage: page * limit < total,
        hasPrevPage: page > 1,
      },
    };
  },

  async getCustomerById(id: string) {
    const customer = await customerRepository.findById(id);
    if (!customer) throw new NotFoundError("Customer not found");

    return customer;
  },

  async updateCustomer(id: string, data: UpdateCustomerInput) {
    const exists = await customerRepository.findById(id);
    if (!exists) throw new NotFoundError("Customer not found");

    const { address, ...rest } = data;
    const updateData: Prisma.CustomerUpdateInput = {
      ...rest,
    };

    if (address) {
      if (exists.address) {
        updateData.address = {
          set: {
            ...exists.address,
            ...address,
          } as Prisma.CustomerAddressCreateInput,
        };
      } else {
        updateData.address = {
          set: address as Prisma.CustomerAddressCreateInput,
        };
      }
    }

    return await customerRepository.update(id, updateData);
  },

  async deleteCustomer(id: string) {
    const exists = await customerRepository.findById(id);
    if (!exists) throw new NotFoundError("Customer not found");

    return await customerRepository.delete(id);
  },

  async createCustomer(input: CreateCustomerInput) {
    const existing = await customerRepository.findByEmail(input.email);
    if (existing)
      throw new ConflictError("Customer with this email already exists");

    const address = input.address
      ? {
          street: input.address.street,
          address2: input.address.address2,
          city: input.address.city,
          state: input.address.state ?? null,
          postalCode: input.address.postalCode,
          country: input.address.country,
          phone: input.address.phone,
        }
      : undefined;

    // 3. Create
    return await customerRepository.create({
      firstName: input.firstName,
      lastName: input.lastName,
      email: input.email,
      phone: input.phone,
      notes: input.notes,

      address: address,

      role: "CUSTOMER",
      isGuest: false,
      status: "ACTIVE",
      tags: [],
    });
  },
};
