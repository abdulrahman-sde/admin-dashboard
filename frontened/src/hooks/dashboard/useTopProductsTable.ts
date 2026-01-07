import { useState, useMemo } from "react";

interface Product {
  name: string;
  itemCode: string;
  price: string | number;
  image: string;
}

export function useTopProductsTable(data: Product[] = []) {
  const [search, setSearch] = useState("");

  const filteredProducts = useMemo(() => {
    return data
      .filter((product) =>
        product.name.toLowerCase().includes(search.toLowerCase())
      )
      .slice(0, 4);
  }, [data, search]);

  return {
    search,
    setSearch,
    filteredProducts,
  };
}
