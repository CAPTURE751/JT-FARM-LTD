import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import type { Database } from '@/integrations/supabase/types';

type Purchase = Database['public']['Tables']['purchases']['Row'];
type PurchaseInsert = Database['public']['Tables']['purchases']['Insert'];
type PurchaseUpdate = Database['public']['Tables']['purchases']['Update'];

export function usePurchases() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Get all purchases
  const {
    data: purchases = [],
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['purchases'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('purchases')
        .select('*')
        .order('purchase_date', { ascending: false });

      if (error) throw error;
      return data as Purchase[];
    },
  });

  // Get purchases analytics
  const {
    data: analytics,
    isLoading: isLoadingAnalytics
  } = useQuery({
    queryKey: ['purchases', 'analytics'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('purchases')
        .select('total_cost, purchase_date, category, payment_status');

      if (error) throw error;

      const totalExpenses = data.reduce((sum, purchase) => sum + (purchase.total_cost || 0), 0);
      const pendingPayments = data.filter(purchase => purchase.payment_status === 'pending').length;
      const completedPurchases = data.filter(purchase => purchase.payment_status === 'paid').length;

      return {
        totalExpenses,
        pendingPayments,
        completedPurchases,
        totalPurchases: data.length,
      };
    },
  });

  // Create purchase mutation
  const createPurchase = useMutation({
    mutationFn: async (purchaseData: Omit<PurchaseInsert, 'created_by'>) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('purchases')
        .insert({
          ...purchaseData,
          created_by: user.id,
          total_cost: purchaseData.quantity * purchaseData.unit_cost,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['purchases'] });
      queryClient.invalidateQueries({ queryKey: ['inventory'] });
      toast({
        title: "Purchase recorded",
        description: "New purchase has been recorded successfully.",
      });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Error recording purchase",
        description: error.message,
      });
    },
  });

  // Update purchase mutation
  const updatePurchase = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: PurchaseUpdate }) => {
      const { data, error } = await supabase
        .from('purchases')
        .update({
          ...updates,
          total_cost: updates.quantity && updates.unit_cost 
            ? updates.quantity * updates.unit_cost 
            : undefined,
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['purchases'] });
      toast({
        title: "Purchase updated",
        description: "Purchase has been updated successfully.",
      });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Error updating purchase",
        description: error.message,
      });
    },
  });

  // Delete purchase mutation
  const deletePurchase = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('purchases')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['purchases'] });
      toast({
        title: "Purchase deleted",
        description: "Purchase has been deleted successfully.",
      });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Error deleting purchase",
        description: error.message,
      });
    },
  });

  // Real-time subscription
  useEffect(() => {
    const channel = supabase
      .channel('purchases-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'purchases'
        },
        () => {
          queryClient.invalidateQueries({ queryKey: ['purchases'] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);

  return {
    purchases,
    analytics,
    isLoading,
    isLoadingAnalytics,
    error,
    refetch,
    createPurchase: createPurchase.mutate,
    updatePurchase: updatePurchase.mutate,
    deletePurchase: deletePurchase.mutate,
    isCreating: createPurchase.isPending,
    isUpdating: updatePurchase.isPending,
    isDeleting: deletePurchase.isPending,
  };
}

export function usePurchase(id: string) {
  return useQuery({
    queryKey: ['purchase', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('purchases')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return data as Purchase;
    },
    enabled: !!id,
  });
}