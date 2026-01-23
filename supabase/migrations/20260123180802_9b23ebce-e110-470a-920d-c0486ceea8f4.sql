-- Add new columns for the complete diagnostic form
ALTER TABLE public.leads 
ADD COLUMN IF NOT EXISTS monthly_income TEXT,
ADD COLUMN IF NOT EXISTS has_debts TEXT,
ADD COLUMN IF NOT EXISTS total_assets TEXT,
ADD COLUMN IF NOT EXISTS investments TEXT[],
ADD COLUMN IF NOT EXISTS financial_challenges TEXT[],
ADD COLUMN IF NOT EXISTS main_objective TEXT,
ADD COLUMN IF NOT EXISTS urgency_level TEXT,
ADD COLUMN IF NOT EXISTS contact_preference TEXT,
ADD COLUMN IF NOT EXISTS availability TEXT,
ADD COLUMN IF NOT EXISTS additional_comments TEXT;