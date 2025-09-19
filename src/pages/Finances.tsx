
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { formatKES } from "@/lib/currency";
import { useSales } from "@/hooks/useSales";
import { usePurchases } from "@/hooks/usePurchases";
import { TransactionForm } from "@/components/TransactionForm";
import { 
  DollarSign,
  Plus,
  TrendingUp,
  TrendingDown,
  Receipt,
  CreditCard,
  Calendar,
  Filter,
  Loader2
} from "lucide-react";
import { Layout } from "@/components/Layout";


export default function Finances() {
  const [filter, setFilter] = useState<'all' | 'income' | 'expense'>('all');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  const { sales, analytics: salesAnalytics, isLoading: salesLoading } = useSales();
  const { purchases, analytics: purchaseAnalytics, isLoading: purchasesLoading } = usePurchases();

  const isLoading = salesLoading || purchasesLoading;

  // Combine sales and purchases into transactions
  const allTransactions = [
    ...sales.map(sale => ({
      id: sale.id,
      type: 'income' as const,
      category: sale.product_type,
      description: `${sale.product_name} - ${sale.buyer}`,
      amount: sale.total_amount || 0,
      date: sale.sale_date,
      status: sale.payment_status === 'paid' ? 'completed' as const : 'pending' as const,
      originalData: sale
    })),
    ...purchases.map(purchase => ({
      id: purchase.id,
      type: 'expense' as const,
      category: purchase.category,
      description: `${purchase.item_name} - ${purchase.supplier}`,
      amount: purchase.total_cost || 0,
      date: purchase.purchase_date,
      status: purchase.payment_status === 'paid' ? 'completed' as const : 'pending' as const,
      originalData: purchase
    }))
  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const filteredTransactions = allTransactions.filter(t => 
    filter === 'all' || t.type === filter
  );

  const totalIncome = salesAnalytics?.totalRevenue || 0;
  const totalExpenses = purchaseAnalytics?.totalExpenses || 0;
  const netProfit = totalIncome - totalExpenses;
  const pendingAmount = allTransactions
    .filter(t => t.status === 'pending')
    .reduce((sum, t) => sum + t.amount, 0);

  const getTypeColor = (type: string) => {
    return type === 'income' 
      ? 'bg-green-100 text-green-800 border-green-200'
      : 'bg-red-100 text-red-800 border-red-200';
  };

  const getStatusColor = (status: string) => {
    return status === 'completed'
      ? 'bg-blue-100 text-blue-800 border-blue-200'
      : 'bg-yellow-100 text-yellow-800 border-yellow-200';
  };

  return (
    <Layout>
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Financial Management</h1>
            <p className="text-gray-600 mt-1">Track income, expenses, and profitability</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-farm-green hover:bg-farm-green/90">
                <Plus className="h-4 w-4 mr-2" />
                Add Transaction
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Add New Transaction</DialogTitle>
              </DialogHeader>
              <TransactionForm onClose={() => setIsDialogOpen(false)} />
            </DialogContent>
          </Dialog>
        </div>

        {/* Financial Summary */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Income</p>
                  <p className="text-2xl font-bold text-green-600">{formatKES(totalIncome)}</p>
                </div>
                <TrendingUp className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Expenses</p>
                  <p className="text-2xl font-bold text-red-600">{formatKES(totalExpenses)}</p>
                </div>
                <TrendingDown className="h-8 w-8 text-red-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Net Profit</p>
                  <p className={`text-2xl font-bold ${netProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {formatKES(netProfit)}
                  </p>
                </div>
                <DollarSign className={`h-8 w-8 ${netProfit >= 0 ? 'text-green-600' : 'text-red-600'}`} />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Pending</p>
                  <p className="text-2xl font-bold text-farm-harvest">
                    {formatKES(pendingAmount)}
                  </p>
                </div>
                <Receipt className="h-8 w-8 text-farm-harvest" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Transaction Filters */}
        <div className="flex flex-wrap gap-2">
          <Button
            variant={filter === 'all' ? 'default' : 'outline'}
            onClick={() => setFilter('all')}
          >
            All Transactions
          </Button>
          <Button
            variant={filter === 'income' ? 'default' : 'outline'}
            onClick={() => setFilter('income')}
            className="text-green-700"
          >
            Income Only
          </Button>
          <Button
            variant={filter === 'expense' ? 'default' : 'outline'}
            onClick={() => setFilter('expense')}
            className="text-red-700"
          >
            Expenses Only
          </Button>
        </div>

        {/* Transactions List */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Recent Transactions
              </span>
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center items-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-farm-green" />
                <span className="ml-2 text-muted-foreground">Loading transactions...</span>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredTransactions.length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">No transactions found</p>
                ) : (
                  filteredTransactions.map((transaction) => (
                    <div key={`${transaction.type}-${transaction.id}`} className="flex items-center justify-between p-4 rounded-lg border hover:bg-muted/50">
                      <div className="flex items-center gap-4">
                        <div className={`p-2 rounded-full ${transaction.type === 'income' ? 'bg-green-100' : 'bg-red-100'}`}>
                          {transaction.type === 'income' ? (
                            <TrendingUp className="h-4 w-4 text-green-600" />
                          ) : (
                            <TrendingDown className="h-4 w-4 text-red-600" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium">{transaction.description}</p>
                          <p className="text-sm text-muted-foreground">{transaction.category}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <Calendar className="h-3 w-3 text-muted-foreground" />
                            <span className="text-xs text-muted-foreground">
                              {new Date(transaction.date).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={`text-lg font-bold ${transaction.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                          {transaction.type === 'income' ? '+' : '-'}{formatKES(transaction.amount).replace('KSh ', '')}
                        </p>
                        <div className="flex gap-2 mt-1">
                          <Badge className={getTypeColor(transaction.type)}>
                            {transaction.type}
                          </Badge>
                          <Badge className={getStatusColor(transaction.status)}>
                            {transaction.status}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
