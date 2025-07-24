/*
  # Fix admin authentication bootstrap

  1. Changes
    - Update the bootstrap admin creation to work properly
    - Add function to check and create admin users during signup
    - Ensure the first admin can be created properly

  2. Security
    - Maintain secure authentication flow
    - Allow bootstrap admin creation
*/

-- First, let's update the admin user creation to be more flexible
CREATE OR REPLACE FUNCTION create_or_update_admin_user(
  user_email text,
  auth_user_id uuid DEFAULT NULL
)
RETURNS uuid AS $$
DECLARE
  admin_record_id uuid;
  admin_count int;
BEGIN
  -- Check if this is the first admin (bootstrap case)
  SELECT COUNT(*) INTO admin_count FROM admin_users WHERE is_active = true;
  
  -- Check if admin record already exists for this email
  SELECT id INTO admin_record_id 
  FROM admin_users 
  WHERE email = user_email;
  
  IF admin_record_id IS NOT NULL THEN
    -- Update existing record
    UPDATE admin_users 
    SET user_id = COALESCE(auth_user_id, user_id),
        is_active = CASE WHEN auth_user_id IS NOT NULL THEN true ELSE is_active END,
        updated_at = now()
    WHERE id = admin_record_id;
    
    RETURN admin_record_id;
  ELSE
    -- Create new admin record
    INSERT INTO admin_users (email, user_id, role, is_active)
    VALUES (
      user_email, 
      auth_user_id, 
      'admin', 
      CASE WHEN auth_user_id IS NOT NULL THEN true ELSE false END
    )
    RETURNING id INTO admin_record_id;
    
    RETURN admin_record_id;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Update the activation function to be more robust
CREATE OR REPLACE FUNCTION activate_admin_user()
RETURNS void AS $$
DECLARE
  user_email text;
  admin_record_id uuid;
BEGIN
  -- Get the current user's email
  SELECT email INTO user_email FROM auth.users WHERE id = auth.uid();
  
  IF user_email IS NULL THEN
    RAISE EXCEPTION 'Could not determine user email';
  END IF;
  
  -- Try to find and activate admin record
  SELECT id INTO admin_record_id 
  FROM admin_users 
  WHERE email = user_email;
  
  IF admin_record_id IS NOT NULL THEN
    -- Update the admin_users record to link it with the authenticated user
    UPDATE admin_users 
    SET user_id = auth.uid(), 
        is_active = true, 
        updated_at = now()
    WHERE id = admin_record_id;
    
    RAISE NOTICE 'Admin user activated for email: %', user_email;
  ELSE
    -- Check if this should be the bootstrap admin
    IF user_email = 'contact@legato-design.com' THEN
      -- Create admin record for bootstrap user
      PERFORM create_or_update_admin_user(user_email, auth.uid());
      RAISE NOTICE 'Bootstrap admin created for email: %', user_email;
    ELSE
      RAISE NOTICE 'User % is not authorized as admin', user_email;
    END IF;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Ensure the bootstrap admin record exists
SELECT create_or_update_admin_user('contact@legato-design.com');

-- Add some additional admin emails for testing (you can modify these)
SELECT create_or_update_admin_user('admin@kodeit.com');
SELECT create_or_update_admin_user('test@admin.com');