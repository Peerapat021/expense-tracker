'use client';
import { useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function ExpenseForm({ onAdd }: { onAdd: () => void }) {
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState<number | ''>('');
  const [category, setCategory] = useState('');
  const [spentAt, setSpentAt] = useState(new Date().toISOString().slice(0, 10));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !amount || !category) {
      setError('กรุณากรอกข้อมูลให้ครบถ้วน');
      return;
    }
    setLoading(true);
    try {
      const { error } = await supabase.from('expenses').insert([
        { title, amount: Number(amount), category, spent_at: spentAt },
      ]);
      console.log(error);

      if (error) throw error;
      setTitle(''); setAmount(''); setCategory(''); setSpentAt(new Date().toISOString().slice(0, 10));
      onAdd();
    } catch {
      setError('บันทึกข้อมูลไม่สำเร็จ');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white shadow-lg rounded-lg p-6 mb-6 m-8">
      <div className="container mx-auto">
        <h2 className="text-xl font-bold mb-4 text-gray-700">เพิ่มรายการค่าใช้จ่าย</h2>
        {error && <p className="text-red-500 mb-3">{error}</p>}
        <form className="grid grid-cols-1 md:grid-cols-5 gap-3" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="รายการ"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-400"
          />
          <input
            type="number"
            placeholder="จำนวนเงิน"
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
            className="px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-400"
          />
          <input
            type="text"
            placeholder="หมวดหมู่"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-400"
          />
          <input
            type="date"
            value={spentAt}
            onChange={(e) => setSpentAt(e.target.value)}
            className="px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-400"
          />
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md"
          >
            {loading ? 'กำลังบันทึก...' : 'เพิ่ม'}
          </button>
        </form>
      </div>
    </div>
  );
}
