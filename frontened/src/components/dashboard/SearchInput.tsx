import { Search, Loader2 } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router";
import { useSearchQuery } from "@/lib/store/services/search/searchApi";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";

export function SearchInput() {
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, 400);

    return () => clearTimeout(timer);
  }, [query]);

  const { data, isFetching } = useSearchQuery(debouncedQuery, {
    skip: !debouncedQuery || debouncedQuery.length < 2,
  });

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (debouncedQuery.length >= 2) {
      setIsOpen(true);
    } else {
      setIsOpen(false);
    }
  }, [debouncedQuery]);

  const handleSelect = (result: {
    id: string;
    type: "product" | "category" | "customer";
  }) => {
    setIsOpen(false);
    setQuery("");

    switch (result.type) {
      case "product":
        navigate(`/dashboard/products/edit/${result.id}`);
        break;
      case "category":
        navigate(`/dashboard/categories/edit/${result.id}`);
        break;
      case "customer":
        navigate(`/dashboard/customers/${result.id}`);
        break;
    }
  };

  return (
    <div
      ref={containerRef}
      className="relative flex items-center bg-[#F9FAFB] rounded-[50px] w-full md:w-[220px] lg:w-[380px] h-[45px] border border-transparent focus-within:border-[#4EA674] transition-all"
    >
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search data, users, or reports"
        className="w-full bg-transparent border-0 ring-0 hover:ring-0 focus:ring-0 outline-none px-6 pr-12 text-sm placeholder:text-[#A1A7C4] placeholder:text-[15.5px] placeholder:font-normal"
      />
      <div className="absolute right-4 flex items-center pointer-events-none">
        {isFetching ? (
          <Loader2 size={20} className="text-muted-foreground animate-spin" />
        ) : (
          <Search size={18} className="text-[#8E92BC]" />
        )}
      </div>

      {/* Dropdown Results */}
      {isOpen && query.length >= 2 && (
        <div className="absolute top-12 left-0 w-full bg-white rounded-lg shadow-lg border border-gray-100 py-2 z-50 max-h-[400px] overflow-y-auto">
          {isFetching ? (
            <div className="flex flex-col gap-2 p-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="flex items-center gap-3 px-2 py-2">
                  <Skeleton className="h-8 w-8 rounded-full" />
                  <div className="flex flex-col gap-1 flex-1">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-3 w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          ) : data?.data && data.data.length > 0 ? (
            <div className="flex flex-col">
              {data.data.map((result) => (
                <button
                  key={`${result.type}-${result.id}`}
                  onClick={() => handleSelect(result)}
                  className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors text-left w-full"
                >
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={result.pic || ""} alt={result.name} />
                    <AvatarFallback className="text-[10px] bg-primary/10 text-primary uppercase">
                      {result.name.substring(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-gray-900 truncate">
                      {result.name}
                    </span>
                    <span className="text-xs text-muted-foreground capitalize">
                      {result.type}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div className="px-4 py-8 text-center text-sm text-gray-500">
              No results found
            </div>
          )}
        </div>
      )}
    </div>
  );
}
