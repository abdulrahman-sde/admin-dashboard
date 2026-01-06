import { useMemo } from "react";
import {
  ComposableMap,
  Geographies,
  Geography,
  ZoomableGroup,
} from "react-simple-maps";
import { scaleLinear } from "d3-scale";
import { useGetCustomerDemographicsQuery } from "@/lib/store/services/reportsApi";

const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

const CustomerDemographicsMap = () => {
  const { data, isLoading } = useGetCustomerDemographicsQuery();

  const countrySales = useMemo(() => {
    if (!data) return {};
    return data.demographics.reduce((acc, curr) => {
      acc[curr.country] = curr.sales;
      return acc;
    }, {} as Record<string, number>);
  }, [data]);

  const maxValue = useMemo(() => {
    if (!data) return 0;
    return Math.max(...data.demographics.map((d) => d.sales));
  }, [data]);

  const colorScale = scaleLinear<string>()
    .domain([0, maxValue || 1000])
    .range(["#F5F5F5", "#10B981"]);

  if (isLoading)
    return (
      <div className="h-[300px] flex items-center justify-center">
        Loading Map...
      </div>
    );

  return (
    <div className="w-full h-[500px] rounded-xl border border-gray-100 bg-white p-6 shadow-sm overflow-hidden">
      <h3 className="mb-8 text-base font-bold text-gray-900">
        Customer Demographics
      </h3>
      <div className="flex flex-col-reverse lg:flex-row h-full gap-8">
        {/* Legend */}
        <div className="w-full lg:w-48 shrink-0 space-y-6 overflow-y-auto">
          {data?.demographics.map((item) => (
            <div key={item.country} className="flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <div
                  className="w-3.5 h-3.5 rounded-sm"
                  style={{ backgroundColor: colorScale(item.sales) }}
                />
                <span className="text-[13px] text-[#8E92BC] font-medium">
                  {item.country}
                </span>
              </div>
              <span className="text-[19px] font-bold text-gray-900 ml-5.5">
                {item.sales.toLocaleString()}
              </span>
            </div>
          ))}
        </div>

        {/* Map */}
        <div className="flex-1 relative min-h-[350px]">
          <ComposableMap
            projectionConfig={{ scale: 190, rotate: [-10, 0, 0] }} // Increased scale slightly
            className="w-full h-full"
            style={{ width: "100%", height: "100%" }}
          >
            <ZoomableGroup>
              <Geographies geography={geoUrl}>
                {({ geographies }) =>
                  geographies.map((geo) => {
                    const countryName = geo.properties.name;
                    const sales =
                      countrySales[countryName] ||
                      (countryName === "United States of America"
                        ? countrySales["United States"]
                        : 0) ||
                      0;

                    return (
                      <Geography
                        key={geo.rsmKey}
                        geography={geo}
                        fill={sales > 0 ? colorScale(sales) : "#F5F4F6"}
                        stroke="#D6D6DA"
                        strokeWidth={0.5}
                        style={{
                          default: { outline: "none" },
                          hover: { fill: "#34D399", outline: "none" },
                          pressed: { outline: "none" },
                        }}
                      />
                    );
                  })
                }
              </Geographies>
            </ZoomableGroup>
          </ComposableMap>
        </div>
      </div>
    </div>
  );
};

export default CustomerDemographicsMap;
