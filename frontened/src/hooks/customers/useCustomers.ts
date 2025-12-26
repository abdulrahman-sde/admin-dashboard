import { useState } from "react";
import { customersApi } from "@/lib/store/services/customers/customersApi";
import type { CustomerStatus, CustomerRole } from "@/types/customers.types";
import { generatePagination } from "@/lib/utils";
import { useNavigate } from "react-router";

export const useCustomers = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [status, setStatus] = useState<CustomerStatus | undefined>(undefined);
  const [role, setRole] = useState<CustomerRole | undefined>(undefined);

  const navigate = useNavigate();

  const { data, isFetching, isError, error } =
    customersApi.useGetAllCustomersQuery({
      page: currentPage,
      limit: 10,
      status,
      role,
    });

  const totalPages = data?.pagination?.totalPages || 1;

  const pages = generatePagination(currentPage, totalPages);
  const handleRowClick = (customerId: string) => {
    const encodedId = encodeURIComponent(customerId);
    navigate(`/dashboard/customers/${encodedId}`);
  };

  return {
    customers: data?.data || [],
    pagination: data?.pagination,
    isFetching,
    isError,
    error,
    currentPage,
    setCurrentPage,
    totalPages,
    status,
    setStatus,
    role,
    setRole,
    pages,
    handleRowClick,
  };
};
