import { SearchBar } from "@/components/molecules/SearchBar"
import { BottomNav } from "@/components/molecules/BottomNav"
import { CategoryTabs } from "@/components/organisms/CategoryTabs"
import { HomeHeader } from "@/components/organisms/HomeHeader"
import { NewArrivals } from "@/components/organisms/NewArrivals"
import { PromoBanner } from "@/components/organisms/PromoBanner"
import { getNewProducts } from "@/lib/api/server-catalog"
import React from "react"

export default async function HomePage() {
  const newProducts = await getNewProducts(4)

  return (
    <main className="min-h-screen pb-28 pt-4 sm:pt-6">
      <div className="mx-auto w-full max-w-7xl space-y-6 px-4 sm:space-y-8 sm:px-6 lg:px-8">
        <HomeHeader />
        <SearchBar />
        <PromoBanner />
        <CategoryTabs />
        <NewArrivals products={newProducts} />
      </div>
      <BottomNav />
    </main>
  )
}
