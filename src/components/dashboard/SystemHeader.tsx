import { Activity, Wifi } from "lucide-react";

interface SystemHeaderProps {
  lastUpdate: Date | null;
  isConnected: boolean;
}

const SystemHeader = ({ lastUpdate, isConnected }: SystemHeaderProps) => {
  return (
    <header className="mb-8 animate-fade-in-up">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-water/20 border border-water/30">
            <Activity className="w-8 h-8 text-water" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
              Rainwater Harvesting
            </h1>
            <p className="text-muted-foreground text-sm">ESP32 Monitoring System</p>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          {/* Connection status */}
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-secondary/50 border border-border">
            <Wifi className={`w-4 h-4 ${isConnected ? 'text-success' : 'text-destructive'}`} />
            <span className={`text-sm font-medium ${isConnected ? 'text-success' : 'text-destructive'}`}>
              {isConnected ? 'Connected' : 'Disconnected'}
            </span>
          </div>
          
          {/* Last update time */}
          <div className="text-right">
            <p className="text-xs text-muted-foreground">Last Update</p>
            <p className="text-sm font-mono text-foreground">
              {lastUpdate ? lastUpdate.toLocaleTimeString() : '--:--:--'}
            </p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default SystemHeader;
