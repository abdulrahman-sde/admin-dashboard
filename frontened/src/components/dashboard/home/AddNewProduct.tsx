"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronRight, CirclePlus, Plus, PlusCircle } from "lucide-react";
import { useGetCategoriesQuery } from "@/lib/store/services/categories/categoryApi";
import { useGetProductsQuery } from "@/lib/store/services/products/productsApi";
import { AddNewProductSkeleton } from "@/components/shared/skeletons";
import { Link } from "react-router";

export default function AddNewProduct() {
  const { data: categoriesData, isLoading: loadingCategories } =
    useGetCategoriesQuery();
  const { data: productsData, isLoading: loadingProducts } =
    useGetProductsQuery({
      page: 1,
      limit: 3,
      sortBy: "createdAt",
      sortOrder: "desc",
    });

  const categories = categoriesData?.data?.slice(0, 3) || [];
  const products = productsData?.data?.slice(0, 3) || [];

  // Show skeleton while both are loading
  if (loadingCategories && loadingProducts) {
    return <AddNewProductSkeleton />;
  }

  return (
    <Card className="shadow-sm border-0">
      <CardHeader className="flex flex-row items-center justify-between ">
        <h3 className="font-semibold">Add New Product</h3>
        <Link to="/dashboard/products/add">
          <button className="text-tertiary text-sm hover:underline flex items-center gap-1">
            <CirclePlus className="h-4 w-4" />
            Add New
          </button>
        </Link>
      </CardHeader>

      <CardContent className="space-y-2">
        {/* Categories Section */}
        <div>
          <p className="text-[14px] text-muted-foreground mb-3">Categories</p>
          <div className=" flex flex-col gap-3">
            {categories.length > 0 ? (
              <>
                {categories.map((category) => (
                  <Link
                    key={category.id}
                    to={`/dashboard/categories/edit/${category.id}`}
                  >
                    <button className="w-full flex items-center shadow-sm  justify-between p-3 cursor-pointer rounded-lg hover:bg-muted/50 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-muted rounded-lg border border-gray-300 flex items-center justify-center">
                          {category.image ? (
                            <img
                              src={category.image}
                              alt={category.name}
                              className="w-6 h-6 object-cover "
                            />
                          ) : (
                            <div className="w-6 h-6 bg-primary/20 rounded flex items-center justify-center text-xs font-medium text-primary">
                              {category.name.charAt(0).toUpperCase()}
                            </div>
                          )}
                        </div>
                        <span className="text-sm font-medium">
                          {category.name}
                        </span>
                      </div>
                      <ChevronRight className="h-4 w-4 text-muted-foreground" />
                    </button>
                  </Link>
                ))}
                <Link
                  to="/dashboard/categories"
                  className="flex justify-center"
                >
                  <button className="text-tertiary text-center text-sm hover:underline mt-3">
                    See more
                  </button>
                </Link>
              </>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-4">
                No categories available
              </p>
            )}
          </div>
        </div>

        {/* Products Section */}
        <div>
          <p className="text-[14px] text-muted-foreground mb-3">Product</p>
          <div className="space-y-3">
            {products.length > 0 ? (
              <>
                {products.map((product) => (
                  <>
                    {" "}
                    <div
                      key={product.id}
                      className="flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center overflow-hidden">
                          {product.thumbnail || product.images?.[0] ? (
                            <img
                              src={product.thumbnail || product.images[0]}
                              alt={product.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full bg-muted flex items-center justify-center text-xs font-medium text-muted-foreground">
                              {product.name.charAt(0).toUpperCase()}
                            </div>
                          )}
                        </div>
                        <div>
                          <p className="text-[14px] text-black line-clamp-1">
                            {product.name}
                          </p>
                          <p className="text-[13px] text-[#4EA674]">
                            ${product.price.toFixed(2)}
                          </p>
                        </div>
                      </div>
                      <Link to={`/dashboard/products/edit/${product.id}`}>
                        <Button
                          size="sm"
                          className="bg-primary text-white hover:bg-primary/90 rounded-2xl"
                        >
                          <PlusCircle className="h-3 w-3" />
                          <span className="text-[12px]">Add</span>
                        </Button>
                      </Link>
                    </div>
                    <div className="h-px w-full bg-gray-200" />
                  </>
                ))}
                <Link to="/dashboard/products" className="flex justify-center">
                  <button className="text-tertiary text-sm hover:underline mt-3">
                    See more
                  </button>
                </Link>
              </>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-4">
                No products available
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
