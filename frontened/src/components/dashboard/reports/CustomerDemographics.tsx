import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Minus } from "lucide-react";
import { Button } from "@/components/ui/button";

export function CustomerDemographics() {
  return (
    <Card className="border-none shadow-sm h-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-base font-bold">
          Customer Demographics
        </CardTitle>
        <div className="flex flex-col gap-1">
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8 rounded-none border-b-0"
          >
            <Plus className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8 rounded-none"
          >
            <Minus className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="relative min-h-[400px]">
        {/* Legend Overlay */}
        <div className="absolute top-0 left-0 space-y-4 bg-white/80 p-2 rounded-lg backdrop-blur-sm z-10">
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 bg-emerald-500 rounded-sm"></span>
              <span className="text-sm text-gray-500">United States</span>
            </div>
            <span className="text-xl font-bold ml-5">29.051</span>
          </div>

          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 bg-amber-400 rounded-sm"></span>
              <span className="text-sm text-gray-500">Europe</span>
            </div>
            <span className="text-xl font-bold ml-5">18.041</span>
          </div>

          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 bg-orange-500 rounded-sm"></span>
              <span className="text-sm text-gray-500">Australia</span>
            </div>
            <span className="text-xl font-bold ml-5">10.430</span>
          </div>

          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 bg-gray-200 rounded-sm"></span>
              <span className="text-sm text-gray-500">Other</span>
            </div>
            <span className="text-xl font-bold ml-5">5.420</span>
          </div>
        </div>

        {/* Map Placeholder - In a real app, use react-simple-maps or leaflet */}
        <div className="flex items-center justify-center h-full w-full bg-slate-50 rounded-lg border border-dashed border-slate-200">
          <span className="text-slate-400 font-medium">
            Interactive World Map Component
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
