import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const CSV_FILE_PATH = 'sensor_readings.csv';
const CSV_HEADER = 'timestamp,waterLevel,rainStatus,valveStatus\n';

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
  const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
  const supabase = createClient(supabaseUrl, supabaseKey);

  try {
    // GET: Return CSV data as JSON for the frontend
    if (req.method === 'GET') {
      console.log('Fetching sensor data from CSV...');
      
      const { data: fileData, error: downloadError } = await supabase.storage
        .from('sensor-data')
        .download(CSV_FILE_PATH);

      if (downloadError) {
        console.log('No existing CSV file, returning empty array');
        return new Response(JSON.stringify({ data: [] }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      const csvContent = await fileData.text();
      const lines = csvContent.trim().split('\n');
      
      // Skip header and parse data
      const data = lines.slice(1).map(line => {
        const [timestamp, waterLevel, rainStatus, valveStatus] = line.split(',');
        return {
          timestamp,
          waterLevel: parseFloat(waterLevel),
          rainStatus: rainStatus === 'true',
          valveStatus: valveStatus === 'true',
        };
      }).filter(d => !isNaN(d.waterLevel));

      console.log(`Returning ${data.length} readings`);
      return new Response(JSON.stringify({ data }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // POST: Add new sensor reading from ESP32
    if (req.method === 'POST') {
      const { waterLevel, rainStatus, valveStatus } = await req.json();
      
      console.log('Received sensor data:', { waterLevel, rainStatus, valveStatus });

      // Validate input
      if (typeof waterLevel !== 'number' || waterLevel < 0 || waterLevel > 100) {
        return new Response(JSON.stringify({ error: 'Invalid waterLevel (0-100)' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      const timestamp = new Date().toISOString();
      const newLine = `${timestamp},${waterLevel},${rainStatus},${valveStatus}\n`;

      // Try to get existing CSV content
      let csvContent = CSV_HEADER;
      const { data: existingFile } = await supabase.storage
        .from('sensor-data')
        .download(CSV_FILE_PATH);

      if (existingFile) {
        csvContent = await existingFile.text();
        
        // Keep only last 1000 readings to prevent file from growing too large
        const lines = csvContent.trim().split('\n');
        if (lines.length > 1001) {
          csvContent = CSV_HEADER + lines.slice(-1000).join('\n') + '\n';
        }
      }

      // Append new reading
      csvContent += newLine;

      // Upload updated CSV
      const { error: uploadError } = await supabase.storage
        .from('sensor-data')
        .upload(CSV_FILE_PATH, new Blob([csvContent], { type: 'text/csv' }), {
          upsert: true,
          contentType: 'text/csv',
        });

      if (uploadError) {
        console.error('Upload error:', uploadError);
        return new Response(JSON.stringify({ error: 'Failed to save data' }), {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      console.log('Sensor data saved successfully');
      return new Response(JSON.stringify({ success: true, timestamp }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error:', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
