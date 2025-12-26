import { useNavigate } from "react-router";
import { Button } from "@/components/ui/button";
import CategoryCard from "@/components/dashboard/categories/CategoryCard";
import ProductsTable from "@/components/dashboard/categories/ProductsTable";
import { Plus } from "lucide-react";
import { useCategory } from "@/hooks/useCategory";
import { CategoryCardSkeleton } from "@/components/shared/skeletons";
import { EmptyState } from "@/components/shared/EmptyState";

export default function Categories() {
  const navigate = useNavigate();
  const { data, isFetching } = useCategory();

  return (
    <div className="space-y-8 max-w-[1600px] mx-auto min-w-0">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <h2 className="text-2xl font-semibold text-[#111827]">Discover</h2>
        </div>
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <Button
            className="bg-[#4EA674] hover:bg-[#3d8a5e] text-white"
            onClick={() => navigate("/dashboard/categories/add")}
          >
            <Plus className="h-4 w-4 sm:mr-2" />
            <span className="hidden sm:inline">Add Category</span>
          </Button>
        </div>
      </div>

      {/* Categories Grid Wrapper */}
      <div className="w-full mb-8">
        {isFetching ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <CategoryCardSkeleton key={i} />
            ))}
          </div>
        ) : data?.data && data.data.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-3">
            {data.data.map((category) => (
              <CategoryCard key={category.id} category={category} />
            ))}
          </div>
        ) : (
          <EmptyState message="No categories found" />
        )}
      </div>

      {/* Products Table Section */}
      <div className="mt-12">
        <ProductsTable />
      </div>
    </div>
  );
}
