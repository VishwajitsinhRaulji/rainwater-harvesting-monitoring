-- Create storage bucket for CSV data
INSERT INTO storage.buckets (id, name, public) 
VALUES ('sensor-data', 'sensor-data', true);

-- Allow public read access to CSV files
CREATE POLICY "Public can read sensor data files"
ON storage.objects FOR SELECT
USING (bucket_id = 'sensor-data');

-- Allow anyone to upload sensor data (for ESP32)
CREATE POLICY "Anyone can upload sensor data"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'sensor-data');

-- Allow updates to existing files
CREATE POLICY "Anyone can update sensor data"
ON storage.objects FOR UPDATE
USING (bucket_id = 'sensor-data');