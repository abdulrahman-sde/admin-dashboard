import { paymentMethodsRepository } from "../repositories/payment-methods.repository.js";
import type {
  CreatePaymentMethodInput,
  UpdatePaymentMethodInput,
} from "../utils/validators/payment-method.validator.js";

export const paymentMethodsService = {
  async createPaymentMethod(data: CreatePaymentMethodInput) {
    return paymentMethodsRepository.create(data);
  },

  async getAllPaymentMethods() {
    return paymentMethodsRepository.findAll();
  },

  async getPaymentMethodById(id: string) {
    const method = await paymentMethodsRepository.findById(id);
    if (!method) throw new Error("Payment method not found");
    return method;
  },

  async updatePaymentMethod(id: string, data: UpdatePaymentMethodInput) {
    return paymentMethodsRepository.update(id, data);
  },

  async deletePaymentMethod(id: string) {
    return paymentMethodsRepository.delete(id);
  },
};
