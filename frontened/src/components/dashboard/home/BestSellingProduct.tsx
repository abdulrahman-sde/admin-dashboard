"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { BestSellingProductSkeleton } from "@/components/shared/skeletons";
import { DataTableEmptyState } from "@/components/shared/DataTableEmptyState";
import { cn } from "@/lib/utils";

interface BestSellingProductProps {
  data?: {
    name: string;
    totalOrder: number;
    status: string;
    price: string | number;
    image: string;
  }[];
  isLoading?: boolean;
}

export default function BestSellingProduct({
  data,
  isLoading,
}: BestSellingProductProps) {
  if (isLoading) {
    return <BestSellingProductSkeleton />;
  }

  return (
    <Card className="shadow-sm border-0">
      <CardHeader className="flex flex-row items-center justify-between pb-4 px-6">
        <CardTitle className="text-[17px] font-bold text-[#1e293b]">
          Best selling product
        </CardTitle>
        <Button
          variant="default"
          size="sm"
          className="bg-primary text-white hover:bg-primary/90 gap-2 h-9 px-4 rounded-lg font-bold"
        >
          <Filter className="h-4 w-4" />
          Filter
        </Button>
      </CardHeader>

      <CardContent className="px-6">
        <div className="overflow-x-auto min-h-[300px]">
          <Table className="border-separate border-spacing-y-2">
            <TableHeader className="[&_tr]:border-0 bg-[#EAF8E7] rounded-lg">
              <TableRow className="hover:bg-transparent">
                <TableHead className="rounded-tl-lg rounded-bl-lg py-4 px-4 text-[#4EA674] font-bold">
                  Product
                </TableHead>
                <TableHead className="text-center py-4 text-[#4EA674] font-bold">
                  Total Order
                </TableHead>
                <TableHead className="text-center py-4 text-[#4EA674] font-bold">
                  Status
                </TableHead>
                <TableHead className="text-right rounded-tr-lg px-4 rounded-br-lg py-4 text-[#4EA674] font-bold">
                  Price
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {!data || data.length === 0 ? (
                <DataTableEmptyState colSpan={4} message="No products found" />
              ) : (
                data.map((product, index) => (
                  <TableRow key={index} className="hover:bg-[#f8fafc] border-0">
                    <TableCell className="py-4 border-0">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-[#f8fafc] rounded-lg flex items-center justify-center overflow-hidden border border-[#f1f5f9]">
                          {product.image ? (
                            <img
                              src={product.image}
                              alt={product.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full bg-[#f8fafc]" />
                          )}
                        </div>
                        <span className="font-bold text-[#334155]">
                          {product.name}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-center font-bold text-[#334155] border-0">
                      {product.totalOrder}
                    </TableCell>
                    <TableCell className="border-0">
                      <div className="flex items-center justify-center gap-2">
                        <div
                          className={cn(
                            "h-2 w-2 rounded-full",
                            product.status.toLowerCase() === "stock" ||
                              product.status.toLowerCase() === "active"
                              ? "bg-[#4EA674]"
                              : "bg-[#ef4444]"
                          )}
                        />
                        <span className="font-bold text-[#334155] text-[13px]">
                          {product.status}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="font-bold text-right text-[#0f172a] border-0">
                      $
                      {typeof product.price === "number"
                        ? product.price.toLocaleString()
                        : product.price}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Details Button */}
        <div className="flex justify-end mt-6">
          <Button
            variant="outline"
            size="sm"
            className="text-[#6366f1] h-[34px] px-6 border-[#6366f1] border hover:bg-[#6366f1] hover:text-white transition-all duration-200 text-[14px] font-bold rounded-full bg-transparent"
          >
            Details
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
