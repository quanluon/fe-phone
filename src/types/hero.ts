export interface HeroSlide {
  id: number;
  title: string;
  description: string;
  discount: string;
  discountText: string;
  buttonText: string;
  buttonLink: string;
  image: string;
  imageAlt: string;
  backgroundColor: string;
  textColor: string;
}

export interface SidePromotion {
  id: number;
  title: string;
  subtitle: string;
  currentPrice?: number;
  originalPrice?: number;
  savings?: string;
  promoCode?: string;
  image: string;
  imageAlt: string;
  link: string;
}

export interface HeroData {
  heroSlides: HeroSlide[];
  sidePromotions: SidePromotion[];
}
