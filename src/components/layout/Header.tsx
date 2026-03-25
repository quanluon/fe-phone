"use client";

import { CartSidebar } from "@/components/cart/CartSidebar";
import { DynamicNavigation } from "@/components/layout/DynamicNavigation";
import { Input } from "@/components/atoms/Input";
import { useLogout } from "@/hooks/useAuth";
import { useCart } from "@/hooks/useCart";
import { useDebounce } from "@/hooks/useDebounce";
import { CONTACT_INFO } from "@/lib/constants";
import { logger } from "@/lib/utils/logger";
import { useAuthStore } from "@/stores/auth";
import { useWishlistStore } from "@/stores/wishlist";
import {
  Bars3Icon,
  ChevronDownIcon,
  HeartIcon,
  HomeIcon,
  MagnifyingGlassIcon,
  ShoppingCartIcon,
  Squares2X2Icon,
  UserIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { LanguageSwitcher } from "../common/LanguageSwitcher";

export const Header: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
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
      router.push(
        `/products?search=${encodeURIComponent(debouncedSearchQuery.trim())}`
      );
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
      router.push("/");
    } catch (error) {
      logger.debug({ error }, "Logout failed");
    }
  };

  return (
    <>
      {/* Top Bar */}
      <div className="border-b border-slate-200/80 bg-slate-950 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex min-h-10 flex-wrap items-center justify-between gap-2 py-2 text-xs sm:text-sm">
            <div className="flex items-center gap-2 sm:gap-4">
              <LanguageSwitcher />
              <span className="hidden sm:inline text-white/55">|</span>
              <span className="hidden sm:inline text-white/80">
                Genuine Apple products, nationwide support
              </span>
            </div>
            <div className="flex items-center gap-3 text-white/85">
              <span className="hidden md:inline">{t("header.justMeDesc")}</span>
              <a
                href={`tel:${CONTACT_INFO.phoneLink}`}
                className="font-medium text-white transition-colors hover:text-sky-300"
              >
                {CONTACT_INFO.phone}
              </a>
            </div>
            <div className="flex items-center gap-3 sm:gap-4">
              {isAuthenticated ? (
                <div className="relative">
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center gap-1 rounded-full border border-white/15 px-2.5 py-1.5 transition-colors hover:bg-white/10"
                  >
                    <UserIcon className="h-4 w-4" />
                    <span className="hidden sm:inline max-w-40 truncate">
                      {user?.firstName || user?.email}
                    </span>
                    <ChevronDownIcon className="h-3 w-3" />
                  </button>

                  {showUserMenu && (
                    <div className="absolute right-0 mt-2 w-56 rounded-2xl border border-slate-200 bg-white p-2 shadow-xl z-50">
                      <Link
                        href="/profile"
                        className="block rounded-xl px-4 py-2 text-sm text-gray-700 hover:bg-slate-50"
                      >
                        {t("header.profile")}
                      </Link>
                      <Link
                        href="/orders"
                        className="block rounded-xl px-4 py-2 text-sm text-gray-700 hover:bg-slate-50"
                      >
                        {t("header.orders")}
                      </Link>
                      <button
                        onClick={handleLogout}
                        disabled={logoutMutation.isPending}
                        className="block w-full rounded-xl px-4 py-2 text-left text-sm text-gray-700 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {logoutMutation.isPending
                          ? t("common.loading")
                          : t("header.signOut")}
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <>
                  <Link
                    href="/auth?mode=register"
                    className="hidden sm:inline transition-colors hover:text-sky-300"
                  >
                    {t("header.createAccount")}
                  </Link>
                  <Link
                    href="/auth?mode=login"
                    className="rounded-full border border-white/15 px-2.5 py-1.5 transition-colors hover:bg-white/10"
                  >
                    {t("header.signIn")}
                  </Link>
                </>
              )}
            </div>
          </div>

        </div>
      </div>

      {/* Main Header */}
      <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/95 backdrop-blur">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex min-h-16 items-center gap-3 py-3">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 rounded-full pr-2">
              <div className="hidden h-10 w-10 items-center justify-center rounded-2xl bg-slate-900 text-white sm:flex">
                <ShoppingCartIcon className="h-5 w-5" />
              </div>
              <span className="text-sm font-bold uppercase tracking-[0.18em] text-slate-900 sm:text-base">
                {CONTACT_INFO.name}
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex">
              <DynamicNavigation />
            </div>

            {/* Search Bar */}
            <div className="hidden md:flex flex-1">
              <form onSubmit={handleSearch} className="w-full">
                <Input
                  type="search"
                  placeholder={t("header.searchPlaceholder")}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  leftIcon={<MagnifyingGlassIcon className="h-4 w-4" />}
                  className="w-full border-slate-200 bg-slate-50"
                />
              </form>
            </div>

            {/* Action Buttons */}
            <div className="ml-auto flex items-center gap-1 sm:gap-2">
              <Link
                href={isAuthenticated ? "/profile" : "/auth?mode=login"}
                className="hidden rounded-full border border-transparent p-2 text-slate-700 transition-colors hover:border-slate-200 hover:bg-slate-50 hover:text-slate-950 lg:block"
                aria-label={
                  isAuthenticated ? t("header.profile") : t("header.signIn")
                }
              >
                <UserIcon className="h-5 w-5" />
              </Link>

              {/* Wishlist */}
              <Link
                href="/wishlist"
                className="relative rounded-full border border-transparent p-2 text-slate-700 transition-colors hover:border-slate-200 hover:bg-slate-50 hover:text-slate-950"
                aria-label={t("header.wishlist")}
              >
                <HeartIcon className="h-5 w-5" />
                {wishlistItems.length > 0 && (
                  <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-rose-500 px-1 text-[11px] font-semibold text-white">
                    {wishlistItems.length}
                  </span>
                )}
              </Link>

              {/* Cart */}
              <button
                onClick={() => setShowCartSidebar(true)}
                className="relative rounded-full bg-slate-900 p-2 text-white transition-colors hover:bg-slate-800"
                aria-label={t("header.cart")}
              >
                <ShoppingCartIcon className="h-5 w-5" />
                {totalItems > 0 && (
                  <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-amber-400 px-1 text-[11px] font-semibold text-slate-950">
                    {totalItems}
                  </span>
                )}
              </button>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setShowMobileMenu(!showMobileMenu)}
                className="rounded-full border border-slate-200 p-2 text-slate-700 transition-colors hover:bg-slate-50 lg:hidden"
                aria-label={t("header.menu")}
              >
                {showMobileMenu ? (
                  <XMarkIcon className="h-5 w-5" />
                ) : (
                  <Bars3Icon className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {showMobileMenu && (
            <div className="border-t border-slate-200 py-4 lg:hidden">
              {/* Mobile Search Bar */}
              <div className="px-1 pb-4">
                <form onSubmit={handleSearch}>
                  <Input
                    type="search"
                    placeholder={t("header.searchPlaceholder")}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    leftIcon={<MagnifyingGlassIcon className="h-4 w-4" />}
                    className="border-slate-200 bg-slate-50"
                  />
                </form>
              </div>

              <div className="grid grid-cols-3 gap-2 pb-4">
                <Link
                  href="/"
                  onClick={() => setShowMobileMenu(false)}
                  className="flex flex-col items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-3 py-3 text-xs font-medium text-slate-700"
                >
                  <HomeIcon className="h-5 w-5" />
                  Home
                </Link>
                <Link
                  href="/products"
                  onClick={() => setShowMobileMenu(false)}
                  className="flex flex-col items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-3 py-3 text-xs font-medium text-slate-700"
                >
                  <Squares2X2Icon className="h-5 w-5" />
                  Shop
                </Link>
                <button
                  onClick={() => {
                    setShowMobileMenu(false);
                    setShowCartSidebar(true);
                  }}
                  className="flex flex-col items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-3 py-3 text-xs font-medium text-slate-700"
                >
                  <ShoppingCartIcon className="h-5 w-5" />
                  Cart
                </button>
              </div>

              <div className="rounded-3xl border border-slate-200 bg-slate-50 p-3">
                {isAuthenticated ? (
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2 rounded-2xl bg-white px-3 py-3">
                      <UserIcon className="h-5 w-5 text-gray-600" />
                      <span className="text-sm font-medium text-gray-900">
                        {user?.firstName || user?.email}
                      </span>
                    </div>
                    <Link
                      href="/profile"
                      className="block rounded-xl px-4 py-2 text-sm text-gray-700 hover:bg-white"
                      onClick={() => setShowMobileMenu(false)}
                    >
                      {t("header.profile")}
                    </Link>
                    <Link
                      href="/orders"
                      className="block rounded-xl px-4 py-2 text-sm text-gray-700 hover:bg-white"
                      onClick={() => setShowMobileMenu(false)}
                    >
                      {t("header.orders")}
                    </Link>
                    <button
                      onClick={() => {
                        handleLogout();
                        setShowMobileMenu(false);
                      }}
                      disabled={logoutMutation.isPending}
                      className="block w-full rounded-xl px-4 py-2 text-left text-sm text-gray-700 hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {logoutMutation.isPending
                        ? t("common.loading")
                        : t("header.signOut")}
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="mb-2 flex items-center space-x-2 px-2 py-2">
                      <UserIcon className="h-5 w-5 text-gray-600" />
                      <span className="text-sm font-medium text-gray-900">
                        {t("header.account")}
                      </span>
                    </div>
                    <Link
                      href="/auth?mode=register"
                      className="block rounded-xl px-4 py-2 text-sm text-gray-700 hover:bg-white"
                      onClick={() => setShowMobileMenu(false)}
                    >
                      {t("header.createAccount")}
                    </Link>
                    <Link
                      href="/auth?mode=login"
                      className="block rounded-xl px-4 py-2 text-sm text-gray-700 hover:bg-white"
                      onClick={() => setShowMobileMenu(false)}
                    >
                      {t("header.signIn")}
                    </Link>
                  </div>
                )}
              </div>

              {/* Mobile Navigation Links */}
              <div className="mt-4 border-t border-slate-200 pt-4">
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
