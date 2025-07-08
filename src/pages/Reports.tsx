
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  BarChart3,
  Download,
  FileText,
  TrendingUp,
  DollarSign,
  Calendar,
  Filter
} from "lucide-react";
import { Layout } from "@/components/Layout";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell
} from "recharts";

const cropYieldData = [
  { month: 'Jan', yield: 1200 },
  { month: 'Feb', yield: 1500 },
  { month: 'Mar', yield: 1800 },
  { month: 'Apr', yield: 2200 },
  { month: 'May', yield: 2800 },
  { month: 'Jun', yield: 3200 },
];

const expenseData = [
  { category: 'Seeds', amount: 5000, color: 'hsl(84 31% 44%)' },
  { category: 'Labor', amount: 8000, color: 'hsl(31 45% 58%)' },
  { category: 'Equipment', amount: 3500, color: 'hsl(23 47% 42%)' },
  { category: 'Feed', amount: 4200, color: 'hsl(84 31% 44% / 0.7)' },
];

const profitData = [
  { month: 'Jan', income: 8000, expenses: 5000, profit: 3000 },
  { month: 'Feb', income: 9500, expenses: 6200, profit: 3300 },
  { month: 'Mar', income: 11000, expenses: 7500, profit: 3500 },
  { month: 'Apr', income: 13500, expenses: 8800, profit: 4700 },
  { month: 'May', income: 15200, expenses: 9500, profit: 5700 },
  { month: 'Jun', income: 16800, expenses: 10200, profit: 6600 },
];

export default function Reports() {
  const [selectedReport, setSelectedReport] = useState('overview');

  const reports = [
    { id: 'overview', name: 'Farm Overview', icon: BarChart3 },
    { id: 'crops', name: 'Crop Reports', icon: FileText },
    { id: 'livestock', name: 'Livestock Reports', icon: FileText },
    { id: 'financial', name: 'Financial Reports', icon: DollarSign },
  ];

  return (
    <Layout>
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Reports & Analytics</h1>
            <p className="text-gray-600 mt-1">Track performance and generate insights</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
            <Button className="bg-farm-green hover:bg-farm-green/90">
              <Download className="h-4 w-4 mr-2" />
              Export PDF
            </Button>
          </div>
        </div>

        {/* Report Type Selector */}
        <div className="flex flex-wrap gap-2">
          {reports.map((report) => (
            <Button
              key={report.id}
              variant={selectedReport === report.id ? "default" : "outline"}
              onClick={() => setSelectedReport(report.id)}
              className="flex items-center gap-2"
            >
              <report.icon className="h-4 w-4" />
              {report.name}
            </Button>
          ))}
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Crop Yield Trends */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-farm-green" />
                Crop Yield Trends
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={cropYieldData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="yield" fill="hsl(84 31% 44%)" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Expense Breakdown */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-farm-barn" />
                Expense Breakdown
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={expenseData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="amount"
                  >
                    {expenseData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Profit Analysis */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-farm-harvest" />
                Monthly Profit Analysis
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={profitData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="income" stroke="hsl(84 31% 44%)" strokeWidth={2} />
                  <Line type="monotone" dataKey="expenses" stroke="hsl(31 45% 58%)" strokeWidth={2} />
                  <Line type="monotone" dataKey="profit" stroke="hsl(23 47% 42%)" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Revenue</p>
                  <p className="text-2xl font-bold text-farm-green">$74,000</p>
                  <Badge className="mt-1 bg-green-100 text-green-800">+12.5%</Badge>
                </div>
                <TrendingUp className="h-8 w-8 text-farm-green" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Expenses</p>
                  <p className="text-2xl font-bold text-farm-barn">$47,200</p>
                  <Badge className="mt-1 bg-yellow-100 text-yellow-800">+8.2%</Badge>
                </div>
                <DollarSign className="h-8 w-8 text-farm-barn" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Net Profit</p>
                  <p className="text-2xl font-bold text-farm-harvest">$26,800</p>
                  <Badge className="mt-1 bg-green-100 text-green-800">+18.3%</Badge>
                </div>
                <BarChart3 className="h-8 w-8 text-farm-harvest" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">ROI</p>
                  <p className="text-2xl font-bold">56.8%</p>
                  <Badge className="mt-1 bg-green-100 text-green-800">+5.1%</Badge>
                </div>
                <TrendingUp className="h-8 w-8 text-farm-green" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}
