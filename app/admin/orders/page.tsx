'use client';

import React from 'react';
import { ProtectedRoute } from '@/app/components/ProtectedRoute';
import AdminLayout from '@/app/components/AdminLayout';
import { ShoppingBag, Search, Filter } from 'lucide-react';

export default function OrdersPage() {
  return (
    <ProtectedRoute allowedRoles={['admin']}>
      <AdminLayout>
        <div className="p-8">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Order Management</h1>
                    <p className="text-gray-500 mt-1">Review active bookings and incoming requests.</p>
                </div>
                <div className="flex gap-3">
                    <div className="relative">
                        <Search className="w-5 h-5 absolute left-3 top-2.5 text-gray-400" />
                        <input type="text" placeholder="Search orders..." className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none w-64"/>
                    </div>
                </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-12 text-center">
                <ShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h2 className="text-xl font-semibold text-gray-900 mb-2">No Active Orders Yet</h2>
                <p className="text-gray-500">When clients book your service packages, they will appear here seamlessly connected to your payments.</p>
            </div>
        </div>
      </AdminLayout>
    </ProtectedRoute>
  );
}
