import { useGetCategoriesQuery } from "@/lib/store/services/categories/categoryApi";

export const useCategory = () => {
  const { data, isError, isFetching } = useGetCategoriesQuery();

  return {
    data,
    isFetching,
    isError,
  };
};
