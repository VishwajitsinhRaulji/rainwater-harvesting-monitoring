import { CloudRain, Cloud, CloudOff } from "lucide-react";

interface RainStatusCardProps {
  isRaining: boolean | null;
}

const RainStatusCard = ({ isRaining }: RainStatusCardProps) => {
  const hasData = isRaining !== null;

  return (
    <div className="card-gradient rounded-lg p-6 shadow-card border border-border animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
      <div className="flex items-center gap-3 mb-4">
        <div className={`p-2 rounded-lg ${!hasData ? 'bg-muted' : isRaining ? 'bg-success/20' : 'bg-destructive/20'}`}>
          {!hasData ? (
            <CloudOff className="w-6 h-6 text-muted-foreground" />
          ) : isRaining ? (
            <CloudRain className="w-6 h-6 text-success" />
          ) : (
            <Cloud className="w-6 h-6 text-destructive" />
          )}
        </div>
        <h2 className="text-lg font-semibold text-foreground">Rain Status</h2>
        {!hasData && (
          <span className="ml-auto text-xs bg-muted px-2 py-1 rounded text-muted-foreground">
            Awaiting data
          </span>
        )}
      </div>
      
      <div className="flex items-center gap-4">
        {/* Status indicator */}
        <div className="relative">
          <div 
            className={`w-4 h-4 rounded-full ${!hasData ? 'bg-muted-foreground/30' : isRaining ? 'bg-success' : 'bg-destructive'}`}
            style={{ 
              boxShadow: !hasData ? 'none' : isRaining ? 'var(--shadow-glow-success)' : 'var(--shadow-glow-destructive)' 
            }}
          />
          {/* Pulse effect */}
          {hasData && (
            <div 
              className={`absolute inset-0 rounded-full animate-ping ${isRaining ? 'bg-success/40' : 'bg-destructive/40'}`}
              style={{ animationDuration: '1.5s' }}
            />
          )}
        </div>
        
        <span className={`text-3xl font-semibold ${!hasData ? 'text-muted-foreground' : isRaining ? 'text-success' : 'text-destructive'}`}>
          {!hasData ? 'Standby' : isRaining ? 'Raining' : 'Not Raining'}
        </span>
      </div>
      
      {/* Rain animation when raining */}
      {hasData && isRaining && (
        <div className="mt-4 flex gap-2 justify-center">
          {[...Array(5)].map((_, i) => (
            <div 
              key={i} 
              className="w-0.5 h-4 bg-success/60 rounded-full animate-rain-drop"
              style={{ animationDelay: `${i * 0.2}s` }}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default RainStatusCard;
