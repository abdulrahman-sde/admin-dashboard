"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { TopProductsSkeleton } from "@/components/shared/skeletons";
import { EmptyState } from "@/components/shared/EmptyState";

interface TopProductsProps {
  data?: {
    name: string;
    itemCode: string;
    price: string | number;
    image: string;
  }[];
  isLoading?: boolean;
}

export default function TopProducts({ data, isLoading }: TopProductsProps) {
  const [search, setSearch] = useState("");

  if (isLoading) {
    return <TopProductsSkeleton />;
  }

  const filteredProducts =
    data
      ?.filter((product) =>
        product.name.toLowerCase().includes(search.toLowerCase())
      )
      .slice(0, 4) || [];

  return (
    <Card className="shadow-sm border-0 pb-3 min-h-[480px]">
      <CardHeader className="flex flex-row items-center justify-between px-6">
        <h3 className="text-[17px] font-bold text-[#1e293b]">Top Products</h3>
        <button className="text-[#6366f1] text-[14px] font-bold hover:underline">
          All product
        </button>
      </CardHeader>

      <CardContent className="space-y-4 px-6">
        {/* Search Input */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-neutral-400" />
          <Input
            type="text"
            placeholder="Search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 bg-[#f8fafc] border-[#f1f5f9] placeholder:text-neutral-400 h-10 text-[14px]"
          />
        </div>

        {/* Products List */}
        <div className="space-y-4">
          {filteredProducts.length === 0 ? (
            <EmptyState message="No products found" className="py-10" />
          ) : (
            filteredProducts.map((product, index) => (
              <div
                key={index}
                className="flex items-center justify-between pb-4 border-b border-[#f1f5f9] last:border-0"
              >
                <div className="flex items-center gap-3">
                  {/* Product Image */}
                  <div className="w-12 h-12 bg-[#f8fafc] rounded-lg flex items-center justify-center overflow-hidden border border-[#f1f5f9]">
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
                  {/* Product Info */}
                  <div>
                    <p className="text-[14px] font-bold text-[#334155] line-clamp-1">
                      {product.name}
                    </p>
                    <p className="text-[12px] text-neutral-400 font-medium">
                      Item: {product.itemCode}
                    </p>
                  </div>
                </div>
                {/* Price */}
                <p className="text-[14px] font-bold text-[#0f172a]">
                  $
                  {typeof product.price === "number"
                    ? product.price.toLocaleString()
                    : product.price}
                </p>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
