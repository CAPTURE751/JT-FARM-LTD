import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { NOTIFICATION_TYPES } from '@/lib/constants';

export interface Notification {
  id: string;
  type: string;
  title: string;
  message: string;
  read: boolean;
  created_at: string;
  user_id?: string;
}

export function useNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);
  const { user, hasRole } = useAuth();

  const fetchNotifications = async () => {
    if (!user) return;

    try {
      // For now, generate sample notifications based on user role
      // In a real system, these would come from a notifications table
      const sampleNotifications: Notification[] = [];

      if (hasRole(['admin', 'staff'])) {
        // Check for low stock items
        const { data: lowStockItems } = await supabase
          .from('inventory')
          .select('item_name, quantity, min_threshold')
          .lt('quantity', 10);

        lowStockItems?.forEach((item, index) => {
          sampleNotifications.push({
            id: `low-stock-${index}`,
            type: NOTIFICATION_TYPES.LOW_STOCK,
            title: 'Low Stock Alert',
            message: `${item.item_name} is running low (${item.quantity} remaining)`,
            read: false,
            created_at: new Date().toISOString(),
            user_id: user.id,
          });
        });

        // Admin-specific notifications
        if (hasRole('admin')) {
          sampleNotifications.push({
            id: 'audit-reminder',
            type: NOTIFICATION_TYPES.AUDIT_REMINDER,
            title: 'Monthly Audit Due',
            message: 'Your monthly farm audit is due in 3 days',
            read: false,
            created_at: new Date().toISOString(),
            user_id: user.id,
          });

          sampleNotifications.push({
            id: 'system-update',
            type: NOTIFICATION_TYPES.SYSTEM_UPDATE,
            title: 'System Update',
            message: 'Farm management system has been updated with KES currency support',
            read: false,
            created_at: new Date().toISOString(),
            user_id: user.id,
          });
        }
      }

      setNotifications(sampleNotifications);
      setUnreadCount(sampleNotifications.filter(n => !n.read).length);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = (notificationId: string) => {
    setNotifications(prev =>
      prev.map(n =>
        n.id === notificationId ? { ...n, read: true } : n
      )
    );
    setUnreadCount(prev => Math.max(0, prev - 1));
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    setUnreadCount(0);
  };

  const addNotification = (notification: Omit<Notification, 'id' | 'created_at'>) => {
    const newNotification: Notification = {
      ...notification,
      id: Date.now().toString(),
      created_at: new Date().toISOString(),
    };
    
    setNotifications(prev => [newNotification, ...prev]);
    if (!newNotification.read) {
      setUnreadCount(prev => prev + 1);
    }
  };

  useEffect(() => {
    if (user) {
      fetchNotifications();
    }
  }, [user]);

  return {
    notifications,
    loading,
    unreadCount,
    markAsRead,
    markAllAsRead,
    addNotification,
    refetch: fetchNotifications,
  };
}