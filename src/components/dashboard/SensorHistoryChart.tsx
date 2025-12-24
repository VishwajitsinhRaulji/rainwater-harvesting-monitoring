import { useMemo } from "react";
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip, Legend } from "recharts";
import { TrendingUp, Download } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SensorReading {
  timestamp: string;
  waterLevel: number;
  rainStatus: boolean;
  valveStatus: boolean;
}

interface SensorHistoryChartProps {
  data: SensorReading[];
  onDownloadCSV: () => void;
}

const SensorHistoryChart = ({ data, onDownloadCSV }: SensorHistoryChartProps) => {
  const chartData = useMemo(() => {
    return data.slice(-50).map(d => ({
      time: new Date(d.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      waterLevel: d.waterLevel,
      rainStatus: d.rainStatus ? 100 : 0,
      valveStatus: d.valveStatus ? 100 : 0,
    }));
  }, [data]);

  const stats = useMemo(() => {
    if (data.length === 0) return { avg: 0, min: 0, max: 0 };
    const levels = data.map(d => d.waterLevel);
    return {
      avg: Math.round(levels.reduce((a, b) => a + b, 0) / levels.length),
      min: Math.min(...levels),
      max: Math.max(...levels),
    };
  }, [data]);

  return (
    <div className="card-gradient rounded-lg p-6 shadow-card border border-border animate-fade-in-up" style={{ animationDelay: '0.25s' }}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-water/20">
            <TrendingUp className="w-6 h-6 text-water" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-foreground">Sensor History</h2>
            <p className="text-xs text-muted-foreground">{data.length} readings stored</p>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          {/* Stats */}
          <div className="flex gap-4 text-right">
            <div>
              <p className="text-xs text-muted-foreground">Avg</p>
              <p className="text-sm font-mono text-water">{stats.avg}%</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Min</p>
              <p className="text-sm font-mono text-warning">{stats.min}%</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Max</p>
              <p className="text-sm font-mono text-success">{stats.max}%</p>
            </div>
          </div>
          
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onDownloadCSV}
            className="gap-2"
            disabled={data.length === 0}
          >
            <Download className="w-4 h-4" />
            CSV
          </Button>
        </div>
      </div>
      
      {/* Multi-line Chart */}
      <div className="h-64 w-full">
        {chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <XAxis 
                dataKey="time" 
                axisLine={false}
                tickLine={false}
                tick={{ fill: 'hsl(215 20% 55%)', fontSize: 10 }}
                interval="preserveStartEnd"
              />
              <YAxis 
                domain={[0, 100]}
                axisLine={false}
                tickLine={false}
                tick={{ fill: 'hsl(215 20% 55%)', fontSize: 10 }}
                tickFormatter={(value) => `${value}%`}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'hsl(220 18% 12%)',
                  border: '1px solid hsl(220 16% 20%)',
                  borderRadius: '8px',
                  boxShadow: '0 4px 24px hsl(0 0% 0% / 0.4)',
                }}
                labelStyle={{ color: 'hsl(210 40% 96%)', fontWeight: 600 }}
                formatter={(value: number, name: string) => {
                  if (name === 'waterLevel') return [`${value}%`, 'Water Level'];
                  if (name === 'rainStatus') return [value > 0 ? 'Raining' : 'Dry', 'Rain'];
                  if (name === 'valveStatus') return [value > 0 ? 'Open' : 'Closed', 'Valve'];
                  return [value, name];
                }}
              />
              <Legend 
                wrapperStyle={{ paddingTop: 10 }}
                formatter={(value) => {
                  if (value === 'waterLevel') return 'Water Level';
                  if (value === 'rainStatus') return 'Rain (100=Yes)';
                  if (value === 'valveStatus') return 'Valve (100=Open)';
                  return value;
                }}
              />
              <Line 
                type="monotone" 
                dataKey="waterLevel" 
                stroke="hsl(199 89% 48%)"
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4 }}
              />
              <Line 
                type="stepAfter" 
                dataKey="rainStatus" 
                stroke="hsl(210 90% 60%)"
                strokeWidth={2}
                dot={false}
                strokeDasharray="5 5"
              />
              <Line 
                type="stepAfter" 
                dataKey="valveStatus" 
                stroke="hsl(142 71% 45%)"
                strokeWidth={2}
                dot={false}
                strokeDasharray="3 3"
              />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-full flex items-center justify-center text-muted-foreground">
            <p>No sensor data yet. Connect your ESP32 to start recording.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SensorHistoryChart;
