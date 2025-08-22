-- Fix security vulnerability: Restrict profile visibility
-- Drop the overly permissive policy
DROP POLICY IF EXISTS "Users can view all profiles" ON public.profiles;

-- Create a secure policy that only allows:
-- 1. Users to view their own profile
-- 2. Admin and staff to view all profiles (for management purposes)
CREATE POLICY "Users can view own profile, admin/staff can view all" 
ON public.profiles 
FOR SELECT 
USING (
  auth.uid() = user_id 
  OR public.get_user_role(auth.uid()) IN ('admin', 'staff')
);