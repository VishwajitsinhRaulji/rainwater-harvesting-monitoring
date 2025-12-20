import { Droplets } from "lucide-react";

interface WaterLevelCardProps {
  level: number;
}

const WaterLevelCard = ({ level }: WaterLevelCardProps) => {
  const getWaterColor = () => {
    if (level >= 75) return "bg-water";
    if (level >= 40) return "bg-primary";
    if (level >= 20) return "bg-warning";
    return "bg-destructive";
  };

  return (
    <div className="card-gradient rounded-lg p-6 shadow-card border border-border animate-fade-in-up">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 rounded-lg bg-water/20">
          <Droplets className="w-6 h-6 text-water" />
        </div>
        <h2 className="text-lg font-semibold text-foreground">Water Tank Level</h2>
      </div>
      
      <div className="space-y-4">
        {/* Large percentage display */}
        <div className="flex items-baseline gap-1">
          <span className="text-5xl font-mono font-bold text-water drop-shadow-[0_0_15px_hsl(var(--water)/0.5)]">
            {level}
          </span>
          <span className="text-2xl font-mono text-water/70">%</span>
        </div>
        
        {/* Progress bar container */}
        <div className="relative h-4 bg-muted rounded-full overflow-hidden">
          {/* Water fill */}
          <div 
            className={`absolute left-0 top-0 h-full rounded-full transition-all duration-700 ease-out ${getWaterColor()}`}
            style={{ 
              width: `${level}%`,
              boxShadow: level > 0 ? 'var(--shadow-glow-water)' : 'none'
            }}
          >
            {/* Wave animation overlay */}
            <div className="absolute inset-0 opacity-30">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-foreground/20 to-transparent animate-water-wave" />
            </div>
          </div>
        </div>
        
        {/* Scale markers */}
        <div className="flex justify-between text-xs text-muted-foreground font-mono">
          <span>0%</span>
          <span>25%</span>
          <span>50%</span>
          <span>75%</span>
          <span>100%</span>
        </div>
      </div>
    </div>
  );
};

export default WaterLevelCard;
