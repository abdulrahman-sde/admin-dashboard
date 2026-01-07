import {
  ComposableMap,
  Geographies,
  Geography,
  ZoomableGroup,
} from "react-simple-maps";
import { useCustomerDemographics } from "@/hooks/reports/useCustomerDemographics";

const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

const CustomerDemographicsMap = () => {
  const { sortedRegions, countrySales, getColor, isLoading } =
    useCustomerDemographics();

  if (isLoading)
    return (
      <div className="h-[500px] flex items-center justify-center bg-white rounded-2xl">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );

  return (
    <div className="w-full h-[500px] bg-white p-8 rounded-2xl relative">
      <h3 className="text-xl font-bold text-[#151D48] mb-8">
        Customer Demographics
      </h3>

      <div className="flex h-full gap-8">
        {/* Legend */}
        <div className="w-48 shrink-0 flex flex-col gap-8 pt-4">
          {sortedRegions.map((region) => (
            <div key={region.name} className="flex flex-col gap-1.5">
              <div className="flex items-center gap-2.5">
                <div
                  className="size-3.5 rounded-md"
                  style={{ backgroundColor: region.color }}
                />
                <span className="text-[15px] font-medium text-[#8E92BC]">
                  {region.name}
                </span>
              </div>
              <p className="text-[24px] font-bold text-[#151D48] leading-tight">
                {region.value.toLocaleString()}
              </p>
            </div>
          ))}
        </div>

        {/* Map Container */}
        <div className="flex-1 relative">
          {/* Zoom Buttons */}
          <div className="absolute top-0 right-0 z-10 flex flex-col gap-2">
            <button className="size-9 flex items-center justify-center bg-white border border-[#E9EDF7] rounded-lg text-[#8E92BC] hover:bg-gray-50 transition-colors">
              <span className="text-xl font-medium">+</span>
            </button>
            <button className="size-9 flex items-center justify-center bg-white border border-[#E9EDF7] rounded-lg text-[#8E92BC] hover:bg-gray-50 transition-colors">
              <span className="text-xl font-medium">−</span>
            </button>
          </div>

          <ComposableMap
            projectionConfig={{ scale: 200, rotate: [-10, 0, 0] }}
            className="w-full h-full"
          >
            <ZoomableGroup zoom={1} maxZoom={1}>
              <Geographies geography={geoUrl}>
                {({ geographies }: { geographies: any[] }) =>
                  geographies.map((geo: any) => {
                    const countryName = geo.properties.name as string;
                    const sales =
                      countrySales[countryName] ||
                      (countryName === "United States of America"
                        ? countrySales["United States"]
                        : 0) ||
                      0;
                    const fill = getColor(countryName, sales);

                    return (
                      <Geography
                        key={geo.rsmKey}
                        geography={geo}
                        fill={fill}
                        stroke="#E9EDF7"
                        strokeWidth={0.5}
                        style={{
                          default: { outline: "none" },
                          hover: { fill: "#6467F2", outline: "none" },
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
