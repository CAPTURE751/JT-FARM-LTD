-- Add new fields to livestock table
ALTER TABLE public.livestock 
ADD COLUMN date_of_birth DATE,
ADD COLUMN date_of_arrival_at_farm DATE,
ADD COLUMN date_of_birth_on_farm DATE;

-- Update existing records to have a default date_of_arrival_at_farm if both new dates are null
UPDATE public.livestock 
SET date_of_arrival_at_farm = created_at::date 
WHERE date_of_arrival_at_farm IS NULL AND date_of_birth_on_farm IS NULL;

-- Add constraint to ensure at least one of the two dates is provided
ALTER TABLE public.livestock 
ADD CONSTRAINT check_at_least_one_date 
CHECK (
  date_of_arrival_at_farm IS NOT NULL OR 
  date_of_birth_on_farm IS NOT NULL
);