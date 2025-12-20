import { useState, useEffect } from "react";
import SystemHeader from "@/components/dashboard/SystemHeader";
import WaterLevelCard from "@/components/dashboard/WaterLevelCard";
import RainStatusCard from "@/components/dashboard/RainStatusCard";
import ValveStatusCard from "@/components/dashboard/ValveStatusCard";

/**
 * ESP32 Rainwater Harvesting Monitoring System Dashboard
 * 
 * INTEGRATION NOTES FOR ESP32:
 * Replace the simulated data fetch with actual ESP32 sensor values.
 * The ESP32 web server should expose an endpoint (e.g., /api/data) 
 * that returns JSON in this format:
 * {
 *   "waterLevel": 75,      // 0-100 percentage
 *   "rainStatus": true,    // true = raining, false = not raining
 *   "valveStatus": true    // true = open, false = closed
 * }
 */

// Placeholder variables for ESP32 sensor values
// In production, these would be fetched from the ESP32 web server
interface SensorData {
  waterLevel: number;    // 0-100 percentage
  rainStatus: boolean;   // true = raining, false = not raining
  valveStatus: boolean;  // true = open, false = closed
}

const Index = () => {
  // State for sensor data
  const [sensorData, setSensorData] = useState<SensorData>({
    waterLevel: 65,
    rainStatus: true,
    valveStatus: true,
  });
  
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
  const [isConnected, setIsConnected] = useState<boolean>(true);

  // Auto-refresh every 2 seconds
  useEffect(() => {
    const fetchData = async () => {
      try {
        /**
         * ESP32 INTEGRATION:
         * Uncomment and modify the following code to fetch from your ESP32:
         * 
         * const response = await fetch('/api/data');
         * const data = await response.json();
         * setSensorData({
         *   waterLevel: data.waterLevel,
         *   rainStatus: data.rainStatus,
         *   valveStatus: data.valveStatus
         * });
         * setIsConnected(true);
         */
        
        // Simulated data for demonstration
        // Remove this block when connecting to actual ESP32
        setSensorData({
          waterLevel: Math.floor(Math.random() * 40) + 50, // 50-90%
          rainStatus: Math.random() > 0.3,
          valveStatus: Math.random() > 0.4,
        });
        
        setLastUpdate(new Date());
        setIsConnected(true);
      } catch (error) {
        console.error('Failed to fetch sensor data:', error);
        setIsConnected(false);
      }
    };

    // Initial fetch
    fetchData();

    // Set up interval for auto-refresh every 2 seconds
    const interval = setInterval(fetchData, 2000);

    // Cleanup interval on component unmount
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      {/* Background glow effect */}
      <div className="fixed inset-0 background-glow pointer-events-none" />
      
      <div className="relative z-10 container mx-auto px-4 py-8 max-w-4xl">
        <SystemHeader lastUpdate={lastUpdate} isConnected={isConnected} />
        
        <main className="space-y-6">
          {/* Water Level - Full width */}
          <WaterLevelCard level={sensorData.waterLevel} />
          
          {/* Rain and Valve Status - Side by side on larger screens */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <RainStatusCard isRaining={sensorData.rainStatus} />
            <ValveStatusCard isOpen={sensorData.valveStatus} />
          </div>
        </main>
        
        {/* Footer */}
        <footer className="mt-12 text-center text-muted-foreground text-sm animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
          <p>ESP32 Rainwater Harvesting System • Auto-refresh: 2s</p>
        </footer>
      </div>
    </div>
  );
};

export default Index;
