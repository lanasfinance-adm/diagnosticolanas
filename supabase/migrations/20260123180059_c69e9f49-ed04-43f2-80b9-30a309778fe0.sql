-- Add new columns for profession and specialty
ALTER TABLE public.leads 
ADD COLUMN profession TEXT,
ADD COLUMN specialty TEXT;