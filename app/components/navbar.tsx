'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Search, SlidersHorizontal, Menu, X, User, LogOut, LogIn } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';

// === TypeScript Interfaces ===
interface NavItemProps {
  name: string;
  href: string;
  isMobile: boolean;
  isActive: boolean;
}

interface SearchBarProps {
  searchQuery: string;
  onSearch: (query: string) => void;
  onFilter: () => void;
}

interface NavbarProps {
  currentPath: string;
}

// Logo Component
const Logo: React.FC = () => (
  <Link href="/" className="group flex items-center shrink-0">
    <span className="text-xl sm:text-2xl font-light tracking-wider sm:tracking-widest text-gray-900">
      SNAPSHOTS
      <span className="font-semibold text-amber-700">LK</span>
    </span>
  </Link>
);

// Navigation Item
const NavItem: React.FC<NavItemProps> = ({ name, href, isMobile, isActive }) => (
  <Link
    href={href}
    className={`
      group relative px-3 xl:px-6 py-2 font-medium text-xs xl:text-sm tracking-wide uppercase transition-all duration-300 whitespace-nowrap
      ${isMobile ? 'w-full text-left block' : ''}
      ${isActive ? 'text-amber-700' : 'text-gray-700 hover:text-amber-700'}
    `}
  >
    <span className="relative z-10">{name}</span>
    <span
      className={`
        absolute bottom-0 left-1/2 transform -translate-x-1/2 h-px bg-amber-700 transition-all duration-300
        ${isActive ? 'w-full' : 'w-0 group-hover:w-full'}
      `}
    ></span>
  </Link>
);

// Search Bar
const SearchBar: React.FC<SearchBarProps> = ({ searchQuery, onSearch, onFilter }) => (
  <div className="group relative flex items-center bg-white border border-gray-300 hover:border-amber-700 transition-all duration-300 w-full sm:max-w-xs lg:max-w-sm xl:max-w-md">
    <Search className="w-4 h-4 text-gray-400 ml-3 group-hover:text-amber-700 transition-colors duration-300 shrink-0" />
    <input
      type="text"
      value={searchQuery}
      placeholder="Search..."
      onChange={(e: React.ChangeEvent<HTMLInputElement>) => onSearch(e.target.value)}
      className="grow bg-transparent text-gray-900 placeholder-gray-400 px-2 py-2 text-sm focus:outline-none min-w-0"
    />
    <button
      onClick={onFilter}
      className="p-2 hover:bg-gray-50 transition-colors duration-300 mr-1 shrink-0"
      aria-label="Filter"
    >
      <SlidersHorizontal className="w-4 h-4 text-gray-600 hover:text-amber-700 transition-colors duration-300" />
    </button>
  </div>
);

// Filter Modal
const FilterModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white max-w-md w-full p-6 sm:p-8 shadow-2xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg sm:text-xl font-light tracking-wide uppercase text-gray-900">Filters</h3>
          <button onClick={onClose} className="text-gray-600 hover:text-gray-900">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 uppercase tracking-wide">Price Range</label>
            <div className="flex gap-4">
              <input
                type="number"
                placeholder="Min"
                className="w-1/2 px-3 py-2 border border-gray-300 focus:border-amber-700 focus:outline-none text-sm"
              />
              <input
                type="number"
                placeholder="Max"
                className="w-1/2 px-3 py-2 border border-gray-300 focus:border-amber-700 focus:outline-none text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 uppercase tracking-wide">Location</label>
            <select className="w-full px-3 py-2 border border-gray-300 focus:border-amber-700 focus:outline-none text-sm">
              <option>All Locations</option>
              <option>Colombo</option>
              <option>Kandy</option>
              <option>Galle</option>
              <option>Negombo</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 uppercase tracking-wide">Minimum Rating</label>
            <select className="w-full px-3 py-2 border border-gray-300 focus:border-amber-700 focus:outline-none text-sm">
              <option>Any Rating</option>
              <option>4+ Stars</option>
              <option>4.5+ Stars</option>
              <option>5 Stars</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 uppercase tracking-wide">Availability</label>
            <div className="space-y-2">
              <label className="flex items-center">
                <input type="checkbox" className="mr-2 accent-amber-700" />
                <span className="text-sm text-gray-700">Available This Week</span>
              </label>
              <label className="flex items-center">
                <input type="checkbox" className="mr-2 accent-amber-700" />
                <span className="text-sm text-gray-700">Available This Month</span>
              </label>
            </div>
          </div>

          <button className="w-full bg-amber-700 hover:bg-amber-800 text-white py-3 text-sm font-medium uppercase tracking-wide transition-colors duration-300">
            Apply Filters
          </button>
        </div>
      </div>
    </div>
  );
};

// Auth Buttons - Smaller Styled Sign In Button
const AuthButtons: React.FC = () => {
  return (
    <Link
      href="/user/login"
      className="px-4 py-1.5 bg-amber-700 hover:bg-amber-800 text-white rounded-md text-xs font-medium transition-all duration-300 shadow-sm hover:shadow-md"
    >
      Sign In
    </Link>
  );
};

// User Menu (replaces old UserProfile)
const UserMenu: React.FC = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!isAuthenticated) {
    return <AuthButtons />;
  }

  return (
    <div ref={menuRef} className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 p-2 border border-gray-300 hover:border-amber-700 transition-all duration-300 shrink-0 rounded-lg"
      >
        {user?.avatar ? (
          <img src={user.avatar} alt={user.name} className="w-8 h-8 rounded-full object-cover" />
        ) : (
          <User className="w-5 h-5 text-gray-700" />
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-200 rounded-lg shadow-xl z-50">
          <div className="px-4 py-3 border-b border-gray-100">
            <p className="text-sm font-medium text-gray-900">{user?.name}</p>
            <p className="text-xs text-gray-600 truncate">{user?.email}</p>
          </div>

          <div className="py-2">
            <Link
              href="/user/profile"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-amber-50 hover:text-amber-700 transition"
            >
              <User className="w-4 h-4" />
              My Profile
            </Link>

            {user?.role === 'admin' && (
              <Link
                href="/admin/dashboard"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-amber-50 hover:text-amber-700 transition"
              >
                <User className="w-4 h-4" />
                Dashboard
              </Link>
            )}

            {user?.role === 'superadmin' && (
              <Link
                href="/superadmin/dashboard"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-amber-50 hover:text-amber-700 transition"
              >
                <User className="w-4 h-4" />
                Admin Panel
              </Link>
            )}
          </div>

          <div className="border-t border-gray-100 py-2">
            <button
              onClick={() => {
                logout();
                setIsOpen(false);
              }}
              className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition"
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

// Main Navbar Component
export const Navbar: React.FC<NavbarProps> = ({ currentPath }) => {
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isFilterOpen, setIsFilterOpen] = useState<boolean>(false);

  const handleSearch = (query: string): void => {
    setSearchQuery(query);
    // Implement search logic here
  };

  const handleFilter = (): void => {
    setIsFilterOpen(true);
  };

  const navigationItems = [
    { name: 'Home', href: '/' },
    { name: 'Photographers', href: '/user/photographers' },
    { name: 'Videographers', href: '/user/videographers' },
    { name: 'Albums', href: '/user/albums' },
    { name: 'Enlargements', href: '/user/enlargements' },
    { name: 'Studios', href: '/user/studios' },
  ];

  return (
    <>
      <header className="sticky top-0 z-40 bg-white border-b border-gray-200 shadow-sm">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 gap-2 sm:gap-4">
            <Logo />

            <nav className="hidden xl:flex items-center justify-center grow">
              <div className="flex items-center space-x-1">
                {navigationItems.map((item) => (
                  <NavItem
                    key={item.href}
                    name={item.name}
                    href={item.href}
                    isMobile={false}
                    isActive={currentPath === item.href}
                  />
                ))}
              </div>
            </nav>

            <div className="hidden lg:flex items-center gap-2 sm:gap-4">
              <SearchBar searchQuery={searchQuery} onSearch={handleSearch} onFilter={handleFilter} />
              <UserMenu />
            </div>

            <button
              className="xl:hidden p-2 text-gray-900 hover:bg-gray-50 transition-colors shrink-0"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {isMenuOpen && (
            <div className="xl:hidden pb-4 space-y-4 border-t border-gray-200 pt-4">
              <SearchBar searchQuery={searchQuery} onSearch={handleSearch} onFilter={handleFilter} />

              <nav className="flex flex-col space-y-1">
                {navigationItems.map((item) => (
                  <NavItem
                    key={item.href}
                    name={item.name}
                    href={item.href}
                    isMobile={true}
                    isActive={currentPath === item.href}
                  />
                ))}
              </nav>

              <div className="flex justify-center pt-4 border-t border-gray-200">
                <UserMenu />
              </div>
            </div>
          )}
        </div>
      </header>

      <FilterModal isOpen={isFilterOpen} onClose={() => setIsFilterOpen(false)} />
    </>
  );
};