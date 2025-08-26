// Dashboard (กราฟจาก Recharts)

'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import {
  PieChart, Pie, Cell, Tooltip as ReTooltip, Legend,
  BarChart, Bar, XAxis, YAxis, CartesianGrid
} from 'recharts';

interface Expense {
  id: number;
  title: string;
  amount: number;
  category: string;
  spent_at: string;
}

const COLORS = ['#3b82f6', '#22c55e', '#f97316', '#e11d48', '#8b5cf6', '#14b8a6'];

export default function ExpenseChart() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchExpenses = async () => {
    const { data, error } = await supabase.from('expenses').select('*');
    if (!error && data) setExpenses(data as Expense[]);
    setLoading(false);
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  // Summary by Category
  const categoryData = Object.values(
    expenses.reduce((acc: any, e) => {
      acc[e.category] = acc[e.category] || { category: e.category, amount: 0 };
      acc[e.category].amount += e.amount;
      return acc;
    }, {})
  );

  // Summary by Date
  const dailyData = Object.values(
    expenses.reduce((acc: any, e) => {
      const d = new Date(e.spent_at).toLocaleDateString('th-TH');
      acc[d] = acc[d] || { date: d, amount: 0 };
      acc[d].amount += e.amount;
      return acc;
    }, {})
  ).sort((a: any, b: any) => new Date(a.date).getTime() - new Date(b.date).getTime());

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8 ">
      {/* Pie Chart */}
      <div className="bg-white p-4 rounded-lg shadow flex flex-col items-center justify-center">
        <h3 className="text-lg font-bold text-gray-700 mb-4 text-center">ค่าใช้จ่ายตามหมวดหมู่</h3>
        {loading ? (
          <div className="w-[400px] h-[300px] bg-gray-100 animate-pulse rounded-md" />
        ) : (
          <PieChart width={400} height={300}>
            <Pie
              data={categoryData}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={100}
              fill="#8884d8"
              dataKey="amount"
              nameKey="category"
            >
              {categoryData.map((entry: any, index: number) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <ReTooltip />
            <Legend />
          </PieChart>
        )}
      </div>

      {/* Bar Chart */}
      <div className="bg-white p-4 rounded-lg shadow flex flex-col items-center justify-center">
        <h3 className="text-lg font-bold text-gray-700 mb-4 text-center">ค่าใช้จ่ายตามวัน</h3>
        {loading ? (
          <div className="w-[400px] h-[300px] bg-gray-100 animate-pulse rounded-md" />
        ) : (
          <BarChart width={400} height={300} data={dailyData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <ReTooltip />
            <Legend />
            <Bar dataKey="amount" fill="#3b82f6" name="จำนวนเงิน (บาท)" />
          </BarChart>
        )}
      </div>
    </div>
  );
}
