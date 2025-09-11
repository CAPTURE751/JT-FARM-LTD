import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import type { Database } from '@/integrations/supabase/types';

type Inventory = Database['public']['Tables']['inventory']['Row'];
type InventoryInsert = Database['public']['Tables']['inventory']['Insert'];
type InventoryUpdate = Database['public']['Tables']['inventory']['Update'];

export function useInventory() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Get all inventory items
  const {
    data: inventory = [],
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['inventory'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('inventory')
        .select('*')
        .order('last_updated', { ascending: false });

      if (error) throw error;
      return data as Inventory[];
    },
  });

  // Get low stock items - compare quantity with min_threshold
  const {
    data: lowStockItems = [],
    isLoading: isLoadingLowStock
  } = useQuery({
    queryKey: ['inventory', 'low-stock'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('inventory')
        .select('*')
        .order('quantity', { ascending: true });

      if (error) throw error;
      
      // Filter low stock items in JavaScript since the column comparison might not work in the query
      const lowStock = data.filter(item => 
        item.quantity <= (item.min_threshold || 0)
      );
      
      return lowStock as Inventory[];
    },
  });

  // Create inventory item mutation
  const createInventoryItem = useMutation({
    mutationFn: async (inventoryData: Omit<InventoryInsert, 'created_by'>) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('inventory')
        .insert({
          ...inventoryData,
          created_by: user.id,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inventory'] });
      toast({
        title: "Inventory item created",
        description: "New inventory item has been added successfully.",
      });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Error creating inventory item",
        description: error.message,
      });
    },
  });

  // Update inventory item mutation
  const updateInventoryItem = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: InventoryUpdate }) => {
      const { data, error } = await supabase
        .from('inventory')
        .update({
          ...updates,
          last_updated: new Date().toISOString(),
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inventory'] });
      toast({
        title: "Inventory updated",
        description: "Inventory item has been updated successfully.",
      });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Error updating inventory",
        description: error.message,
      });
    },
  });

  // Delete inventory item mutation
  const deleteInventoryItem = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('inventory')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inventory'] });
      toast({
        title: "Inventory item deleted",
        description: "Inventory item has been deleted successfully.",
      });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Error deleting inventory item",
        description: error.message,
      });
    },
  });

  // Bulk update inventory
  const bulkUpdateInventory = useMutation({
    mutationFn: async (updates: Array<{ id: string; quantity: number }>) => {
      const promises = updates.map(({ id, quantity }) =>
        supabase
          .from('inventory')
          .update({
            quantity,
            last_updated: new Date().toISOString(),
          })
          .eq('id', id)
      );

      const results = await Promise.all(promises);
      const errors = results.filter(result => result.error);
      
      if (errors.length > 0) {
        throw new Error(`Failed to update ${errors.length} items`);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inventory'] });
      toast({
        title: "Bulk update completed",
        description: "Inventory items have been updated successfully.",
      });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Error updating inventory",
        description: error.message,
      });
    },
  });

  // Real-time subscription
  useEffect(() => {
    const channel = supabase
      .channel('inventory-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'inventory'
        },
        () => {
          queryClient.invalidateQueries({ queryKey: ['inventory'] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);

  return {
    inventory,
    lowStockItems,
    isLoading,
    isLoadingLowStock,
    error,
    refetch,
    createInventoryItem: createInventoryItem.mutate,
    updateInventoryItem: updateInventoryItem.mutate,
    deleteInventoryItem: deleteInventoryItem.mutate,
    bulkUpdateInventory: bulkUpdateInventory.mutate,
    isCreating: createInventoryItem.isPending,
    isUpdating: updateInventoryItem.isPending,
    isDeleting: deleteInventoryItem.isPending,
    isBulkUpdating: bulkUpdateInventory.isPending,
  };
}

export function useInventoryItem(id: string) {
  return useQuery({
    queryKey: ['inventory', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('inventory')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return data as Inventory;
    },
    enabled: !!id,
  });
}