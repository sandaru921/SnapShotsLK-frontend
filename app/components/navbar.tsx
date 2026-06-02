'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Search, SlidersHorizontal, Menu, X, User, LogOut, LayoutDashboard, ChevronDown, Home, Camera, Video, BookImage, Maximize2, Building2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

interface NavbarProps {
  currentPath: string;
}

// ── Logo ──────────────────────────────────────────────────────────
const Logo: React.FC = () => (
  <Link href="/" className="group flex items-center shrink-0">
    <span className="text-xl sm:text-2xl font-light tracking-widest text-gray-900 group-hover:opacity-80 transition-opacity">
      SNAPSHOTS<span className="font-semibold text-amber-700">LK</span>
    </span>
  </Link>
);

// ── Avatar / Initials ────────────────────────────────────────────
const UserAvatar: React.FC<{ name?: string; avatarUrl?: string }> = ({ name, avatarUrl }) => {
  if (avatarUrl) return <img src={avatarUrl} alt={name} className="w-8 h-8 rounded-full object-cover" />;
  const initials = name ? name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() : '?';
  return (
    <span className="w-8 h-8 rounded-full bg-amber-700 text-white text-xs font-bold flex items-center justify-center">
      {initials}
    </span>
  );
};

// ── Role badge colour ────────────────────────────────────────────
const roleBadge = (role?: string) => {
  if (role === 'admin') return 'bg-amber-50 text-amber-700';
  if (role === 'superadmin') return 'bg-purple-50 text-purple-700';
  if (role === 'pending_admin') return 'bg-yellow-50 text-yellow-700';
  return 'bg-green-50 text-green-700'; // Client
};
const roleLabel = (role?: string) => {
  if (role === 'admin') return 'Professional';
  if (role === 'superadmin') return 'Super Admin';
  if (role === 'pending_admin') return 'Pending Approval';
  return 'Client';
};

// ── User Dropdown Menu ────────────────────────────────────────────
const UserMenu: React.FC = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setIsOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  if (!isAuthenticated) {
    return (
      <div className="flex items-center gap-2">
        <Link href="/user/login" className="px-4 py-1.5 text-sm font-medium text-gray-700 hover:text-amber-700 transition">
          Sign In
        </Link>
        <Link href="/user/register" className="px-4 py-1.5 bg-amber-700 hover:bg-amber-800 text-white rounded-lg text-sm font-medium transition shadow-sm">
          Get Started
        </Link>
      </div>
    );
  }

  const handleLogout = () => {
    logout();
    setIsOpen(false);
    router.push('/');
  };

  const dashboardHref = user?.role === 'superadmin' ? '/superadmin/dashboard'
    : user?.role === 'admin' ? '/admin/dashboard'
    : '/user/profile';

  return (
    <div ref={menuRef} className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-2 py-1.5 border border-gray-200 hover:border-amber-400 rounded-xl transition-all duration-200 group"
        aria-haspopup="true"
        aria-expanded={isOpen}
      >
        <UserAvatar name={user?.name} avatarUrl={user?.avatar} />
        <ChevronDown className={`w-4 h-4 text-gray-500 group-hover:text-amber-700 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-60 bg-white border border-gray-100 rounded-2xl shadow-2xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150">
          {/* Header */}
          <div className="px-4 py-3 bg-gray-50 border-b border-gray-100">
            <p className="text-sm font-semibold text-gray-900 truncate">{user?.name}</p>
            <p className="text-xs text-gray-400 truncate mt-0.5">{user?.email}</p>
            <span className={`inline-block mt-1.5 px-2 py-0.5 text-xs font-medium rounded-full ${roleBadge(user?.role)}`}>
              {roleLabel(user?.role)}
            </span>
          </div>

          {/* Links */}
          <div className="py-1.5">
            <Link
              href={dashboardHref}
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-amber-50 hover:text-amber-700 transition"
            >
              <LayoutDashboard className="w-4 h-4" />
              {user?.role === 'admin' ? 'My Dashboard' : user?.role === 'superadmin' ? 'SA Dashboard' : 'My Profile'}
            </Link>

            {user?.role === 'admin' && (
              <Link
                href="/admin/profile"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-amber-50 hover:text-amber-700 transition"
              >
                <User className="w-4 h-4" />
                Edit Profile
              </Link>
            )}
          </div>

          {/* Logout */}
          <div className="border-t border-gray-100 py-1.5">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition"
            >
              <LogOut className="w-4 h-4" />
              Log Out
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// ── Filter Drawer ────────────────────────────────────────────────
const FilterDrawer: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative ml-auto w-full max-w-sm bg-white h-full shadow-2xl flex flex-col overflow-y-auto">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h3 className="font-semibold text-gray-900 text-lg">Filters</h3>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100 transition"><X className="w-5 h-5 text-gray-500" /></button>
        </div>
        <div className="flex-grow px-6 py-6 space-y-6">
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-widest mb-2">Price Range (LKR)</label>
            <div className="flex gap-3">
              <input type="number" placeholder="Min" className="w-1/2 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:border-amber-500 focus:ring-1 focus:ring-amber-200 outline-none" />
              <input type="number" placeholder="Max" className="w-1/2 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:border-amber-500 focus:ring-1 focus:ring-amber-200 outline-none" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-widest mb-2">Location</label>
            <select className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:border-amber-500 outline-none">
              <option>All Locations</option>
              <option>Colombo</option><option>Kandy</option><option>Galle</option><option>Negombo</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-widest mb-2">Minimum Rating</label>
            <div className="grid grid-cols-2 gap-2">
              {['Any', '4+ ★', '4.5+ ★', '5 ★'].map(r => (
                <label key={r} className="flex items-center gap-2 border border-gray-200 rounded-lg px-3 py-2 cursor-pointer hover:border-amber-400 transition text-sm">
                  <input type="radio" name="rating" className="accent-amber-600" />{r}
                </label>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-widest mb-2">Availability</label>
            <div className="space-y-2">
              {['Available This Week', 'Available This Month'].map(a => (
                <label key={a} className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                  <input type="checkbox" className="accent-amber-600 w-4 h-4" />{a}
                </label>
              ))}
            </div>
          </div>
        </div>
        <div className="px-6 py-4 border-t border-gray-100">
          <button onClick={onClose} className="w-full py-3 bg-amber-700 hover:bg-amber-800 text-white rounded-xl font-semibold text-sm transition shadow-md">
            Apply Filters
          </button>
        </div>
      </div>
    </div>
  );
};

// ── Public nav items with icons ───────────────────────────────────
const publicNavItems = [
  { name: 'Home', href: '/', Icon: Home },
  { name: 'Photographers', href: '/user/photographers', Icon: Camera },
  { name: 'Videographers', href: '/user/videographers', Icon: Video },
  { name: 'Albums', href: '/user/albums', Icon: BookImage },
  { name: 'Enlargements', href: '/user/enlargements', Icon: Maximize2 },
  { name: 'Studios', href: '/user/studios', Icon: Building2 },
];

const adminNavItems = [
  { name: 'Dashboard', href: '/admin/dashboard', Icon: LayoutDashboard },
  { name: 'Profile', href: '/admin/profile', Icon: User },
  { name: 'Orders', href: '/admin/orders', Icon: BookImage },
];

const superadminNavItems = [
  { name: 'SA Dashboard', href: '/superadmin/dashboard', Icon: LayoutDashboard },
];

// ── Main Navbar ───────────────────────────────────────────────────
export const Navbar: React.FC<NavbarProps> = ({ currentPath }) => {
  const { user: navUser } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 8);
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, []);

  // close mobile menu on resize
  useEffect(() => {
    const handler = () => { if (window.innerWidth >= 1024) setIsMenuOpen(false); };
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, []);

  const navItems = navUser?.role === 'admin' ? adminNavItems
    : navUser?.role === 'superadmin' ? superadminNavItems
    : publicNavItems;

  const showSearch = !navUser || navUser.role === 'Client';

  return (
    <>
      <header className={`sticky top-0 z-40 bg-white transition-shadow duration-300 ${scrolled ? 'shadow-md border-b border-gray-100' : 'border-b border-gray-200'}`}>
        <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 gap-4">

            {/* Logo */}
            <Logo />

            {/* Desktop nav */}
            <nav className="hidden lg:flex items-center gap-1 flex-shrink-0">
              {navItems.map(({ name, href, Icon }) => {
                const active = currentPath === href;
                return (
                  <Link
                    key={href}
                    href={href}
                    className={`relative flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 group
                      ${active ? 'text-amber-700 bg-amber-50' : 'text-gray-600 hover:text-amber-700 hover:bg-amber-50'}`}
                  >
                    <Icon className="w-4 h-4" />
                    {name}
                    {active && <span className="absolute bottom-0 left-3 right-3 h-0.5 bg-amber-700 rounded-full" />}
                  </Link>
                );
              })}
            </nav>

            {/* Right side: Search + User */}
            <div className="hidden lg:flex items-center gap-3 flex-shrink-0">
              {showSearch && (
                <div className="relative flex items-center bg-gray-50 border border-gray-200 rounded-xl hover:border-amber-400 focus-within:border-amber-500 focus-within:ring-2 focus-within:ring-amber-100 transition-all w-52 xl:w-72">
                  <Search className="w-4 h-4 text-gray-400 ml-3 shrink-0" />
                  <input
                    type="text"
                    value={searchQuery}
                    placeholder="Search professionals..."
                    onChange={e => setSearchQuery(e.target.value)}
                    className="grow bg-transparent px-2 py-2 text-sm text-gray-900 placeholder-gray-400 focus:outline-none"
                  />
                  <button onClick={() => setIsFilterOpen(true)} className="p-2 mr-1 hover:bg-white rounded-lg transition" title="Filters">
                    <SlidersHorizontal className="w-4 h-4 text-gray-500 hover:text-amber-700 transition" />
                  </button>
                </div>
              )}
              <UserMenu />
            </div>

            {/* Mobile: hamburger */}
            <button
              className="lg:hidden p-2 rounded-lg text-gray-700 hover:bg-gray-100 transition"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile drawer */}
        {isMenuOpen && (
          <div className="lg:hidden bg-white border-t border-gray-100 shadow-lg">
            {/* Search */}
            {showSearch && (
              <div className="px-4 pt-4 pb-3">
                <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 focus-within:border-amber-500">
                  <Search className="w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search professionals..."
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    className="grow bg-transparent text-sm text-gray-900 placeholder-gray-400 focus:outline-none"
                  />
                  <button onClick={() => { setIsFilterOpen(true); setIsMenuOpen(false); }}>
                    <SlidersHorizontal className="w-4 h-4 text-gray-500" />
                  </button>
                </div>
              </div>
            )}

            {/* Nav links */}
            <nav className="px-4 pb-3 space-y-0.5">
              {navItems.map(({ name, href, Icon }) => {
                const active = currentPath === href;
                return (
                  <Link
                    key={href}
                    href={href}
                    onClick={() => setIsMenuOpen(false)}
                    className={`flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium transition
                      ${active ? 'bg-amber-50 text-amber-700' : 'text-gray-700 hover:bg-gray-50 hover:text-amber-700'}`}
                  >
                    <Icon className="w-5 h-5" />
                    {name}
                  </Link>
                );
              })}
            </nav>

            {/* Mobile user area */}
            <div className="px-4 py-3 border-t border-gray-100">
              <UserMenu />
            </div>
          </div>
        )}
      </header>

      <FilterDrawer isOpen={isFilterOpen} onClose={() => setIsFilterOpen(false)} />
    </>
  );
};