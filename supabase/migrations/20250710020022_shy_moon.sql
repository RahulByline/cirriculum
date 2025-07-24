/*
  # Secure Admin Authentication System

  1. New Tables
    - `admin_users` - Store admin user profiles
    - Update RLS policies for proper security

  2. Security
    - Enable RLS on all admin tables
    - Create secure policies for admin-only access
    - Add admin role management

  3. Functions
    - Function to check if user is admin
    - Function to create admin users
*/

-- Create admin users table
CREATE TABLE IF NOT EXISTS admin_users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  email text UNIQUE NOT NULL,
  role text NOT NULL DEFAULT 'admin',
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- Function to check if current user is admin
CREATE OR REPLACE FUNCTION is_admin()
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM admin_users 
    WHERE user_id = auth.uid() 
    AND is_active = true
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get user role
CREATE OR REPLACE FUNCTION get_user_role()
RETURNS text AS $$
BEGIN
  RETURN (
    SELECT role FROM admin_users 
    WHERE user_id = auth.uid() 
    AND is_active = true
    LIMIT 1
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Update admin_settings policies to be secure
DROP POLICY IF EXISTS "Allow public read access to admin settings" ON admin_settings;
DROP POLICY IF EXISTS "Allow public write access to admin settings" ON admin_settings;

-- Secure policies for admin_settings
CREATE POLICY "Allow authenticated read access to admin settings"
  ON admin_settings
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Allow admin write access to admin settings"
  ON admin_settings
  FOR ALL
  TO authenticated
  USING (is_admin());

-- Policies for admin_users table
CREATE POLICY "Admins can read admin users"
  ON admin_users
  FOR SELECT
  TO authenticated
  USING (is_admin());

CREATE POLICY "Admins can manage admin users"
  ON admin_users
  FOR ALL
  TO authenticated
  USING (is_admin());

-- Function to create admin user (can only be called by existing admin or during setup)
CREATE OR REPLACE FUNCTION create_admin_user(
  user_email text,
  user_password text DEFAULT NULL
)
RETURNS uuid AS $$
DECLARE
  new_user_id uuid;
  admin_count int;
BEGIN
  -- Check if this is the first admin (bootstrap case)
  SELECT COUNT(*) INTO admin_count FROM admin_users WHERE is_active = true;
  
  -- If not first admin, check if current user is admin
  IF admin_count > 0 AND NOT is_admin() THEN
    RAISE EXCEPTION 'Only admins can create new admin users';
  END IF;
  
  -- For the first admin, we'll create a record that can be claimed later
  IF admin_count = 0 THEN
    INSERT INTO admin_users (email, user_id, role, is_active)
    VALUES (user_email, NULL, 'admin', false)
    RETURNING id INTO new_user_id;
  ELSE
    -- For subsequent admins, they need to be invited through proper Supabase auth
    RAISE EXCEPTION 'Use Supabase Auth to invite new admin users';
  END IF;
  
  RETURN new_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to activate admin user after they sign up
CREATE OR REPLACE FUNCTION activate_admin_user()
RETURNS void AS $$
DECLARE
  user_email text;
BEGIN
  -- Get the current user's email
  SELECT email INTO user_email FROM auth.users WHERE id = auth.uid();
  
  -- Update the admin_users record to link it with the authenticated user
  UPDATE admin_users 
  SET user_id = auth.uid(), is_active = true, updated_at = now()
  WHERE email = user_email AND user_id IS NULL;
  
  -- If no record was updated, this user is not an admin
  IF NOT FOUND THEN
    RAISE EXCEPTION 'User is not authorized as admin';
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create the first admin user (bootstrap)
-- This creates an inactive record that can be claimed when the user signs up
SELECT create_admin_user('contact@legato-design.com');

-- Trigger to automatically activate admin users when they sign up
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS trigger AS $$
BEGIN
  -- Try to activate admin user if email matches
  BEGIN
    PERFORM activate_admin_user();
  EXCEPTION WHEN OTHERS THEN
    -- If activation fails, it's not an admin user, which is fine
    NULL;
  END;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Add updated_at trigger for admin_users
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_admin_users_updated_at ON admin_users;
CREATE TRIGGER update_admin_users_updated_at
  BEFORE UPDATE ON admin_users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();