'use client';

import { CartSidebar } from '@/components/cart/CartSidebar';
import { DynamicNavigation } from '@/components/layout/DynamicNavigation';
import { Input } from '@/components/ui/Input';
import { useLogout } from '@/hooks/useAuth';
import { useCart } from '@/hooks/useCart';
import { useDebounce } from '@/hooks/useDebounce';
import { CONTACT_INFO } from '@/lib/constants';
import { logger } from '@/lib/utils/logger';
import { useAuthStore } from '@/stores/auth';
import { useWishlistStore } from '@/stores/wishlist';
import {
  Bars3Icon,
  ChevronDownIcon,
  HeartIcon,
  MagnifyingGlassIcon,
  ShoppingCartIcon,
  UserIcon
} from '@heroicons/react/24/outline';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { LanguageSwitcher } from '../common/LanguageSwitcher';

export const Header: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showCartSidebar, setShowCartSidebar] = useState(false);
  
  const t = useTranslations();
  const router = useRouter();
  const { totalItems } = useCart();
  const { items: wishlistItems } = useWishlistStore();
  const { isAuthenticated, user } = useAuthStore();
  const logoutMutation = useLogout();

  // Debounced search query
  const debouncedSearchQuery = useDebounce(searchQuery, 500);

  // Navigate to products page when debounced search query changes
  useEffect(() => {
    if (debouncedSearchQuery.trim()) {
      router.push(`/products?search=${encodeURIComponent(debouncedSearchQuery.trim())}`);
    }
  }, [debouncedSearchQuery, router]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Search is handled by debounced effect
  };

  const handleLogout = async () => {
    try {
      await logoutMutation.mutateAsync();
      setShowUserMenu(false);
      router.push('/');
    } catch (error) {
      logger.debug({ error }, 'Logout failed');
    }
  };

  return (
    <>
      {/* Top Bar */}
      <div className="bg-blue-700 text-white py-2">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between text-sm">
            {/* Left side - Country & Currency */}
            <div className="flex items-center space-x-2 sm:space-x-4">
              <LanguageSwitcher />
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
                        onClick={handleLogout}
                        disabled={logoutMutation.isPending}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {logoutMutation.isPending ? t('common.loading') : t('header.signOut')}
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <>
                  <Link href="/auth?mode=register" className="hover:text-blue-200 transition-colors text-xs sm:text-sm">
                    {t('header.createAccount')}
                  </Link>
                  <Link href="/auth?mode=login" className="hover:text-blue-200 transition-colors text-xs sm:text-sm">
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
              <ShoppingCartIcon className="h-6 w-6 sm:h-8 sm:w-8 text-blue-600 hidden sm:inline" />
              <span className="text-lg sm:text-sm md:text-sm font-bold text-gray-900">{CONTACT_INFO.name}</span>
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
              {/* User Icon - Desktop Only */}
              <Link 
                href={isAuthenticated ? "/profile" : "/auth?mode=login"} 
                className="hidden lg:block p-1.5 sm:p-2 text-gray-700 hover:text-blue-600"
                aria-label={isAuthenticated ? t('header.profile') : t('header.signIn')}
              >
                <UserIcon className="h-5 w-5" />
              </Link>

              {/* Wishlist */}
              <Link 
                href="/wishlist" 
                className="relative p-1.5 sm:p-2 text-gray-700 hover:text-blue-600"
                aria-label={t('header.wishlist')}
              >
                <HeartIcon className="h-5 w-5" />
                {wishlistItems.length > 0 && (
                  <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-600 text-white text-xs font-semibold rounded-full flex items-center justify-center">
                    {wishlistItems.length}
                  </span>
                )}
              </Link>

              {/* Cart */}
              <button 
                onClick={() => setShowCartSidebar(true)}
                className="relative p-1.5 sm:p-2 text-gray-700 hover:text-blue-600"
                aria-label={t('header.cart')}
              >
                <ShoppingCartIcon className="h-5 w-5" />
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-600 text-white text-xs font-semibold rounded-full flex items-center justify-center">
                    {totalItems}
                  </span>
                )}
              </button>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setShowMobileMenu(!showMobileMenu)}
                className="lg:hidden p-1.5 sm:p-2 text-gray-700 hover:text-blue-600"
                aria-label={t('header.menu')}
              >
                <Bars3Icon className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {showMobileMenu && (
            <div className="lg:hidden border-t">
              {/* Mobile Search Bar */}
              <div className="py-4 px-2">
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

              {/* Mobile Profile Section */}
              <div className="py-4 px-2 border-t border-gray-200">
                {isAuthenticated ? (
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2 px-2 py-2 bg-gray-50 rounded-md">
                      <UserIcon className="h-5 w-5 text-gray-600" />
                      <span className="text-sm font-medium text-gray-900">
                        {user?.firstName || user?.email}
                      </span>
                    </div>
                    <Link
                      href="/profile"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md"
                      onClick={() => setShowMobileMenu(false)}
                    >
                      {t('header.profile')}
                    </Link>
                    <Link
                      href="/orders"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md"
                      onClick={() => setShowMobileMenu(false)}
                    >
                      {t('header.orders')}
                    </Link>
                    <button
                      onClick={() => {
                        handleLogout();
                        setShowMobileMenu(false);
                      }}
                      disabled={logoutMutation.isPending}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {logoutMutation.isPending ? t('common.loading') : t('header.signOut')}
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2 px-2 py-2 mb-2">
                      <UserIcon className="h-5 w-5 text-gray-600" />
                      <span className="text-sm font-medium text-gray-900">
                        {t('header.account')}
                      </span>
                    </div>
                    <Link
                      href="/auth?mode=register"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md"
                      onClick={() => setShowMobileMenu(false)}
                    >
                      {t('header.createAccount')}
                    </Link>
                    <Link
                      href="/auth?mode=login"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md"
                      onClick={() => setShowMobileMenu(false)}
                    >
                      {t('header.signIn')}
                    </Link>
                  </div>
                )}
              </div>

              {/* Mobile Navigation Links */}
              <div className="py-4 px-2 border-t border-gray-200">
                <DynamicNavigation className="flex flex-col space-y-2" />
              </div>
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
