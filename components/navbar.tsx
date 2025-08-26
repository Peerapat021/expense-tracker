'use client';
import React, { useState, useEffect } from 'react';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <nav className="bg-blue-900 text-white px-6 py-3 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo */}
        <div className="flex items-center space-x-2">
          <span className="bg-white text-blue-900 rounded-full px-2 py-1 font-bold text-lg">ET</span>
          <span className="text-2xl font-extrabold tracking-wide">ExpenseTracker</span>
        </div>

        {/* เมนูหลัก */}
        <div className="hidden md:flex space-x-6">
          <a href="/" className="hover:text-blue-300">Dashboard</a>
          <a href="/ExpenseTable" className="hover:text-blue-300">รายการ</a>
         
        </div>

        {/* ปุ่มมือถือ */}
        {isClient && (
          <button
            className="md:hidden px-3 py-2 bg-blue-700 rounded-md"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            Menu
          </button>
        )}
      </div>

      {/* เมนูมือถือ */}
      {isClient && mobileMenuOpen && (
        <div className="md:hidden flex flex-col space-y-3 mt-3 px-6">
          <a href="/" className="hover:text-blue-300">Dashboard</a>
          <a href="/ExpenseTable" className="hover:text-blue-300">รายการ</a>
          
        </div>
      )}
    </nav>
  );
}
