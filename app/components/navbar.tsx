'use client';

import React, { useState } from 'react';
import { Search, SlidersHorizontal, Menu, X, User } from 'lucide-react';
import Link from 'next/link';

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

// Logo Component - Luxury Style
const Logo: React.FC = () => (
  <Link href="/" className="group flex items-center shrink-0">
    <span className="text-xl sm:text-2xl font-light tracking-wider sm:tracking-widest text-gray-900">
      SNAPSHOTS
      <span className="font-semibold text-amber-700">LK</span>
    </span>
  </Link>
);

// Luxury Navigation Item Component
const NavItem: React.FC<NavItemProps> = ({ name, href, isMobile, isActive }) => {
  return (
    <Link
      href={href}
      className={`
        group relative px-3 xl:px-6 py-2 font-medium text-xs xl:text-sm tracking-wide uppercase transition-all duration-300 whitespace-nowrap
        ${isMobile ? 'w-full text-left block' : ''}
        ${isActive 
          ? 'text-amber-700' 
          : 'text-gray-700 hover:text-amber-700'
        }
      `}
    >
      {/* Text */}
      <span className="relative z-10">{name}</span>
      
      {/* Elegant underline */}
      <span className={`
        absolute bottom-0 left-1/2 transform -translate-x-1/2 h-px bg-amber-700 transition-all duration-300
        ${isActive ? 'w-full' : 'w-0 group-hover:w-full'}
      `}></span>
    </Link>
  );
};

// Enhanced Search Bar Component
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

// Filter Modal Component
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
          {/* Price Range */}
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

          {/* Location */}
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

          {/* Rating */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 uppercase tracking-wide">Minimum Rating</label>
            <select className="w-full px-3 py-2 border border-gray-300 focus:border-amber-700 focus:outline-none text-sm">
              <option>Any Rating</option>
              <option>4+ Stars</option>
              <option>4.5+ Stars</option>
              <option>5 Stars</option>
            </select>
          </div>

          {/* Availability */}
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

          {/* Apply Button */}
          <button className="w-full bg-amber-700 hover:bg-amber-800 text-white py-3 text-sm font-medium uppercase tracking-wide transition-colors duration-300">
            Apply Filters
          </button>
        </div>
      </div>
    </div>
  );
};

// User Profile Component
const UserProfile: React.FC = () => (
  <Link
    href="/profile"
    className="group relative p-2 border border-gray-300 hover:border-amber-700 transition-all duration-300 shrink-0"
  >
    <User className="w-5 h-5 text-gray-700 group-hover:text-amber-700 transition-colors duration-300" />
  </Link>
);

// Main Navbar Component
export const Navbar: React.FC<NavbarProps> = ({ currentPath }) => {
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isFilterOpen, setIsFilterOpen] = useState<boolean>(false);

  const handleSearch = (query: string): void => {
    setSearchQuery(query);
    console.log('Searching for:', query);
    // Implement search logic here
  };
  
  const handleFilter = (): void => {
    setIsFilterOpen(true);
  };

  // Navigation items
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
            
            {/* Logo - Left Corner */}
            <Logo />
            
            {/* Desktop Navigation - Center (Hidden on smaller screens) */}
            <nav className="hidden xl:flex items-center justify-center grow">
              <div className="flex items-center space-x-1">
                {navigationItems.map(item => (
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

            {/* Desktop Search & Profile - Right */}
            <div className="hidden lg:flex items-center gap-2 sm:gap-4">
              <SearchBar searchQuery={searchQuery} onSearch={handleSearch} onFilter={handleFilter} />
              <UserProfile />
            </div>

            {/* Mobile/Tablet Menu Button */}
            <button 
              className="xl:hidden p-2 text-gray-900 hover:bg-gray-50 transition-colors shrink-0"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Mobile/Tablet Menu */}
          {isMenuOpen && (
            <div className="xl:hidden pb-4 space-y-4 border-t border-gray-200 pt-4">
              {/* Mobile Search */}
              <SearchBar searchQuery={searchQuery} onSearch={handleSearch} onFilter={handleFilter} />
              
              {/* Mobile Navigation */}
              <nav className="flex flex-col space-y-1">
                {navigationItems.map(item => (
                  <NavItem 
                    key={item.href} 
                    name={item.name}
                    href={item.href}
                    isMobile={true}
                    isActive={currentPath === item.href}
                  />
                ))}
              </nav>
              
              {/* Mobile Profile */}
              <div className="flex justify-center pt-4 border-t border-gray-200">
                <UserProfile />
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Filter Modal */}
      <FilterModal isOpen={isFilterOpen} onClose={() => setIsFilterOpen(false)} />
    </>
  );
};