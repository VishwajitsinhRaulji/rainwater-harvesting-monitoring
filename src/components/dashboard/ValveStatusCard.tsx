import { CircleDot, Circle } from "lucide-react";

interface ValveStatusCardProps {
  isOpen: boolean;
}

const ValveStatusCard = ({ isOpen }: ValveStatusCardProps) => {
  return (
    <div className="card-gradient rounded-lg p-6 shadow-card border border-border animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
      <div className="flex items-center gap-3 mb-4">
        <div className={`p-2 rounded-lg ${isOpen ? 'bg-success/20' : 'bg-destructive/20'}`}>
          {isOpen ? (
            <CircleDot className="w-6 h-6 text-success" />
          ) : (
            <Circle className="w-6 h-6 text-destructive" />
          )}
        </div>
        <h2 className="text-lg font-semibold text-foreground">Servo Valve</h2>
      </div>
      
      <div className="flex items-center gap-4">
        {/* Status indicator */}
        <div className="relative">
          <div 
            className={`w-4 h-4 rounded-full ${isOpen ? 'bg-success' : 'bg-destructive'}`}
            style={{ 
              boxShadow: isOpen ? 'var(--shadow-glow-success)' : 'var(--shadow-glow-destructive)' 
            }}
          />
          {/* Pulse effect */}
          <div 
            className={`absolute inset-0 rounded-full animate-ping ${isOpen ? 'bg-success/40' : 'bg-destructive/40'}`}
            style={{ animationDuration: '1.5s' }}
          />
        </div>
        
        <span className={`text-3xl font-semibold ${isOpen ? 'text-success' : 'text-destructive'}`}>
          {isOpen ? 'OPEN' : 'CLOSED'}
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
              isOpen 
                ? 'bg-success/20 border-2 border-success' 
                : 'bg-destructive/20 border-2 border-destructive'
            }`}
          >
            {/* Center indicator */}
            <div 
              className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 rounded-full ${
                isOpen ? 'bg-success' : 'bg-destructive'
              }`}
              style={{ 
                boxShadow: isOpen ? 'var(--shadow-glow-success)' : 'var(--shadow-glow-destructive)' 
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ValveStatusCard;
