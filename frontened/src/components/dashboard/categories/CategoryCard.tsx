import { Card, CardContent } from "@/components/ui/card";
import type { CategoryCardProps } from "@/types/categories.types";
import { useNavigate } from "react-router";

export default function CategoryCard({ category }: CategoryCardProps) {
  const navigate = useNavigate();

  return (
    <Card
      onClick={() => navigate(`/dashboard/categories/edit/${category.id}`)}
      className="group cursor-pointer rounded-lg border border-[#E5E7EB] bg-white h-20 transition-none overflow-hidden shadow-none w-full border-solid"
    >
      <CardContent className="p-3 h-full flex items-center gap-4">
        <div className="h-14 w-14 rounded-lg bg-gray-50/50 border border-[#E5E7EB] flex items-center justify-center overflow-hidden shrink-0">
          {category.image ? (
            <img
              src={category.image}
              alt={category.name}
              className="w-full h-full object-contain p-1"
              onError={(e) => {
                e.currentTarget.style.display = "none";
                const parent = e.currentTarget.parentElement;
                if (parent) {
                  parent.innerHTML = `<span class="text-sm text-gray-400 uppercase">${category.name.charAt(
                    0
                  )}</span>`;
                }
              }}
            />
          ) : (
            <span className="text-sm text-gray-400 uppercase">
              {category.name.charAt(0)}
            </span>
          )}
        </div>

        <div className="flex flex-col flex-1 min-w-0">
          <span className="text-[16px] font-medium  text-[#111827] truncate tracking-tight">
            {category.name}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
