# Enhanced Open Graph SEO Implementation

## Overview
This document outlines the comprehensive Open Graph and social media SEO implementation for the NC Mobile website, optimized for Vietnamese social platforms and international sharing.

## ✅ Enhanced Open Graph Tags

### **Product Pages** (`fe/src/app/products/[slug]/page.tsx`)

#### **Standard Open Graph Tags:**
```html
<meta property="og:title" content="iPhone 15 Pro Max | NC Mobile" />
<meta property="og:description" content="iPhone 15 Pro Max với chip A17 Pro mạnh mẽ..." />
<meta property="og:image" content="https://your-site.com/product-image.jpg" />
<meta property="og:image:width" content="1200" />
<meta property="og:image:height" content="630" />
<meta property="og:image:type" content="image/jpeg" />
<meta property="og:image:alt" content="iPhone 15 Pro Max" />
<meta property="og:url" content="https://your-site.com/products/product-slug" />
<meta property="og:type" content="website" />
<meta property="og:site_name" content="NC Mobile" />
<meta property="og:locale" content="vi_VN" />
<meta property="og:country-name" content="Vietnam" />
```

#### **Multiple Product Images:**
- ✅ **Primary image**: Main product photo (1200x630)
- ✅ **Additional images**: Up to 4 product images for carousel
- ✅ **Proper alt text**: Vietnamese descriptions for accessibility

#### **Product-Specific Tags:**
```html
<meta property="product:brand" content="Apple" />
<meta property="product:category" content="iPhone" />
<meta property="product:price:amount" content="25000000" />
<meta property="product:price:currency" content="VND" />
<meta property="product:availability" content="in stock" />
<meta property="product:condition" content="new" />
<meta property="product:retailer" content="NC Mobile" />
```

### **Root Layout** (`fe/src/app/layout.tsx`)

#### **Site-Wide Open Graph:**
```html
<meta property="og:title" content="NC Mobile - Apple Products & Accessories" />
<meta property="og:description" content="Điểm đến tin cậy cho các sản phẩm Apple và phụ kiện mới nhất..." />
<meta property="og:image" content="https://your-site.com/og-image.jpg" />
<meta property="og:url" content="https://your-site.com" />
<meta property="og:type" content="website" />
<meta property="og:site_name" content="NC Mobile" />
<meta property="og:locale" content="vi_VN" />
<meta property="og:country-name" content="Vietnam" />
```

## 📱 Vietnamese Social Platform Support

### **Zalo Integration:**
```html
<meta name="zalo:title" content="iPhone 15 Pro Max | NC Mobile" />
<meta name="zalo:description" content="iPhone 15 Pro Max với chip A17 Pro..." />
<meta name="zalo:image" content="https://your-site.com/product-image.jpg" />
```

### **Facebook Messenger:**
```html
<meta property="fb:app_id" content="your_facebook_app_id" />
```

### **WhatsApp Sharing:**
```html
<meta name="whatsapp:title" content="iPhone 15 Pro Max | NC Mobile" />
<meta name="whatsapp:description" content="iPhone 15 Pro Max với chip A17 Pro..." />
<meta name="whatsapp:image" content="https://your-site.com/product-image.jpg" />
```

### **Viber Sharing:**
```html
<meta name="viber:title" content="iPhone 15 Pro Max | NC Mobile" />
<meta name="viber:description" content="iPhone 15 Pro Max với chip A17 Pro..." />
<meta name="viber:image" content="https://your-site.com/product-image.jpg" />
```

### **Telegram Sharing:**
```html
<meta name="telegram:title" content="iPhone 15 Pro Max | NC Mobile" />
<meta name="telegram:description" content="iPhone 15 Pro Max với chip A17 Pro..." />
<meta name="telegram:image" content="https://your-site.com/product-image.jpg" />
```

## 🐦 Enhanced Twitter Cards

### **Product Pages:**
```html
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="iPhone 15 Pro Max | NC Mobile" />
<meta name="twitter:description" content="iPhone 15 Pro Max với chip A17 Pro..." />
<meta name="twitter:image" content="https://your-site.com/product-image.jpg" />
<meta name="twitter:image:alt" content="iPhone 15 Pro Max" />
<meta name="twitter:creator" content="@ncmobile" />
<meta name="twitter:site" content="@ncmobile" />
```

### **Site-Wide:**
```html
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="NC Mobile - Apple Products & Accessories" />
<meta name="twitter:description" content="Điểm đến tin cậy cho các sản phẩm Apple..." />
<meta name="twitter:image" content="https://your-site.com/og-image.jpg" />
<meta name="twitter:creator" content="@ncmobile" />
<meta name="twitter:site" content="@ncmobile" />
```

## 🌏 Vietnamese SEO Optimization

### **Geographic Targeting:**
```html
<meta name="geo.region" content="VN" />
<meta name="geo.placename" content="Vietnam" />
<meta name="geo.position" content="16.0583;108.2772" />
<meta name="ICBM" content="16.0583, 108.2772" />
```

### **Business Information:**
```html
<meta name="business:contact_data:phone_number" content="(+84) 0963761702" />
<meta name="business:contact_data:email" content="anhcong160496@gmail.com" />
<meta name="business:contact_data:website" content="https://your-site.com" />
```

### **Mobile App Integration:**
```html
<meta name="al:ios:app_name" content="NC Mobile" />
<meta name="al:ios:app_store_id" content="ncmobile://product/product-slug" />
<meta name="al:android:app_name" content="NC Mobile" />
<meta name="al:android:package" content="com.ncmobile.app" />
<meta name="al:android:url" content="ncmobile://product/product-slug" />
```

## 📱 PWA and Mobile Optimization

### **Mobile Web App:**
```html
<meta name="mobile-web-app-capable" content="yes" />
<meta name="apple-mobile-web-app-capable" content="yes" />
<meta name="apple-mobile-web-app-status-bar-style" content="default" />
<meta name="apple-mobile-web-app-title" content="NC Mobile" />
```

### **Theme Colors:**
```html
<meta name="theme-color" content="#1f2937" />
<meta name="msapplication-TileColor" content="#1f2937" />
<meta name="msapplication-TileImage" content="/og-image.jpg" />
```

## 🎯 Article and Content Tags

### **Article Metadata:**
```html
<meta name="article:author" content="NC Mobile" />
<meta name="article:section" content="Technology" />
<meta name="article:tag" content="Apple, iPhone" />
<meta name="article:published_time" content="2024-01-01T00:00:00.000Z" />
<meta name="article:modified_time" content="2024-01-01T00:00:00.000Z" />
```

## 🔧 Environment Variables Required

### **Required Variables:**
```env
NEXT_PUBLIC_APP_URL=https://nc-mobile-dev.vercel.app
NEXT_PUBLIC_API_URL=https://your-api-domain.com
```

### **Optional Variables:**
```env
NEXT_PUBLIC_FACEBOOK_APP_ID=your_facebook_app_id
NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION=your_google_verification_code
```

## 🧪 Testing Social Sharing

### **1. Facebook Sharing Debugger:**
- URL: https://developers.facebook.com/tools/debug/
- Test your product URLs to see how they appear on Facebook

### **2. Twitter Card Validator:**
- URL: https://cards-dev.twitter.com/validator
- Validate Twitter card appearance

### **3. LinkedIn Post Inspector:**
- URL: https://www.linkedin.com/post-inspector/
- Check how links appear on LinkedIn

### **4. WhatsApp Link Preview:**
- Send your product URL in WhatsApp to see the preview

### **5. Zalo Sharing:**
- Share your product URL in Zalo to see the preview

## 📊 SEO Benefits

### **Rich Snippets:**
- ✅ Product information in search results
- ✅ Price and availability display
- ✅ Brand and category information
- ✅ High-quality product images

### **Social Media Optimization:**
- ✅ Beautiful previews on all platforms
- ✅ Vietnamese language support
- ✅ Mobile-optimized sharing
- ✅ Consistent branding across platforms

### **Local SEO:**
- ✅ Vietnam-specific geographic targeting
- ✅ Vietnamese language optimization
- ✅ Local business information
- ✅ VND currency support

## 🚀 Implementation Features

### **Dynamic Content:**
- ✅ Product-specific metadata
- ✅ Dynamic images from API
- ✅ Real-time price updates
- ✅ Availability status

### **Error Handling:**
- ✅ Fallback metadata when API fails
- ✅ Default images for missing products
- ✅ Graceful degradation
- ✅ Proper error logging

### **Performance:**
- ✅ Server-side rendering
- ✅ ISR caching (1 hour)
- ✅ Optimized image sizes
- ✅ Fast metadata generation

## 📝 Best Practices

### **Image Optimization:**
- ✅ Use 1200x630 images for Open Graph
- ✅ JPEG format for better compression
- ✅ Descriptive alt text in Vietnamese
- ✅ Multiple images for product carousel

### **Content Guidelines:**
- ✅ Keep titles under 60 characters
- ✅ Descriptions under 160 characters
- ✅ Use Vietnamese language for local audience
- ✅ Include relevant keywords

### **Testing:**
- ✅ Test on all major platforms
- ✅ Verify mobile sharing
- ✅ Check Vietnamese text display
- ✅ Validate structured data

## 🔄 Maintenance

### **Regular Updates:**
- ✅ Update product images regularly
- ✅ Refresh metadata for new products
- ✅ Monitor social sharing analytics
- ✅ Update business information

### **Monitoring:**
- ✅ Track social media engagement
- ✅ Monitor click-through rates
- ✅ Check for broken images
- ✅ Validate meta tags regularly

## 🆘 Troubleshooting

### **Common Issues:**

**1. Images not showing:**
- Check image URLs are absolute
- Verify image accessibility
- Ensure proper image dimensions

**2. Vietnamese text not displaying:**
- Verify UTF-8 encoding
- Check locale settings
- Test on different platforms

**3. Sharing not working:**
- Verify environment variables
- Check Facebook App ID
- Test on different devices

**4. Mobile sharing issues:**
- Test native sharing API
- Check mobile-specific tags
- Verify PWA configuration

## 📞 Support

For issues with Open Graph implementation:
1. Check browser developer tools
2. Use social media debuggers
3. Verify environment variables
4. Test on different platforms
5. Check Next.js documentation

## 🎯 Success Metrics

After implementation, monitor:
- ✅ Social media click-through rates
- ✅ Product page sharing frequency
- ✅ Search engine rich snippets
- ✅ Mobile sharing engagement
- ✅ Vietnamese platform adoption
