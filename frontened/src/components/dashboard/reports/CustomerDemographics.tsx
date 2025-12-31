import { Plus, Minus } from "lucide-react";

export function CustomerDemographics() {
  return (
    <div className="bg-white p-8 rounded-2xl shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07)] h-full flex flex-col relative overflow-hidden">
      <div className="flex flex-row items-center justify-between mb-8">
        <h2 className="text-[17px] font-bold text-gray-900">
          Customer Demographics
        </h2>
        <div className="flex flex-col border border-gray-100 rounded-lg overflow-hidden shrink-0">
          <button className="p-2 hover:bg-gray-50 border-b border-gray-100 flex items-center justify-center">
            <Plus className="h-4 w-4 text-[#8E92BC]" />
          </button>
          <button className="p-2 hover:bg-gray-50 flex items-center justify-center">
            <Minus className="h-4 w-4 text-[#8E92BC]" />
          </button>
        </div>
      </div>

      <div className="flex-1 relative min-h-[400px]">
        {/* Legend Overlay */}
        <div className="absolute top-0 left-0 space-y-6 z-10">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <div className="w-3.5 h-3.5 bg-[#4EA674] rounded-sm" />
              <span className="text-[13px] text-[#8E92BC] font-medium">
                United States
              </span>
            </div>
            <span className="text-[19px] font-bold text-gray-900 ml-5.5">
              29.051
            </span>
          </div>

          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <div className="w-3.5 h-3.5 bg-[#FFBF00] rounded-sm" />
              <span className="text-[13px] text-[#8E92BC] font-medium">
                Europe
              </span>
            </div>
            <span className="text-[19px] font-bold text-gray-900 ml-5.5">
              18.041
            </span>
          </div>

          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <div className="w-3.5 h-3.5 bg-[#FF8C00] rounded-sm" />
              <span className="text-[13px] text-[#8E92BC] font-medium">
                Australia
              </span>
            </div>
            <span className="text-[19px] font-bold text-gray-900 ml-5.5">
              10.430
            </span>
          </div>

          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <div className="w-3.5 h-3.5 bg-[#D7DBEC] rounded-sm" />
              <span className="text-[13px] text-[#8E92BC] font-medium">
                Other
              </span>
            </div>
            <span className="text-[19px] font-bold text-gray-900 ml-5.5">
              5.420
            </span>
          </div>
        </div>

        {/* Map Illustration - Matching the look in the image */}
        <div className="absolute inset-0 flex items-center justify-center opacity-70 pointer-events-none">
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/e/ec/World_map_blank_without_borders.svg"
            alt="World Map"
            className="w-full h-full object-contain filter grayscale invert brightness-90 sepia-[.2] opacity-30"
          />
        </div>
      </div>
    </div>
  );
}
