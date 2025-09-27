-- Create tasks table for farm calendar
CREATE TABLE public.tasks (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  task_date DATE NOT NULL,
  task_type TEXT NOT NULL CHECK (task_type IN ('crop', 'livestock', 'maintenance', 'harvest')),
  priority TEXT NOT NULL DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
  completed BOOLEAN NOT NULL DEFAULT false,
  created_by UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;

-- Create policies for tasks
CREATE POLICY "Users can view tasks they created or admin/staff can view all" 
ON public.tasks 
FOR SELECT 
USING ((created_by = auth.uid()) OR (get_user_role(auth.uid()) = ANY (ARRAY['admin'::user_role, 'staff'::user_role])));

CREATE POLICY "Users can create their own tasks" 
ON public.tasks 
FOR INSERT 
WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Users can update their own tasks, admin/staff can update all" 
ON public.tasks 
FOR UPDATE 
USING ((created_by = auth.uid()) OR (get_user_role(auth.uid()) = ANY (ARRAY['admin'::user_role, 'staff'::user_role])));

CREATE POLICY "Admin can delete tasks" 
ON public.tasks 
FOR DELETE 
USING (get_user_role(auth.uid()) = 'admin'::user_role);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_tasks_updated_at
BEFORE UPDATE ON public.tasks
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();