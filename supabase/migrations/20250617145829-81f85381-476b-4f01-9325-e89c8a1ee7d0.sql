
-- Create a table to store financial projects
CREATE TABLE public.financial_projects (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users,
  project_name TEXT NOT NULL DEFAULT 'Nouveau Projet',
  company_info JSONB DEFAULT '{}'::jsonb,
  fixed_assets JSONB DEFAULT '{}'::jsonb,
  operating_capital JSONB DEFAULT '{}'::jsonb,
  funding_sources JSONB DEFAULT '{}'::jsonb,
  products JSONB DEFAULT '[]'::jsonb,
  operating_expenses JSONB DEFAULT '[]'::jsonb,
  payroll_data JSONB DEFAULT '{}'::jsonb,
  additional_parameters JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add Row Level Security (RLS)
ALTER TABLE public.financial_projects ENABLE ROW LEVEL SECURITY;

-- Create policies for authenticated users
CREATE POLICY "Users can view their own projects" 
  ON public.financial_projects 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own projects" 
  ON public.financial_projects 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own projects" 
  ON public.financial_projects 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own projects" 
  ON public.financial_projects 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Create trigger to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_financial_projects_updated_at 
  BEFORE UPDATE ON public.financial_projects
  FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
