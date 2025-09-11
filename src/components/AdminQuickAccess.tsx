import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  ShieldCheck, 
  Users, 
  Settings, 
  BarChart3, 
  Package, 
  CreditCard,
  FileText,
  Bell
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function AdminQuickAccess() {
  const { hasRole } = useAuth();
  const navigate = useNavigate();

  if (!hasRole('admin')) {
    return null;
  }

  const adminActions = [
    {
      title: 'Inventory Management',
      description: 'Manage stock levels and inventory',
      icon: Package,
      action: () => navigate('/'),
      badge: 'Full Access',
    },
    {
      title: 'Financial Reports',
      description: 'View profit/loss and financial analytics',
      icon: BarChart3,
      action: () => navigate('/analytics'),
      badge: 'Admin Only',
    },
    {
      title: 'User Management',
      description: 'Manage staff and farmer accounts',
      icon: Users,
      action: () => navigate('/settings'),
      badge: 'Admin Only',
    },
    {
      title: 'Sales & POS',
      description: 'Process sales and manage transactions',
      icon: CreditCard,
      action: () => navigate('/'),
      badge: 'Full Access',
    },
    {
      title: 'System Reports',
      description: 'Generate comprehensive farm reports',
      icon: FileText,
      action: () => navigate('/reports'),
      badge: 'Full Access',
    },
    {
      title: 'System Settings',
      description: 'Configure system preferences',
      icon: Settings,
      action: () => navigate('/settings'),
      badge: 'Admin Only',
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ShieldCheck className="h-5 w-5 text-primary" />
          Admin Quick Access
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {adminActions.map((action, index) => (
            <div
              key={index}
              className="p-4 border rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
              onClick={action.action}
            >
              <div className="flex items-start justify-between mb-2">
                <action.icon className="h-5 w-5 text-primary" />
                <Badge variant="secondary" className="text-xs">
                  {action.badge}
                </Badge>
              </div>
              <h3 className="font-semibold text-sm mb-1">{action.title}</h3>
              <p className="text-xs text-muted-foreground">{action.description}</p>
            </div>
          ))}
        </div>
        
        <div className="mt-6 p-4 bg-primary/5 rounded-lg border border-primary/20">
          <div className="flex items-center gap-2 mb-2">
            <Bell className="h-4 w-4 text-primary" />
            <span className="font-semibold text-sm">Admin Privileges Active</span>
          </div>
          <p className="text-xs text-muted-foreground">
            You have full administrative access to all farm management features including user management, 
            financial reports, and system configuration.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}