import { CircleDot, Circle, CircleDashed } from "lucide-react";

interface ValveStatusCardProps {
  isOpen: boolean | null;
}

const ValveStatusCard = ({ isOpen }: ValveStatusCardProps) => {
  const hasData = isOpen !== null;

  return (
    <div className="card-gradient rounded-lg p-6 shadow-card border border-border animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
      <div className="flex items-center gap-3 mb-4">
        <div className={`p-2 rounded-lg ${!hasData ? 'bg-muted' : isOpen ? 'bg-success/20' : 'bg-destructive/20'}`}>
          {!hasData ? (
            <CircleDashed className="w-6 h-6 text-muted-foreground" />
          ) : isOpen ? (
            <CircleDot className="w-6 h-6 text-success" />
          ) : (
            <Circle className="w-6 h-6 text-destructive" />
          )}
        </div>
        <h2 className="text-lg font-semibold text-foreground">Servo Valve</h2>
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
            className={`w-4 h-4 rounded-full ${!hasData ? 'bg-muted-foreground/30' : isOpen ? 'bg-success' : 'bg-destructive'}`}
            style={{ 
              boxShadow: !hasData ? 'none' : isOpen ? 'var(--shadow-glow-success)' : 'var(--shadow-glow-destructive)' 
            }}
          />
          {/* Pulse effect */}
          {hasData && (
            <div 
              className={`absolute inset-0 rounded-full animate-ping ${isOpen ? 'bg-success/40' : 'bg-destructive/40'}`}
              style={{ animationDuration: '1.5s' }}
            />
          )}
        </div>
        
        <span className={`text-3xl font-semibold ${!hasData ? 'text-muted-foreground' : isOpen ? 'text-success' : 'text-destructive'}`}>
          {!hasData ? 'Standby' : isOpen ? 'OPEN' : 'CLOSED'}
        </span>
      </div>
      
      {/* Valve visual indicator */}
      <div className="mt-4 flex justify-center">
        <div className="relative w-16 h-16">
          {/* Valve body */}
          <div className="absolute inset-0 border-4 border-muted-foreground/30 rounded-full" />
          {/* Valve gate */}
          <div 
            className={`absolute inset-2 rounded-full transition-all duration-500 ${
              !hasData 
                ? 'bg-muted border-2 border-muted-foreground/30'
                : isOpen 
                  ? 'bg-success/20 border-2 border-success' 
                  : 'bg-destructive/20 border-2 border-destructive'
            }`}
          >
            {/* Center indicator */}
            <div 
              className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 rounded-full ${
                !hasData ? 'bg-muted-foreground/30' : isOpen ? 'bg-success' : 'bg-destructive'
              }`}
              style={{ 
                boxShadow: !hasData ? 'none' : isOpen ? 'var(--shadow-glow-success)' : 'var(--shadow-glow-destructive)' 
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ValveStatusCard;
