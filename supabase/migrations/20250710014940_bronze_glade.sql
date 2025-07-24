/*
  # Update pricing configuration to include practice books

  1. Changes
    - Add practice book pricing to the existing pricing configuration
    - Maintain backward compatibility with existing pricing structure

  2. Pricing Updates
    - Add practiceBook pricing section with digital, print, and both options
*/

-- Update the pricing configuration to include practice book pricing
UPDATE admin_settings 
SET setting_value = jsonb_set(
  setting_value,
  '{practiceBook}',
  '{
    "digital": 60,
    "print": 80,
    "both": 140
  }'::jsonb
)
WHERE id = 'pricing_config' AND setting_type = 'pricing';

-- If the record doesn't exist, insert it with the complete pricing structure
INSERT INTO admin_settings (id, setting_type, setting_value)
SELECT 'pricing_config', 'pricing', '{
  "studentBook": {
    "digital": 80,
    "print": 100,
    "both": 180
  },
  "practiceBook": {
    "digital": 60,
    "print": 80,
    "both": 140
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
WHERE NOT EXISTS (
  SELECT 1 FROM admin_settings 
  WHERE id = 'pricing_config' AND setting_type = 'pricing'
);