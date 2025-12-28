import { useMemo } from "react";
import SystemHeader from "@/components/dashboard/SystemHeader";
import WaterLevelCard from "@/components/dashboard/WaterLevelCard";
import RainStatusCard from "@/components/dashboard/RainStatusCard";
import ValveStatusCard from "@/components/dashboard/ValveStatusCard";
import SensorHistoryChart from "@/components/dashboard/SensorHistoryChart";
import ESP32Instructions from "@/components/dashboard/ESP32Instructions";
import { useSensorData } from "@/hooks/useSensorData";

/**
 * ESP32 Rainwater Harvesting Monitoring System Dashboard
 * 
 * INTEGRATION:
 * The ESP32 sends sensor data via POST to the /sensor-data edge function.
 * Data is stored in a CSV file in Supabase Storage.
 * The dashboard fetches and displays the data in real-time.
 */

const Index = () => {
  const { readings, latestReading, isLoading, isConnected, downloadCSV } = useSensorData();

  // Show live data only in the history chart.
  // The summary cards stay at defaults (0%, Not Raining, CLOSED).
  const currentData = useMemo(() => ({
    waterLevel: 0,
    rainStatus: false,
    valveStatus: false,
  }), []);

  const lastUpdate = useMemo(() => null, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-water border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading sensor data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="fixed inset-0 background-glow pointer-events-none" />
      
      <div className="relative z-10 container mx-auto px-4 py-8 max-w-4xl">
        <SystemHeader lastUpdate={lastUpdate} isConnected={isConnected} />
        
        <main className="space-y-6">
          <WaterLevelCard level={currentData.waterLevel} />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <RainStatusCard isRaining={currentData.rainStatus} />
            <ValveStatusCard isOpen={currentData.valveStatus} />
          </div>
          
          {/* Multi-sensor History Chart */}
          <SensorHistoryChart 
            data={readings}
            onDownloadCSV={downloadCSV}
          />
          
          {/* ESP32 Code Instructions */}
          <ESP32Instructions />
        </main>
        
        <footer className="mt-12 text-center text-muted-foreground text-sm animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
          <p>ESP32 Rainwater Harvesting System • Auto-refresh: 5s</p>
          <p className="text-xs mt-1">{readings.length} readings stored in CSV</p>
        </footer>
      </div>
    </div>
  );
};

export default Index;
