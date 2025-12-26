"use client";

import {
  useGetPaymentMethodsQuery,
  useDeletePaymentMethodMutation,
  useUpdatePaymentMethodMutation,
} from "@/lib/store/services/payment-methods/paymentMethodsApi";
import { Plus, Trash2, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";

export default function PaymentMethods() {
  const { data, isLoading } = useGetPaymentMethodsQuery();
  const [deleteMethod] = useDeletePaymentMethodMutation();
  const [updateMethod] = useUpdatePaymentMethodMutation();

  const handleDelete = async (id: string) => {
    try {
      await deleteMethod(id).unwrap();
      toast.success("Payment method deleted");
    } catch (err) {
      toast.error("Failed to delete payment method");
    }
  };

  const handleSetDefault = async (id: string) => {
    try {
      await updateMethod({ id, body: { isDefault: true } }).unwrap();
      toast.success("Default payment method updated");
    } catch (err) {
      toast.error("Failed to update default payment method");
    }
  };

  const methods = data?.data || [];

  return (
    <div className="space-y-6 px-2">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-[#111827]">
            Payment Methods
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage your store's payment receiving accounts
          </p>
        </div>
        <Button className="bg-[#4EA674] hover:bg-[#3d8a5e]">
          <Plus className="mr-2 h-4 w-4" /> Add Method
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <Card key={i} className="animate-pulse h-48 bg-gray-50" />
          ))
        ) : methods.length === 0 ? (
          <div className="col-span-full py-20 text-center bg-white rounded-xl border border-dashed border-gray-300">
            <CreditCard className="mx-auto h-12 w-12 text-gray-300 mb-4" />
            <p className="text-gray-500">No payment methods configured</p>
          </div>
        ) : (
          methods.map((method) => (
            <Card
              key={method.id}
              className={`relative overflow-hidden border-2 transition-all ${
                method.isDefault
                  ? "border-[#4EA674] shadow-md"
                  : "border-gray-100"
              }`}
            >
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <div
                    className={`p-2 rounded-lg ${
                      method.isDefault
                        ? "bg-[#EAF8E7] text-[#4EA674]"
                        : "bg-gray-100 text-gray-500"
                    }`}
                  >
                    <CreditCard className="h-5 w-5" />
                  </div>
                  {method.isDefault && (
                    <Badge
                      variant="outline"
                      className="bg-[#EAF8E7] text-[#4EA674] border-[#4EA674] font-medium"
                    >
                      Default
                    </Badge>
                  )}
                </div>
                <CardTitle className="mt-4 text-lg">{method.name}</CardTitle>
                <CardDescription className="font-mono pt-1">
                  **** **** **** {method.last4}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between mt-2">
                  <div className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">
                    {method.type.replace("_", " ")}
                  </div>
                  <div className="text-sm font-medium">
                    Exp: {method.expiryDate || "N/A"}
                  </div>
                </div>

                <div className="flex items-center gap-2 mt-6">
                  {!method.isDefault && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 h-8 text-xs font-bold"
                      onClick={() => handleSetDefault(method.id)}
                    >
                      Set as Default
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    className={`h-8 w-8 p-0 text-red-500 hover:text-red-600 hover:bg-red-50 ${
                      method.isDefault ? "ml-auto" : ""
                    }`}
                    onClick={() => handleDelete(method.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
