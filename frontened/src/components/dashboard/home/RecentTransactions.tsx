"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Filter } from "lucide-react";
import { useTransactions } from "@/hooks/transactions";
import { RecentTransactionsSkeleton } from "@/components/shared/skeletons";
import { DataTableEmptyState } from "@/components/shared/DataTableEmptyState";

export default function RecentTransactions() {
  const { transactions, isFetching } = useTransactions();
  return (
    <Card className="shadow-sm border-0">
      <CardHeader className="flex flex-row items-center justify-between ">
        <h3 className="font-semibold">Transaction</h3>
        <Button
          variant="default"
          size="sm"
          className="bg-primary text-white hover:bg-primary/90 gap-2"
        >
          <Filter className="h-4 w-4" />
          Filter
        </Button>
      </CardHeader>

      <CardContent>
        {/* Table */}
        <div className="overflow-x-auto min-h-[150px]">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-16">No</TableHead>
                <TableHead>Id Customer</TableHead>
                <TableHead>Order Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="[&_tr]:h-12 ">
              {isFetching ? (
                <RecentTransactionsSkeleton rows={6} />
              ) : transactions.length === 0 ? (
                <DataTableEmptyState
                  colSpan={5}
                  message="No transactions found"
                />
              ) : (
                transactions.slice(0, 6).map((transaction, index) => (
                  <TableRow key={index} className="[&_td]:text-[13.5px]">
                    <TableCell>{index + 1}.</TableCell>
                    <TableCell className="font-medium">
                      #{transaction.customerId.slice(0, 10)}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {new Date(transaction.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div
                          className={`h-2 w-2 rounded-full ${
                            transaction.paymentStatus === "COMPLETED"
                              ? "bg-[#21C45D]"
                              : "bg-warning"
                          }`}
                        />
                        <span>
                          {transaction.paymentStatus === "COMPLETED"
                            ? "Paid"
                            : transaction.paymentStatus === "PENDING"
                            ? "Pending"
                            : "Failed"}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="font-medium text-right">
                      ${transaction.amount.toFixed(2)}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Details Button */}
        <div className="flex justify-end mt-2">
          <Button
            variant="outline"
            className="text-tertiary border-tertiary rounded-3xl px-6"
          >
            Details
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
