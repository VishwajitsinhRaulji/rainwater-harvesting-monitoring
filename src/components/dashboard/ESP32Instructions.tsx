import { useState } from "react";
import { Code, Copy, Check, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const ESP32Instructions = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [copied, setCopied] = useState(false);

  const projectId = import.meta.env.VITE_SUPABASE_PROJECT_ID;
  const endpoint = `https://${projectId}.supabase.co/functions/v1/sensor-data`;

  const esp32Code = `#include <WiFi.h>
#include <HTTPClient.h>
#include <ArduinoJson.h>

// WiFi credentials
const char* ssid = "YOUR_WIFI_SSID";
const char* password = "YOUR_WIFI_PASSWORD";

// API endpoint
const char* serverUrl = "${endpoint}";

// Sensor pins (adjust to your setup)
const int WATER_SENSOR_PIN = 34;  // Analog
const int RAIN_SENSOR_PIN = 35;   // Digital
const int VALVE_STATUS_PIN = 32;  // Digital

void setup() {
  Serial.begin(115200);
  pinMode(RAIN_SENSOR_PIN, INPUT);
  pinMode(VALVE_STATUS_PIN, INPUT);
  
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("\\nConnected to WiFi");
}

void loop() {
  if (WiFi.status() == WL_CONNECTED) {
    HTTPClient http;
    http.begin(serverUrl);
    http.addHeader("Content-Type", "application/json");
    
    // Read sensors
    int rawWater = analogRead(WATER_SENSOR_PIN);
    int waterLevel = map(rawWater, 0, 4095, 0, 100);
    bool rainStatus = digitalRead(RAIN_SENSOR_PIN) == HIGH;
    bool valveStatus = digitalRead(VALVE_STATUS_PIN) == HIGH;
    
    // Create JSON payload
    StaticJsonDocument<200> doc;
    doc["waterLevel"] = waterLevel;
    doc["rainStatus"] = rainStatus;
    doc["valveStatus"] = valveStatus;
    
    String jsonPayload;
    serializeJson(doc, jsonPayload);
    
    int httpCode = http.POST(jsonPayload);
    
    if (httpCode > 0) {
      Serial.printf("POST Response: %d\\n", httpCode);
    } else {
      Serial.printf("POST Error: %s\\n", http.errorToString(httpCode).c_str());
    }
    
    http.end();
  }
  
  delay(10000); // Send data every 10 seconds
}`;

  const copyCode = () => {
    navigator.clipboard.writeText(esp32Code);
    setCopied(true);
    toast.success('Code copied to clipboard');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="card-gradient rounded-lg p-4 shadow-card border border-border animate-fade-in-up" style={{ animationDelay: '0.35s' }}>
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between text-left"
      >
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/20">
            <Code className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="text-sm font-medium text-foreground">ESP32 Integration</h3>
            <p className="text-xs text-muted-foreground">Click to view Arduino code</p>
          </div>
        </div>
        {isExpanded ? (
          <ChevronUp className="w-5 h-5 text-muted-foreground" />
        ) : (
          <ChevronDown className="w-5 h-5 text-muted-foreground" />
        )}
      </button>

      {isExpanded && (
        <div className="mt-4 space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-xs text-muted-foreground">
              Endpoint: <code className="text-primary">{endpoint}</code>
            </p>
            <Button variant="outline" size="sm" onClick={copyCode} className="gap-2">
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              {copied ? 'Copied' : 'Copy Code'}
            </Button>
          </div>
          
          <pre className="bg-background/50 p-4 rounded-lg overflow-x-auto text-xs text-muted-foreground max-h-64 overflow-y-auto">
            <code>{esp32Code}</code>
          </pre>
          
          <p className="text-xs text-muted-foreground">
            Upload this code to your ESP32. Adjust WiFi credentials and sensor pin numbers for your setup.
          </p>
        </div>
      )}
    </div>
  );
};

export default ESP32Instructions;
