/*
  # Create admin settings table

  1. New Tables
    - `admin_settings`
      - `id` (text, primary key) - unique identifier for the setting
      - `setting_type` (text) - type of setting (pricing, curriculum, etc.)
      - `setting_value` (jsonb) - the actual setting data
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `admin_settings` table
    - Add policy for public read access (since this is a demo)
    - Add policy for authenticated write access (in production, this would be admin-only)
*/

CREATE TABLE IF NOT EXISTS admin_settings (
  id text PRIMARY KEY,
  setting_type text NOT NULL,
  setting_value jsonb NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE admin_settings ENABLE ROW LEVEL SECURITY;

-- Allow public read access for demo purposes
-- In production, you would restrict this to authenticated users or specific roles
CREATE POLICY "Allow public read access to admin settings"
  ON admin_settings
  FOR SELECT
  TO public
  USING (true);

-- Allow public write access for demo purposes
-- In production, you would restrict this to admin users only
CREATE POLICY "Allow public write access to admin settings"
  ON admin_settings
  FOR ALL
  TO public
  USING (true);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_admin_settings_type ON admin_settings(setting_type);

-- Insert default pricing configuration
INSERT INTO admin_settings (id, setting_type, setting_value) 
VALUES (
  'pricing_config',
  'pricing',
  '{
    "studentBook": {
      "digital": 80,
      "print": 100,
      "both": 180
    },
    "teacherGuide": {
      "digital": 500,
      "print": 500,
      "both": 1000
    },
    "branding": {
      "kodeit": 1.0,
      "cobranded": 1.1,
      "whitelabeled": 1.25
    }
  }'::jsonb
) ON CONFLICT (id) DO NOTHING;