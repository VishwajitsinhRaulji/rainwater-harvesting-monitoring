import { useMemo } from "react";
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts";
import { TrendingUp } from "lucide-react";

interface WaterHistoryChartProps {
  currentLevel: number;
  historicalData: { time: string; level: number }[];
}

const WaterHistoryChart = ({ historicalData }: WaterHistoryChartProps) => {
  const averageLevel = useMemo(() => {
    if (historicalData.length === 0) return 0;
    const sum = historicalData.reduce((acc, item) => acc + item.level, 0);
    return Math.round(sum / historicalData.length);
  }, [historicalData]);

  const minLevel = useMemo(() => {
    if (historicalData.length === 0) return 0;
    return Math.min(...historicalData.map(d => d.level));
  }, [historicalData]);

  const maxLevel = useMemo(() => {
    if (historicalData.length === 0) return 100;
    return Math.max(...historicalData.map(d => d.level));
  }, [historicalData]);

  return (
    <div className="card-gradient rounded-lg p-6 shadow-card border border-border animate-fade-in-up" style={{ animationDelay: '0.25s' }}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-water/20">
            <TrendingUp className="w-6 h-6 text-water" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-foreground">24-Hour History</h2>
            <p className="text-xs text-muted-foreground">Water level trends</p>
          </div>
        </div>
        
        {/* Stats */}
        <div className="flex gap-4 text-right">
          <div>
            <p className="text-xs text-muted-foreground">Avg</p>
            <p className="text-sm font-mono text-water">{averageLevel}%</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Min</p>
            <p className="text-sm font-mono text-warning">{minLevel}%</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Max</p>
            <p className="text-sm font-mono text-success">{maxLevel}%</p>
          </div>
        </div>
      </div>
      
      {/* Chart */}
      <div className="h-48 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={historicalData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="waterGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="hsl(199 89% 48%)" stopOpacity={0.6} />
                <stop offset="100%" stopColor="hsl(199 89% 48%)" stopOpacity={0.05} />
              </linearGradient>
            </defs>
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
              itemStyle={{ color: 'hsl(199 89% 48%)' }}
              formatter={(value: number) => [`${value}%`, 'Water Level']}
            />
            <Area 
              type="monotone" 
              dataKey="level" 
              stroke="hsl(199 89% 48%)"
              strokeWidth={2}
              fill="url(#waterGradient)"
              dot={false}
              activeDot={{ 
                r: 4, 
                fill: 'hsl(199 89% 48%)', 
                stroke: 'hsl(220 18% 12%)', 
                strokeWidth: 2 
              }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default WaterHistoryChart;
