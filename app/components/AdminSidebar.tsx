'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { LayoutDashboard, User, ShoppingBag, Calendar, MessageSquare, LogOut, Camera } from 'lucide-react';

export default function AdminSidebar() {
  const pathname = usePathname();
  const { logout } = useAuth();

  const links = [
    { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Profile Editor', href: '/admin/profile', icon: User },
    { name: 'Orders', href: '/admin/orders', icon: ShoppingBag },
    { name: 'Calendar', href: '/admin/calendar', icon: Calendar },
    { name: 'Collaborate', href: '/admin/collaborate', icon: MessageSquare },
  ];

  return (
    <div className="w-64 bg-white border-r border-gray-200 h-screen sticky top-0 flex flex-col hidden lg:flex">
      {/* Brand Logo */}
      <div className="h-16 flex items-center px-6 border-b border-gray-200">
        <Link href="/" className="group flex items-center shrink-0">
            <Camera className="w-5 h-5 text-amber-700 mr-2" />
            <span className="text-xl font-light tracking-widest text-gray-900">
            SNAP<span className="font-semibold text-amber-700">LK</span>
            </span>
        </Link>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 py-6 px-4 space-y-2 overflow-y-auto">
        {links.map((link) => {
          const isActive = pathname === link.href;
          const Icon = link.icon;
          return (
            <Link
              key={link.name}
              href={link.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 font-medium text-sm
                ${isActive 
                  ? 'bg-amber-50 text-amber-700 shadow-[inset_0_0_0_1px_rgba(217,119,6,0.2)]' 
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'text-amber-700' : 'text-gray-400'}`} />
              {link.name}
            </Link>
          );
        })}
      </nav>

      {/* Bottom Footer Action */}
      <div className="p-4 border-t border-gray-200">
        <button
          onClick={logout}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50 rounded-xl transition-colors duration-200"
        >
          <LogOut className="w-4 h-4" />
          Log Out
        </button>
      </div>
    </div>
  );
}
