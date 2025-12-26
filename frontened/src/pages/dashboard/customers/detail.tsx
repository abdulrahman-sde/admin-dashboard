"use client";

import { useNavigate } from "react-router";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Star, X, ArrowLeft } from "lucide-react";
import { useCustomerDetail } from "@/hooks/customers/useCustomerDetail";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { CustomerDetailSkeleton } from "@/components/shared/skeletons";

import { useState } from "react";
// import { useDeleteCustomerMutation } from "@/lib/store/services/customers/customersApi"; // Remove this
import { CustomerEditModal } from "@/components/dashboard/customers/CustomerEditModal";

import { DeleteConfirmationModal } from "@/components/shared/DeleteConfirmationModal";

import { useCustomerDelete } from "@/hooks/customers/useCustomerDelete";

export default function CustomerDetail() {
  const navigate = useNavigate();
  const { customer, isLoading, isError, customerSince } = useCustomerDetail();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const { isDeleteModalOpen, setIsDeleteModalOpen, handleDelete, isDeleting } =
    useCustomerDelete(customer?.id);

  if (isLoading) {
    return <CustomerDetailSkeleton />;
  }

  if (isError || !customer) {
    return (
      <div className="space-y-6">
        <Button
          variant="ghost"
          onClick={() => navigate("/dashboard/customers")}
          className="mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Customers
        </Button>
        <Card className="p-8 text-center">
          <p className="text-muted-foreground">
            Customer not found or an error occurred.
          </p>
        </Card>
      </div>
    );
  }

  const fullName = `${customer.firstName || ""} ${customer.lastName || ""}`;
  const initials = `${customer.firstName?.[0] || ""}${
    customer.lastName?.[0] || ""
  }`.toUpperCase();

  const getOrderStatusBadge = (status: string) => {
    if (!status) return <Badge variant="secondary">N/A</Badge>;
    const statusLower = status.toLowerCase();
    if (statusLower === "completed" || statusLower === "delivered") {
      return (
        <Badge className="bg-[#C4F8E2]/10 rounded-sm text-[#06A561] ">
          {status}
        </Badge>
      );
    } else if (statusLower === "pending" || statusLower === "processing") {
      return (
        <Badge className="bg-[#E6E9F4] rounded-sm text-muted-foreground">
          {status}
        </Badge>
      );
    } else if (statusLower === "cancelled") {
      return (
        <Badge className="bg-[#F9E2E2] rounded-sm text-destructive hover:bg-red-200">
          {status}
        </Badge>
      );
    }
    return <Badge variant="secondary">{status}</Badge>;
  };

  return (
    <div className="space-y-6 font-inter">
      {/* Back Button */}
      <Button
        variant="ghost"
        onClick={() => navigate("/dashboard/customers")}
        className="mb-4"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Customers
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Customer Information */}
        <div className="lg:col-span-2 space-y-6">
          {/* Customer Information Card */}
          <Card className="border-[#D1D5DB]">
            <CardHeader>
              <h3 className="font-semibold">Customer Information</h3>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Profile Section */}
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                  <Avatar className="h-16 w-16 bg-muted">
                    <AvatarFallback className="text-2xl">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold text-lg">{fullName}</h3>
                    <p className="text-sm text-muted-foreground">
                      {customer.role} •{" "}
                      {customer.isGuest ? "Guest" : "Registered"}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {customer.totalOrders} Orders
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Customer for {customerSince}
                    </p>
                  </div>
                </div>
                <div className="flex gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-5 w-5 ${
                        i < 4
                          ? "fill-yellow-400 text-yellow-400"
                          : "fill-gray-200 text-gray-200"
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* Customer Notes */}
              <div>
                <h4 className="font-semibold mb-4">Customer Notes</h4>
                <div className="space-y-2">
                  <label className="text-sm text-muted-foreground">Notes</label>
                  <Textarea
                    placeholder="Add notes about customer"
                    className="min-h-[100px]"
                    defaultValue={customer.notes || ""}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Customer Orders Card */}
          <Card className="border-[#D1D5DB]">
            <CardHeader>
              <h3 className="font-semibold">Customer Orders</h3>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                {customer.orders && customer.orders.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-muted/50">
                        <TableHead>Order</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Order Status</TableHead>
                        <TableHead>Price</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody className="[&_tr]:h-12">
                      {customer.orders.map((order) => (
                        <TableRow key={order.id}>
                          <TableCell className="font-medium">
                            {order.orderNumber || order.id.slice(0, 8)}
                          </TableCell>
                          <TableCell className="text-muted-foreground">
                            {order.createdAt
                              ? new Date(order.createdAt).toLocaleDateString()
                              : "N/A"}
                          </TableCell>
                          <TableCell>
                            {getOrderStatusBadge(order.fulfillmentStatus)}
                          </TableCell>
                          <TableCell className="font-medium">
                            ${order.totalAmount?.toFixed(2) ?? "0.00"}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <p className="text-muted-foreground text-center py-8">
                    No orders found for this customer.
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Overview and Tags */}
        <div className="space-y-6">
          {/* Overview Card */}
          <Card className="border-[#D1D5DB]">
            <CardHeader className="flex flex-row items-center justify-between">
              <h3 className="font-semibold">Overview</h3>
              <Button
                variant="link"
                className="text-[#4EA674] h-auto p-0"
                onClick={() => setIsEditModalOpen(true)}
              >
                Edit
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              {customer.address && (
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Address</p>
                  {customer.address.street && (
                    <p className="text-sm">{customer.address.street}</p>
                  )}
                  {customer.address.city && (
                    <p className="text-sm">
                      {customer.address.city}
                      {customer.address.state && `, ${customer.address.state}`}
                    </p>
                  )}
                  {customer.address.postalCode && (
                    <p className="text-sm">{customer.address.postalCode}</p>
                  )}
                  {customer.address.country && (
                    <p className="text-sm">{customer.address.country}</p>
                  )}
                </div>
              )}
              <div>
                <p className="text-sm text-muted-foreground mb-1">
                  Email Address
                </p>
                <p className="text-sm">{customer.email}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Phone</p>
                <p className="text-sm">{customer.phone}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">
                  Total Spent
                </p>
                <p className="text-sm font-semibold">
                  $
                  {customer.totalSpent.toLocaleString("en-US", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </p>
              </div>

              <Button
                variant="link"
                className="text-destructive h-auto p-0 w-full justify-start"
                onClick={() => setIsDeleteModalOpen(true)}
                disabled={isDeleting}
              >
                {isDeleting ? "Deleting..." : "Delete Customer"}
              </Button>
            </CardContent>
          </Card>

          <CustomerEditModal
            customer={customer}
            open={isEditModalOpen}
            onOpenChange={setIsEditModalOpen}
          />

          <DeleteConfirmationModal
            open={isDeleteModalOpen}
            onOpenChange={setIsDeleteModalOpen}
            onConfirm={() => handleDelete()}
            title="Delete Customer"
            description="Are you sure you want to delete this customer? This action cannot be undone."
            isDeleting={isDeleting}
          />

          {/* Tags Card */}
          <Card className="border-[#D1D5DB]">
            <CardHeader>
              <h3 className="font-semibold">Tags</h3>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm text-muted-foreground mb-2 block">
                  Add Tags
                </label>
                <Input placeholder="Enter tag name" />
              </div>
              <div className="flex flex-wrap gap-2">
                {customer.tags && customer.tags.length > 0 ? (
                  customer.tags.map((tag, index) => (
                    <Badge
                      key={index}
                      variant="secondary"
                      className="bg-muted/50 text-foreground hover:bg-muted flex items-center gap-1"
                    >
                      {tag}
                      <X className="h-3 w-3 cursor-pointer" />
                    </Badge>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">No tags added</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
