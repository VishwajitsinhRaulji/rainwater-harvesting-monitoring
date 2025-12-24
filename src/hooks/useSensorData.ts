import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface SensorReading {
  timestamp: string;
  waterLevel: number;
  rainStatus: boolean;
  valveStatus: boolean;
}

export const useSensorData = () => {
  const [readings, setReadings] = useState<SensorReading[]>([]);
  const [latestReading, setLatestReading] = useState<SensorReading | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isConnected, setIsConnected] = useState(true);

  const fetchData = useCallback(async () => {
    try {
      const { data, error } = await supabase.functions.invoke('sensor-data', {
        method: 'GET',
      });

      if (error) throw error;

      const sensorData = data?.data || [];
      setReadings(sensorData);
      
      if (sensorData.length > 0) {
        setLatestReading(sensorData[sensorData.length - 1]);
      }
      
      setIsConnected(true);
    } catch (error) {
      console.error('Failed to fetch sensor data:', error);
      setIsConnected(false);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const downloadCSV = useCallback(async () => {
    try {
      const projectId = import.meta.env.VITE_SUPABASE_PROJECT_ID;
      const csvUrl = `https://${projectId}.supabase.co/storage/v1/object/public/sensor-data/sensor_readings.csv`;
      
      const link = document.createElement('a');
      link.href = csvUrl;
      link.download = 'sensor_readings.csv';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast.success('CSV download started');
    } catch (error) {
      console.error('Download failed:', error);
      toast.error('Failed to download CSV');
    }
  }, []);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 5000); // Poll every 5 seconds
    return () => clearInterval(interval);
  }, [fetchData]);

  return {
    readings,
    latestReading,
    isLoading,
    isConnected,
    downloadCSV,
    refetch: fetchData,
  };
};
