import { StatCard } from "@/components/shared/StatCard";
import { OrdersTable } from "@/components/dashboard/orders/OrdersTable";
import { useOrders } from "@/hooks/orders/useOrders";

export default function Orders() {
  const {
    orders,
    isFetching,
    currentPage,
    setCurrentPage,
    totalPages,
    totalOrders,
    search,
    setSearch,
    pages,
    statusCounts,
    handleTabChange,
    activeTab,
    dynamicStats,
    sortBy,
    setSortBy,
    sortOrder,
    setSortOrder,
    paymentStatus,
    setPaymentStatus,
  } = useOrders();

  return (
    <div className="space-y-6">
      {/* Orders Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {dynamicStats.map((stat, index) => (
          <StatCard
            key={index}
            title={stat.title}
            value={stat.value}
            change={stat.change}
            subtitle={stat.subtitle}
            isLoading={isFetching}
          />
        ))}
      </div>

      {/* Orders Table */}
      <OrdersTable
        data={orders}
        currentPage={currentPage}
        totalPages={totalPages}
        totalOrders={totalOrders}
        pages={pages}
        onPageChange={setCurrentPage}
        activeTab={activeTab}
        onTabChange={handleTabChange}
        search={search}
        onSearchChange={setSearch}
        isLoading={isFetching}
        statusCounts={statusCounts}
        sortBy={sortBy}
        setSortBy={setSortBy}
        sortOrder={sortOrder}
        setSortOrder={setSortOrder}
        paymentStatus={paymentStatus}
        onPaymentStatusChange={setPaymentStatus}
      />
    </div>
  );
}
