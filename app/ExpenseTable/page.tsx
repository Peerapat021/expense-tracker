'use client';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export interface Expense {
  id: number;
  title: string;
  amount: number;
  category: string;
  spent_at: string;
}

export default function ExpenseDashboard() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterCategory, setFilterCategory] = useState('');
  const [sortBy, setSortBy] = useState<'date' | 'amount' | 'title'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    fetchExpenses();
  }, []);

  const fetchExpenses = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('expenses')
        .select('*')
        .order('id', { ascending: false });
      if (!error && data) setExpenses(data as Expense[]);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (!isClient) return null;

  const filtered = expenses
    .filter((e) => {
      const matchesCategory = filterCategory === '' || e.category === filterCategory;
      const expenseDate = e.spent_at.slice(0, 10);
      const matchesStart = !startDate || expenseDate >= startDate;
      const matchesEnd = !endDate || expenseDate <= endDate;
      return matchesCategory && matchesStart && matchesEnd;
    })
    .sort((a, b) => {
      let cmp = 0;
      if (sortBy === 'amount') cmp = a.amount - b.amount;
      else if (sortBy === 'title') cmp = a.title.localeCompare(b.title, 'th');
      else cmp = new Date(a.spent_at).getTime() - new Date(b.spent_at).getTime();
      return sortOrder === 'asc' ? cmp : -cmp;
    });

  const categories = Array.from(new Set(expenses.map((e) => e.category)));

  // --- ExpenseForm ---
  const ExpenseForm = () => {
    const [title, setTitle] = useState('');
    const [amount, setAmount] = useState<number | ''>('');
    const [category, setCategory] = useState('');
    const [spentAt, setSpentAt] = useState(new Date().toISOString().slice(0, 10));
    const [loadingForm, setLoadingForm] = useState(false);
    const [formError, setFormError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!title || !amount || !category) {
        setFormError('กรุณากรอกข้อมูลให้ครบถ้วน');
        return;
      }
      setLoadingForm(true);
      try {
        const { error } = await supabase.from('expenses').insert([
          { title, amount: Number(amount), category, spent_at: spentAt },
        ]);
        if (error) throw error;

        setTitle(''); setAmount(''); setCategory(''); setSpentAt(new Date().toISOString().slice(0, 10));
        setFormError(null);
        await fetchExpenses();
      } catch (err) {
        console.error(err);
        setFormError('บันทึกข้อมูลไม่สำเร็จ');
      } finally {
        setLoadingForm(false);
      }
    };

    return (
      <div className="p-6 mb-[3rem] w-full max-w-6xl mx-auto border-b border-gray-400">
        <h2 className="text-xl font-bold mb-4 text-gray-700">เพิ่มรายการค่าใช้จ่าย</h2>
        {formError && <p className="text-red-500 mb-3">{formError}</p>}
        <form className="grid grid-cols-1 md:grid-cols-5 gap-3" onSubmit={handleSubmit}>
          <input
            type="text" placeholder="รายการ" value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-400"
          />
          <input
            type="number" placeholder="จำนวนเงิน" value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
            className="px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-400"
          />
          <input
            type="text" placeholder="หมวดหมู่" value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-400"
          />
          <input
            type="date" value={spentAt} onChange={(e) => setSpentAt(e.target.value)}
            className="px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-400"
          />
          <button
            type="submit" disabled={loadingForm}
            className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-md"
          >
            {loadingForm ? 'กำลังบันทึก...' : 'เพิ่ม'}
          </button>
        </form>
      </div>
    );
  };

  // --- ExpenseTable ---
  const ExpenseTable = () => (
    <div className="bg-white drop-shadow-xl rounded-lg p-6 w-full max-w-6xl mx-auto">
      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-4">
        <select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)}
          className="px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-400">
          <option value="">ทั้งหมด</option>
          {categories.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        <select value={sortBy} onChange={(e) => setSortBy(e.target.value as any)}
          className="px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-400">
          <option value="date">วันที่</option>
          <option value="amount">จำนวนเงิน</option>
          <option value="title">รายการ</option>
        </select>
        <select value={sortOrder} onChange={(e) => setSortOrder(e.target.value as any)}
          className="px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-400">
          <option value="desc">มากไปน้อย</option>
          <option value="asc">น้อยไปมาก</option>
        </select>
        <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)}
          className="px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-400" />
        <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)}
          className="px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-400" />
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-md">
        <table className="min-w-full bg-white">
          <thead className="bg-gray-100 text-gray-600 uppercase text-xs font-medium">
            <tr>
              <th className="px-4 py-3 text-left">รายการ</th>
              <th className="px-4 py-3 text-left">จำนวนเงิน</th>
              <th className="px-4 py-3 text-left">หมวดหมู่</th>
              <th className="px-4 py-3 text-left">วันที่</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={4} className="text-center py-6 text-gray-400">ไม่พบข้อมูล</td>
              </tr>
            ) : filtered.map(e => (
              <tr key={e.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3">{e.title}</td>
                <td className="px-4 py-3 text-green-600 font-semibold">฿{e.amount.toLocaleString()}</td>
                <td className="px-4 py-3">
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">{e.category}</span>
                </td>
                <td className="px-4 py-3">{new Date(e.spent_at).toLocaleDateString('th-TH')}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <div className="space-y-6 my-6">
      <ExpenseForm />
      <ExpenseTable />
    </div>
  );
}
