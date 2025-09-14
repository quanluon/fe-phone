'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { 
  ShoppingCartIcon, 
  UserIcon, 
  HeartIcon, 
  MagnifyingGlassIcon,
  Bars3Icon,
  ChevronDownIcon
} from '@heroicons/react/24/outline';
import { Input } from '@/components/ui/Input';
import { CartSidebar } from '@/components/cart/CartSidebar';
import { DynamicNavigation } from '@/components/layout/DynamicNavigation';
import { useCartStore } from '@/stores/cart';
import { useWishlistStore } from '@/stores/wishlist';
import { useAuthStore } from '@/stores/auth';
import { useUIStore } from '@/stores/ui';
import { COUNTRY_OPTIONS, CONTACT_INFO } from '@/lib/constants';

export const Header: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showCartSidebar, setShowCartSidebar] = useState(false);
  
  const t = useTranslations();
  const router = useRouter();
  const { totalItems } = useCartStore();
  const { items: wishlistItems } = useWishlistStore();
  const { isAuthenticated, user } = useAuthStore();
  const { country, setCountry } = useUIStore();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleCountryChange = (newCountry: string) => {
    setCountry(newCountry as 'VN' | 'US');
  };

  return (
    <>
      {/* Top Bar */}
      <div className="bg-blue-900 text-white py-2">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between text-sm">
            {/* Left side - Country & Currency */}
            <div className="flex items-center space-x-2 sm:space-x-4">
              <select
                value={country}
                onChange={(e) => handleCountryChange(e.target.value)}
                className="bg-transparent border-none text-white focus:outline-none cursor-pointer text-xs sm:text-sm"
              >
                {COUNTRY_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value} className="bg-blue-900">
                    {option.label}
                  </option>
                ))}
              </select>
              {/* <div className="hidden xs:block">
                <CurrencySwitcher />
              </div> */}
            </div>
            
            {/* Center - Free delivery message */}
            <div className="text-center hidden sm:block flex-1">
              <p className="text-xs sm:text-sm">{t('header.freeDelivery')}</p>
            </div>
            
            {/* Right side - Auth links */}
            <div className="flex items-center space-x-2 sm:space-x-4">
              {isAuthenticated ? (
                <div className="relative">
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center space-x-1 hover:text-blue-200 transition-colors"
                  >
                    <UserIcon className="h-4 w-4" />
                    <span className="hidden sm:inline">{user?.firstName || user?.email}</span>
                    <ChevronDownIcon className="h-3 w-3" />
                  </button>
                  
                  {showUserMenu && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                      <Link
                        href="/profile"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        {t('header.profile')}
                      </Link>
                      <Link
                        href="/orders"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        {t('header.orders')}
                      </Link>
                      <button
                        onClick={() => {
                          // Handle logout
                          setShowUserMenu(false);
                        }}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        {t('header.signOut')}
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <>
                  <Link href="/auth/register" className="hover:text-blue-200 transition-colors text-xs sm:text-sm">
                    {t('header.createAccount')}
                  </Link>
                  <Link href="/auth/login" className="hover:text-blue-200 transition-colors text-xs sm:text-sm">
                    {t('header.signIn')}
                  </Link>
                </>
              )}
            </div>
          </div>
          
          {/* Mobile free delivery message */}
          <div className="text-center sm:hidden mt-2">
            <p className="text-xs">{t('header.freeDelivery')}</p>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <header className="bg-white shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14 sm:h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-1 sm:space-x-2">
              <ShoppingCartIcon className="h-6 w-6 sm:h-8 sm:w-8 text-blue-600" />
              <span className="text-lg sm:text-xl font-bold text-gray-900">{CONTACT_INFO.name}</span>
            </Link>

            {/* Desktop Navigation */}
            <DynamicNavigation />

            {/* Search Bar */}
            <div className="hidden md:flex flex-1 max-w-md mx-4 lg:mx-8">
              <form onSubmit={handleSearch} className="w-full">
                <Input
                  type="search"
                  placeholder={t('header.searchPlaceholder')}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  leftIcon={<MagnifyingGlassIcon className="h-4 w-4" />}
                  className="w-full"
                />
              </form>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center space-x-1 sm:space-x-2 lg:space-x-4">
              {/* Search Icon (Mobile) */}
              <button className="md:hidden p-1.5 sm:p-2 text-gray-600 hover:text-blue-600">
                <MagnifyingGlassIcon className="h-5 w-5" />
              </button>

              {/* User Icon */}
              <Link href={isAuthenticated ? "/profile" : "/auth/login"} className="p-1.5 sm:p-2 text-gray-600 hover:text-blue-600">
                <UserIcon className="h-5 w-5" />
              </Link>

              {/* Wishlist */}
              <Link href="/wishlist" className="relative p-1.5 sm:p-2 text-gray-600 hover:text-blue-600">
                <HeartIcon className="h-5 w-5" />
                {wishlistItems.length > 0 && (
                  <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                    {wishlistItems.length}
                  </span>
                )}
              </Link>

              {/* Cart */}
              <button 
                onClick={() => setShowCartSidebar(true)}
                className="relative p-1.5 sm:p-2 text-gray-600 hover:text-blue-600"
              >
                <ShoppingCartIcon className="h-5 w-5" />
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                    {totalItems}
                  </span>
                )}
              </button>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setShowMobileMenu(!showMobileMenu)}
                className="lg:hidden p-1.5 sm:p-2 text-gray-600 hover:text-blue-600"
              >
                <Bars3Icon className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Mobile Search Bar */}
          {showMobileMenu && (
            <div className="md:hidden py-4 border-t">
              <form onSubmit={handleSearch}>
                <Input
                  type="search"
                  placeholder={t('header.searchPlaceholder')}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  leftIcon={<MagnifyingGlassIcon className="h-4 w-4" />}
                />
              </form>
            </div>
          )}

          {/* Mobile Navigation */}
          {showMobileMenu && (
            <div className="lg:hidden py-4 border-t">
              <DynamicNavigation className="flex flex-col space-y-2" />
            </div>
          )}
        </div>
      </header>

      {/* Cart Sidebar */}
      <CartSidebar 
        isOpen={showCartSidebar} 
        onClose={() => setShowCartSidebar(false)} 
      />
    </>
  );
};
