import { useParams } from "react-router";
import { useGetCustomerByIdQuery } from "@/lib/store/services/customers/customersApi";

export const useCustomerDetail = () => {
  const { id } = useParams<{ id: string }>();

  const { data, isFetching, isLoading, isError, error } =
    useGetCustomerByIdQuery(id!, {
      skip: !id,
    });

  const customer = data?.data;

  const getCustomerSince = () => {
    if (!customer?.createdAt) return "";
    const createdDate = new Date(customer.createdAt);
    const now = new Date();
    const diffInMonths =
      (now.getFullYear() - createdDate.getFullYear()) * 12 +
      (now.getMonth() - createdDate.getMonth());

    if (diffInMonths < 1) {
      const diffInDays = Math.floor(
        (now.getTime() - createdDate.getTime()) / (1000 * 60 * 60 * 24)
      );
      return `${diffInDays} days`;
    } else if (diffInMonths < 12) {
      return `${diffInMonths} months`;
    } else {
      const years = Math.floor(diffInMonths / 12);
      return `${years} year${years > 1 ? "s" : ""}`;
    }
  };

  return {
    customer,
    isFetching,
    isLoading,
    isError,
    error,
    customerSince: getCustomerSince(),
  };
};
