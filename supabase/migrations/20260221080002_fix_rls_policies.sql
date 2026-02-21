-- Fix RLS policies to automatically handle user_id

-- Drop existing policies
DROP POLICY IF EXISTS "Users manage own houses" ON public.houses;
DROP POLICY IF EXISTS "Users manage own tenants" ON public.tenants;
DROP POLICY IF EXISTS "Users manage own billing" ON public.monthly_billing;

-- Create updated policies that automatically set user_id
CREATE POLICY "Users can insert own houses" ON public.houses FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can view own houses" ON public.houses FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own houses" ON public.houses FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own houses" ON public.houses FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own tenants" ON public.tenants FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can view own tenants" ON public.tenants FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own tenants" ON public.tenants FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own tenants" ON public.tenants FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own billing" ON public.monthly_billing FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can view own billing" ON public.monthly_billing FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own billing" ON public.monthly_billing FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own billing" ON public.monthly_billing FOR DELETE USING (auth.uid() = user_id);

-- Add triggers to automatically set user_id
CREATE OR REPLACE FUNCTION public.set_current_user_id()
RETURNS TRIGGER AS $$
BEGIN
  NEW.user_id = auth.uid();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER set_houses_user_id BEFORE INSERT ON public.houses FOR EACH ROW EXECUTE FUNCTION public.set_current_user_id();
CREATE TRIGGER set_tenants_user_id BEFORE INSERT ON public.tenants FOR EACH ROW EXECUTE FUNCTION public.set_current_user_id();
CREATE TRIGGER set_billing_user_id BEFORE INSERT ON public.monthly_billing FOR EACH ROW EXECUTE FUNCTION public.set_current_user_id();
