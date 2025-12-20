import { useState, useEffect, useCallback } from "react";
import SystemHeader from "@/components/dashboard/SystemHeader";
import WaterLevelCard from "@/components/dashboard/WaterLevelCard";
import RainStatusCard from "@/components/dashboard/RainStatusCard";
import ValveStatusCard from "@/components/dashboard/ValveStatusCard";
import WaterHistoryChart from "@/components/dashboard/WaterHistoryChart";

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
 * 
 * For historical data, you can either:
 * 1. Store readings on ESP32 and expose via /api/history endpoint
 * 2. Store in browser localStorage (current implementation)
 */

interface SensorData {
  waterLevel: number;
  rainStatus: boolean;
  valveStatus: boolean;
}

interface HistoricalDataPoint {
  time: string;
  level: number;
  timestamp: number;
}

// Generate initial 24-hour historical data for demo
const generateInitialHistory = (): HistoricalDataPoint[] => {
  const data: HistoricalDataPoint[] = [];
  const now = Date.now();
  
  for (let i = 23; i >= 0; i--) {
    const timestamp = now - (i * 60 * 60 * 1000); // Each hour
    const date = new Date(timestamp);
    data.push({
      time: date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      level: Math.floor(Math.random() * 40) + 40, // 40-80%
      timestamp,
    });
  }
  
  return data;
};

const Index = () => {
  const [sensorData, setSensorData] = useState<SensorData>({
    waterLevel: 65,
    rainStatus: true,
    valveStatus: true,
  });
  
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
  const [isConnected, setIsConnected] = useState<boolean>(true);
  const [historicalData, setHistoricalData] = useState<HistoricalDataPoint[]>(generateInitialHistory);

  // Add new data point to history (simulates hourly recording)
  const addHistoricalDataPoint = useCallback((level: number) => {
    setHistoricalData(prev => {
      const now = Date.now();
      const lastPoint = prev[prev.length - 1];
      
      // Only add new point if at least 1 minute has passed (for demo, use 1 min instead of 1 hour)
      if (lastPoint && now - lastPoint.timestamp < 60 * 1000) {
        // Update the last point with current level
        const updated = [...prev];
        updated[updated.length - 1] = {
          ...lastPoint,
          level,
        };
        return updated;
      }
      
      const newPoint: HistoricalDataPoint = {
        time: new Date(now).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        level,
        timestamp: now,
      };
      
      // Keep last 24 data points
      const updated = [...prev, newPoint];
      if (updated.length > 24) {
        updated.shift();
      }
      
      return updated;
    });
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        /**
         * ESP32 INTEGRATION:
         * const response = await fetch('/api/data');
         * const data = await response.json();
         * setSensorData(data);
         */
        
        // Simulated data for demonstration
        const newLevel = Math.floor(Math.random() * 40) + 50;
        setSensorData({
          waterLevel: newLevel,
          rainStatus: Math.random() > 0.3,
          valveStatus: Math.random() > 0.4,
        });
        
        // Record to history
        addHistoricalDataPoint(newLevel);
        
        setLastUpdate(new Date());
        setIsConnected(true);
      } catch (error) {
        console.error('Failed to fetch sensor data:', error);
        setIsConnected(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 2000);
    return () => clearInterval(interval);
  }, [addHistoricalDataPoint]);

  return (
    <div className="min-h-screen bg-background">
      <div className="fixed inset-0 background-glow pointer-events-none" />
      
      <div className="relative z-10 container mx-auto px-4 py-8 max-w-4xl">
        <SystemHeader lastUpdate={lastUpdate} isConnected={isConnected} />
        
        <main className="space-y-6">
          <WaterLevelCard level={sensorData.waterLevel} />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <RainStatusCard isRaining={sensorData.rainStatus} />
            <ValveStatusCard isOpen={sensorData.valveStatus} />
          </div>
          
          {/* Historical Chart */}
          <WaterHistoryChart 
            currentLevel={sensorData.waterLevel} 
            historicalData={historicalData.map(d => ({ time: d.time, level: d.level }))} 
          />
        </main>
        
        <footer className="mt-12 text-center text-muted-foreground text-sm animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
          <p>ESP32 Rainwater Harvesting System • Auto-refresh: 2s</p>
        </footer>
      </div>
    </div>
  );
};

export default Index;
