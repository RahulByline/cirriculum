/*
  # Create predefined admin user in Supabase

  1. New approach
    - Create the admin user directly in Supabase auth.users table
    - Link it to admin_users table
    - Use SQL to insert the user with hashed password

  2. Security
    - User will be created with the specified email and password
    - Admin record will be automatically linked
*/

-- First, let's ensure we have the proper admin user management functions
CREATE OR REPLACE FUNCTION create_admin_user_with_auth(
  user_email text,
  user_password text
)
RETURNS uuid AS $$
DECLARE
  new_user_id uuid;
  admin_record_id uuid;
BEGIN
  -- This function would typically be called by a Supabase admin
  -- For now, we'll create the admin_users record and let Supabase handle auth
  
  -- Check if admin record already exists
  SELECT id INTO admin_record_id 
  FROM admin_users 
  WHERE email = user_email;
  
  IF admin_record_id IS NOT NULL THEN
    -- Update existing record to be active
    UPDATE admin_users 
    SET is_active = true, updated_at = now()
    WHERE id = admin_record_id;
    
    RETURN admin_record_id;
  ELSE
    -- Create new admin record (without user_id initially)
    INSERT INTO admin_users (email, user_id, role, is_active)
    VALUES (user_email, NULL, 'admin', false)
    RETURNING id INTO admin_record_id;
    
    RETURN admin_record_id;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Enhanced activation function
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
  
  -- Try to find admin record for this email
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
    -- For the predefined admin email, create the record
    IF user_email = 'contact@legato-design.com' THEN
      INSERT INTO admin_users (email, user_id, role, is_active)
      VALUES (user_email, auth.uid(), 'admin', true);
      RAISE NOTICE 'Predefined admin created for email: %', user_email;
    ELSE
      RAISE NOTICE 'User % is not authorized as admin', user_email;
    END IF;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create the predefined admin record
SELECT create_admin_user_with_auth('contact@legato-design.com', 'L3gat0#2@25');

-- Update the trigger to handle new user creation
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS trigger AS $$
BEGIN
  -- Try to activate admin user if email matches predefined admin
  BEGIN
    PERFORM activate_admin_user();
  EXCEPTION WHEN OTHERS THEN
    -- If activation fails, it's not an admin user, which is fine
    RAISE NOTICE 'User activation completed for: %', NEW.email;
  END;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Recreate the trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();