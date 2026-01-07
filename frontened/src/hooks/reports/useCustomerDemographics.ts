import { useMemo } from "react";
import { useGetCustomerDemographicsQuery } from "@/lib/store/services/reportsApi";
import { mockCountrySalesData } from "@/constants/reportsData";

const europeCountries = [
  "Germany",
  "France",
  "UK",
  "United Kingdom",
  "Italy",
  "Spain",
];

const regionDefs = [
  { name: "United States", color: "#4EA674" },
  { name: "Europe", color: "#FFC107" },
  { name: "Australia", color: "#FC8B0E" },
  { name: "Other", color: "#314369" },
];

export function useCustomerDemographics() {
  const { data: demoData, isLoading } = useGetCustomerDemographicsQuery();

  const dataToUse = useMemo(() => {
    return demoData?.demographics && demoData.demographics.length > 0
      ? demoData.demographics
      : mockCountrySalesData;
  }, [demoData]);

  const countrySales = useMemo(() => {
    return dataToUse.reduce((acc, curr) => {
      acc[curr.country] = curr.sales;
      return acc;
    }, {} as Record<string, number>);
  }, [dataToUse]);

  const sortedRegions = useMemo(() => {
    const computed = regionDefs.map((region) => {
      let value = 0;
      if (region.name === "United States") {
        value =
          dataToUse.find((d) => d.country === "United States")?.sales || 0;
      } else if (region.name === "Europe") {
        value = dataToUse
          .filter((d) => europeCountries.includes(d.country))
          .reduce((sum, d) => sum + d.sales, 0);
      } else if (region.name === "Australia") {
        value = dataToUse.find((d) => d.country === "Australia")?.sales || 0;
      } else if (region.name === "Other") {
        value = dataToUse
          .filter(
            (d) =>
              !["United States", "Australia", ...europeCountries].includes(
                d.country
              )
          )
          .reduce((sum, d) => sum + d.sales, 0);
      }
      return { ...region, value };
    });

    return computed.sort((a, b) => b.value - a.value);
  }, [dataToUse]);

  const getColor = (country: string, sales: number) => {
    if (sales === 0) return "#F5F6FA";
    if (country === "United States" || country === "United States of America")
      return "#4EA674";
    if (europeCountries.includes(country)) return "#FFC107";
    if (country === "Australia") return "#FC8B0E";
    return "#314369";
  };

  return {
    sortedRegions,
    countrySales,
    getColor,
    isLoading,
  };
}
