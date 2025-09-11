import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.56.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { start_date, end_date, category, user_id } = await req.json();

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    console.log(`Calculating P&L from ${start_date} to ${end_date}${category ? ` for category: ${category}` : ''}`);

    // Build date filters
    const dateFilter = (query: any) => {
      if (start_date) query = query.gte('created_at', start_date);
      if (end_date) query = query.lte('created_at', end_date);
      return query;
    };

    // Get sales data
    let salesQuery = supabase
      .from('sales')
      .select('total_amount, unit_price, quantity, product_type, sale_date, payment_status');
    
    if (category) {
      salesQuery = salesQuery.eq('product_type', category);
    }
    
    salesQuery = dateFilter(salesQuery);
    const { data: sales, error: salesError } = await salesQuery;

    if (salesError) {
      console.error('Error fetching sales:', salesError);
      throw salesError;
    }

    // Get purchases data
    let purchasesQuery = supabase
      .from('purchases')
      .select('total_cost, unit_cost, quantity, category, purchase_date, payment_status');
    
    if (category) {
      purchasesQuery = purchasesQuery.eq('category', category);
    }
    
    purchasesQuery = dateFilter(purchasesQuery);
    const { data: purchases, error: purchasesError } = await purchasesQuery;

    if (purchasesError) {
      console.error('Error fetching purchases:', purchasesError);
      throw purchasesError;
    }

    // Calculate revenue
    const totalRevenue = sales?.reduce((sum, sale) => 
      sum + (sale.total_amount || 0), 0) || 0;
    
    const paidRevenue = sales?.filter(sale => sale.payment_status === 'paid')
      .reduce((sum, sale) => sum + (sale.total_amount || 0), 0) || 0;

    // Calculate costs
    const totalCosts = purchases?.reduce((sum, purchase) => 
      sum + (purchase.total_cost || 0), 0) || 0;
    
    const paidCosts = purchases?.filter(purchase => purchase.payment_status === 'paid')
      .reduce((sum, purchase) => sum + (purchase.total_cost || 0), 0) || 0;

    // Calculate profit/loss
    const grossProfit = totalRevenue - totalCosts;
    const netProfit = paidRevenue - paidCosts;
    const profitMargin = totalRevenue > 0 ? (grossProfit / totalRevenue) * 100 : 0;

    // Calculate trends by month
    const monthlyData = new Map();
    
    sales?.forEach(sale => {
      const month = new Date(sale.sale_date).toISOString().substring(0, 7);
      if (!monthlyData.has(month)) {
        monthlyData.set(month, { revenue: 0, costs: 0, sales_count: 0, purchases_count: 0 });
      }
      const data = monthlyData.get(month);
      data.revenue += sale.total_amount || 0;
      data.sales_count += 1;
    });

    purchases?.forEach(purchase => {
      const month = new Date(purchase.purchase_date).toISOString().substring(0, 7);
      if (!monthlyData.has(month)) {
        monthlyData.set(month, { revenue: 0, costs: 0, sales_count: 0, purchases_count: 0 });
      }
      const data = monthlyData.get(month);
      data.costs += purchase.total_cost || 0;
      data.purchases_count += 1;
    });

    const monthlyTrends = Array.from(monthlyData.entries())
      .map(([month, data]) => ({
        month,
        revenue: data.revenue,
        costs: data.costs,
        profit: data.revenue - data.costs,
        sales_count: data.sales_count,
        purchases_count: data.purchases_count,
      }))
      .sort((a, b) => a.month.localeCompare(b.month));

    // Product/category performance
    const categoryPerformance = new Map();
    
    sales?.forEach(sale => {
      const cat = sale.product_type || 'Other';
      if (!categoryPerformance.has(cat)) {
        categoryPerformance.set(cat, { revenue: 0, quantity: 0, transactions: 0 });
      }
      const perf = categoryPerformance.get(cat);
      perf.revenue += sale.total_amount || 0;
      perf.quantity += sale.quantity || 0;
      perf.transactions += 1;
    });

    const topPerformingCategories = Array.from(categoryPerformance.entries())
      .map(([category, perf]) => ({
        category,
        revenue: perf.revenue,
        quantity: perf.quantity,
        transactions: perf.transactions,
        avg_transaction_value: perf.transactions > 0 ? perf.revenue / perf.transactions : 0,
      }))
      .sort((a, b) => b.revenue - a.revenue);

    const profitLossReport = {
      summary: {
        period: { start_date, end_date },
        category: category || 'All Categories',
        total_revenue: totalRevenue,
        paid_revenue: paidRevenue,
        total_costs: totalCosts,
        paid_costs: paidCosts,
        gross_profit: grossProfit,
        net_profit: netProfit,
        profit_margin_percent: profitMargin,
        total_sales_transactions: sales?.length || 0,
        total_purchase_transactions: purchases?.length || 0,
      },
      monthly_trends: monthlyTrends,
      category_performance: topPerformingCategories,
      generated_at: new Date().toISOString(),
      generated_by: user_id,
    };

    console.log('P&L calculation completed successfully');

    return new Response(JSON.stringify({
      success: true,
      profit_loss_report: profitLossReport,
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in calculate-profit-loss function:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      success: false 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});