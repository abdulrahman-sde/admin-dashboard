"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { MoreVertical, Plus } from "lucide-react";
import cardBgImage from "@/assets/images/card.svg";
import {
  useGetPaymentMethodsQuery,
  useUpdatePaymentMethodMutation,
} from "@/lib/store/services/payment-methods/paymentMethodsApi";
import { AddPaymentMethodModal } from "./AddPaymentMethodModal";
import { RelevantTransactionsModal } from "./RelevantTransactionsModal";
import { toast } from "sonner";
import { useNavigate } from "react-router";
import { useTransactions } from "@/hooks/transactions/useTransactions";

export default function PaymentMethodCard() {
  const navigate = useNavigate();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isViewTransactionsOpen, setIsViewTransactionsOpen] = useState(false);
  const { data, isLoading } = useGetPaymentMethodsQuery();
  const [updateMethod] = useUpdatePaymentMethodMutation();

  const activeMethod = data?.data.find((m) => m.isDefault) || data?.data[0];

  const handleDeactivate = async () => {
    if (!activeMethod) return;
    try {
      await updateMethod({
        id: activeMethod.id,
        body: { status: "INACTIVE", isDefault: false },
      }).unwrap();
      toast.success("Payment method deactivated");
    } catch (err) {
      toast.error("Failed to deactivate method");
    }
  };

  const handleStatusToggle = async (checked: boolean) => {
    if (!activeMethod) return;
    try {
      await updateMethod({
        id: activeMethod.id,
        body: { status: checked ? "ACTIVE" : "INACTIVE" },
      }).unwrap();
      toast.success(`Method ${checked ? "activated" : "deactivated"}`);
    } catch (err) {
      toast.error("Failed to update status");
    }
  };

  const { totalTransactions, dynamicStats } = useTransactions();
  const revenue = dynamicStats[0]?.value || 0;

  if (isLoading) {
    return (
      <Card className="animate-pulse h-[350px] bg-gray-50 border-[#E5E7EB]" />
    );
  }

  return (
    <Card className="border-[#E5E7EB]">
      <CardHeader className="flex flex-row items-center justify-between ">
        <CardTitle className="text-base font-semibold text-[#111827]">
          Payment Method
        </CardTitle>
        <button className="text-[#6B7280] hover:text-[#111827]">
          <MoreVertical className="h-4 w-4" />
        </button>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Credit Card */}
        <div className="flex gap-8 flex-col sm:flex-row sm:items-center ">
          <div className="relative w-[280px] h-[172px] rounded-2xl p-6 text-white overflow-hidden shrink-0">
            {/* Background Image */}
            <img
              src={cardBgImage}
              alt=""
              className="absolute inset-0 w-full h-full object-cover"
            />

            {/* Card overlay for better text visibility */}
            <div className="absolute inset-0 bg-linear-to-br from-[#4EA674]/20 to-transparent" />

            {/* Card Content */}
            <div className="relative h-full flex flex-col justify-between">
              {/* Top Section - Logo and Switch */}
              <div className="flex items-start justify-between">
                <div className="text-sm font-bold uppercase tracking-widest">
                  {activeMethod?.type.replace("_", " ") || "No Card"}
                </div>
                <Switch
                  checked={activeMethod?.status === "ACTIVE"}
                  onCheckedChange={handleStatusToggle}
                  className="data-[state=checked]:bg-white [&[data-state=checked]_span]:bg-[#4EA674]"
                  disabled={!activeMethod}
                />
              </div>

              {/* Middle Section - Card Number */}
              <div className="text-sm tracking-wider">
                •••• •••• •••• {activeMethod?.last4 || "0000"}
              </div>

              {/* Bottom Section - Card Details */}
              <div className="flex items-end justify-between text-sm">
                <div>
                  <div className="text-[10px] opacity-80 mb-1 uppercase tracking-wider">
                    Card Holder
                  </div>
                  <div className="font-medium truncate max-w-[140px]">
                    {activeMethod?.holderName || "N/A"}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-[10px] opacity-80 mb-1 uppercase tracking-wider">
                    Expiry Date
                  </div>
                  <div className="font-medium text-xs">
                    {activeMethod?.expiryDate || "MM/YY"}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Card Info */}
          <div className="space-y-2 pt-2 flex-1">
            <div className="flex items-center justify-between text-sm">
              <span className="text-[#6B7280]">Status:</span>
              <span
                className={`font-medium ${
                  activeMethod?.status === "ACTIVE"
                    ? "text-[#4EA674]"
                    : "text-red-500"
                }`}
              >
                {activeMethod?.status || "None"}
              </span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-[#6B7280]">Transactions:</span>
              <span className="font-medium text-[#111827]">
                {totalTransactions.toLocaleString()}
              </span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-[#6B7280]">Revenue:</span>
              <span className="font-medium text-[#111827]">
                ${revenue.toLocaleString()}
              </span>
            </div>
            <button
              onClick={() => setIsViewTransactionsOpen(true)}
              className="text-sm text-[#4EA674] hover:underline text-left block"
            >
              View Transactions
            </button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3 pt-2">
          <Button
            variant="outline"
            className="flex-1 border-[#E5E7EB] text-[#374151]"
            onClick={() => setIsAddModalOpen(true)}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Card
          </Button>
          <Button
            variant="outline"
            className="border-red-200 text-red-500 hover:bg-red-50"
            onClick={handleDeactivate}
            disabled={!activeMethod || activeMethod.status === "INACTIVE"}
          >
            Deactivate
          </Button>
        </div>
      </CardContent>

      <AddPaymentMethodModal
        open={isAddModalOpen}
        onOpenChange={setIsAddModalOpen}
      />

      <RelevantTransactionsModal
        open={isViewTransactionsOpen}
        onOpenChange={setIsViewTransactionsOpen}
        storePaymentMethodId={activeMethod?.id}
      />
    </Card>
  );
}
