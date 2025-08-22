-- Fix security warnings by setting search_path for all functions
CREATE OR REPLACE FUNCTION public.get_user_role(user_id UUID)
RETURNS user_role AS $$
  SELECT role FROM public.profiles WHERE user_id = $1;
$$ LANGUAGE SQL SECURITY DEFINER STABLE SET search_path = public;

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, name, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data ->> 'name', NEW.email),
    COALESCE((NEW.raw_user_meta_data ->> 'role')::user_role, 'farmer')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE OR REPLACE FUNCTION public.update_inventory_on_sale()
RETURNS TRIGGER AS $$
BEGIN
  -- Only update inventory for sales of crops
  IF NEW.product_type = 'crop' THEN
    UPDATE public.inventory
    SET quantity = quantity - NEW.quantity,
        last_updated = now()
    WHERE item_name = NEW.product_name
    AND quantity >= NEW.quantity;
    
    IF NOT FOUND THEN
      RAISE EXCEPTION 'Insufficient inventory for product: %', NEW.product_name;
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE OR REPLACE FUNCTION public.update_inventory_on_purchase()
RETURNS TRIGGER AS $$
BEGIN
  -- Insert or update inventory item
  INSERT INTO public.inventory (item_name, category, quantity, unit, unit_cost, supplier, created_by)
  VALUES (NEW.item_name, NEW.category, NEW.quantity, NEW.unit, NEW.unit_cost, NEW.supplier, NEW.created_by)
  ON CONFLICT (item_name) 
  DO UPDATE SET
    quantity = inventory.quantity + NEW.quantity,
    unit_cost = NEW.unit_cost,
    supplier = NEW.supplier,
    last_updated = now();
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;