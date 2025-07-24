/*
  # Fix admin_users INSERT policy

  1. Security Changes
    - Add INSERT policy for admin_users table to allow authenticated users to insert their own admin record
    - This allows users to create admin records where their auth.uid() matches the user_id

  2. Policy Details
    - Policy name: "Allow authenticated users to insert their own admin record"
    - Applies to: INSERT operations
    - Condition: auth.uid() = user_id
    - This ensures users can only create admin records for themselves
*/

-- Add INSERT policy for admin_users table
CREATE POLICY "Allow authenticated users to insert their own admin record"
  ON public.admin_users
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);