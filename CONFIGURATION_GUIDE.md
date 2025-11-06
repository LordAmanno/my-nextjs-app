# Configuration Guide

This guide explains how to customize every aspect of your coffee shop website through the `config/site-config.ts` file.

## Table of Contents

1. [Basic Information](#basic-information)
2. [Contact Information](#contact-information)
3. [Social Media](#social-media)
4. [Business Hours](#business-hours)
5. [Hero Section](#hero-section)
6. [About Section](#about-section)
7. [Menu Configuration](#menu-configuration)
8. [Gallery](#gallery)
9. [Testimonials](#testimonials)
10. [Theme Customization](#theme-customization)
11. [Features/Services](#featuresservices)
12. [SEO Settings](#seo-settings)

---

## Basic Information

```typescript
businessName: "Aroma Coffee House"
tagline: "Where Every Cup Tells a Story"
description: "Experience the finest artisan coffee..."
```

**What to change:**
- `businessName`: Your coffee shop's name (appears in header, footer, page title)
- `tagline`: Short catchy phrase (appears in hero and footer)
- `description`: Brief description for SEO and hero section

---

## Contact Information

```typescript
contact: {
  phone: "+1 (555) 123-4567",
  email: "hello@aromacoffee.com",
  address: {
    street: "123 Main Street",
    city: "Downtown",
    state: "CA",
    zip: "90210",
    country: "USA"
  }
}
```

**What to change:**
- `phone`: Your business phone number (clickable on mobile)
- `email`: Contact email (clickable mailto link)
- `address`: Complete physical address (displayed in contact section)

---

## Social Media

```typescript
socialMedia: {
  facebook: "https://facebook.com/aromacoffee",
  instagram: "https://instagram.com/aromacoffee",
  twitter: "https://twitter.com/aromacoffee",
  tiktok: "https://tiktok.com/@aromacoffee"
}
```

**What to change:**
- Update each URL with your actual social media profiles
- Set to empty string `""` to hide a social media link
- Links appear in the contact/footer section

---

## Business Hours

```typescript
hours: {
  monday: { open: "7:00 AM", close: "8:00 PM", closed: false },
  tuesday: { open: "7:00 AM", close: "8:00 PM", closed: false },
  // ... etc
}
```

**What to change:**
- `open`: Opening time (any format you prefer)
- `close`: Closing time
- `closed`: Set to `true` to mark a day as closed
- Times are displayed as-is (no automatic formatting)

**Example - Closed on Sundays:**
```typescript
sunday: { open: "", close: "", closed: true }
```

---

## Hero Section

```typescript
hero: {
  title: "Welcome to Aroma Coffee House",
  subtitle: "Crafting Perfect Moments, One Cup at a Time",
  description: "Discover our handcrafted beverages...",
  backgroundImage: "/images/hero-background.jpg",
  ctaButton: {
    text: "Explore Our Menu",
    link: "#menu"
  },
  secondaryButton: {
    text: "Visit Us Today",
    link: "#contact"
  }
}
```

**What to change:**
- `title`: Main hero headline
- `subtitle`: Secondary headline
- `description`: Supporting text
- `backgroundImage`: Path to hero background image
- `ctaButton.text`: Primary button text
- `ctaButton.link`: Where primary button goes (use `#section-id` for same page)
- `secondaryButton`: Same as ctaButton

**Image Requirements:**
- Recommended size: 1920x1080px or larger
- Format: JPG or PNG
- Place in `/public/images/` folder

---

## About Section

```typescript
about: {
  title: "Our Story",
  subtitle: "Passion Brewed Daily",
  description: "Founded in 2020...",
  image: "/images/about-coffee-shop.jpg",
  features: [
    {
      icon: "☕",
      title: "Premium Beans",
      description: "Sourced from the finest coffee farms worldwide"
    },
    // ... more features
  ]
}
```

**What to change:**
- `title`: Section heading
- `subtitle`: Small text above title
- `description`: Your story/about text
- `image`: About section image
- `features`: Array of feature cards

**Adding/Removing Features:**
```typescript
// Add a new feature
{
  icon: "🌟",  // Any emoji or text
  title: "Feature Name",
  description: "Feature description"
}

// Remove a feature: Just delete the entire object
```

---

## Menu Configuration

The menu is organized into categories, each containing items.

### Menu Structure

```typescript
menu: {
  title: "Our Menu",
  subtitle: "Handcrafted Beverages & Fresh Treats",
  categories: [
    {
      id: "hot-coffee",              // Unique identifier
      name: "Hot Coffee",            // Display name
      description: "Classic coffee beverages served hot",
      image: "/images/menu-hot-coffee.jpg",
      items: [
        {
          name: "Espresso",
          description: "Rich and bold single shot",
          price: "$3.50",
          image: "/images/espresso.jpg",
          popular: true              // Shows "Popular" badge
        },
        // ... more items
      ]
    },
    // ... more categories
  ]
}
```

### Adding a New Category

```typescript
{
  id: "smoothies",
  name: "Smoothies",
  description: "Fresh fruit smoothies",
  image: "/images/menu-smoothies.jpg",
  items: [
    {
      name: "Berry Blast",
      description: "Mixed berries with yogurt",
      price: "$6.50",
      image: "/images/berry-smoothie.jpg",
      popular: false
    }
  ]
}
```

### Adding a New Menu Item

```typescript
{
  name: "Item Name",
  description: "Brief description",
  price: "$X.XX",              // Any format
  image: "/images/item.jpg",
  popular: true                // true or false
}
```

### Removing Items/Categories

Simply delete the entire object from the array.

---

## Gallery

```typescript
gallery: {
  title: "Our Space",
  subtitle: "A Place to Relax and Enjoy",
  images: [
    { 
      url: "/images/gallery-1.jpg", 
      alt: "Coffee shop interior", 
      caption: "Cozy seating area" 
    },
    // ... more images
  ]
}
```

**What to change:**
- `title`: Gallery section heading
- `subtitle`: Supporting text
- `images`: Array of image objects

**Adding Gallery Images:**
```typescript
{ 
  url: "/images/your-image.jpg",
  alt: "Description for accessibility",
  caption: "Text shown on hover"
}
```

**Image Requirements:**
- Recommended size: 800x800px (square)
- Format: JPG or PNG
- Optimized for web

---

## Testimonials

```typescript
testimonials: {
  title: "What Our Customers Say",
  subtitle: "Real Reviews from Real People",
  reviews: [
    {
      name: "Sarah Johnson",
      role: "Regular Customer",
      image: "/images/customer-1.jpg",
      rating: 5,                    // 1-5
      text: "Best coffee in town!...",
      date: "2024-01-15"
    },
    // ... more reviews
  ]
}
```

**Adding a Review:**
```typescript
{
  name: "Customer Name",
  role: "Their title/role",
  image: "/images/customer-photo.jpg",
  rating: 5,                        // Number from 1 to 5
  text: "The review text goes here...",
  date: "YYYY-MM-DD"               // For reference only
}
```

**Notes:**
- Rating displays as stars (1-5)
- If no image, shows first letter of name as avatar
- Date is not displayed (for internal reference)

---

## Theme Customization

```typescript
theme: {
  primaryColor: "amber",
  accentColor: "amber-600",
  textColor: "gray-900",
  backgroundColor: "white"
}
```

**Note:** This is for reference. To change colors, you need to update Tailwind classes in components.

**Common Tailwind Colors:**
- `amber`, `blue`, `green`, `red`, `purple`, `pink`, `indigo`
- Shades: `50`, `100`, `200`, ..., `900`

---

## Features/Services

```typescript
features: [
  {
    id: "wifi",
    name: "Free WiFi",
    icon: "📶",
    description: "High-speed internet for all customers"
  },
  // ... more features
]
```

**What to change:**
- Add/remove features as needed
- `icon`: Any emoji or text
- Currently not displayed (ready for future use)

---

## SEO Settings

```typescript
seo: {
  keywords: ["coffee shop", "cafe", "artisan coffee"],
  ogImage: "/images/og-image.jpg",
  twitterHandle: "@aromacoffee"
}
```

**What to change:**
- `keywords`: Array of SEO keywords
- `ogImage`: Image for social media sharing (1200x630px recommended)
- `twitterHandle`: Your Twitter/X handle

---

## Tips and Best Practices

### Images
1. **Optimize before uploading**: Use tools like TinyPNG or ImageOptim
2. **Consistent sizing**: Keep similar images the same size
3. **Naming convention**: Use descriptive names (e.g., `latte-coffee.jpg`)
4. **Fallbacks**: Template shows gradients if images don't load

### Text Content
1. **Keep it concise**: Short, impactful descriptions work best
2. **Consistent tone**: Maintain the same voice throughout
3. **Proofread**: Check for typos and grammar
4. **Mobile-friendly**: Test how text looks on small screens

### Prices
1. **Format consistently**: Use same format for all prices
2. **Include currency**: Make it clear ($, €, £, etc.)
3. **Update regularly**: Keep prices current

### Menu Organization
1. **Logical categories**: Group similar items together
2. **Popular items**: Mark bestsellers with `popular: true`
3. **Descriptions**: Be specific and appetizing
4. **Limit items**: 4-8 items per category works well

---

## Quick Reference: File Locations

- **Configuration**: `/config/site-config.ts`
- **Images**: `/public/images/`
- **Components**: `/components/`
- **Main Page**: `/app/page.tsx`
- **Layout**: `/app/layout.tsx`
- **Styles**: `/app/globals.css`

---

## Need Help?

1. Check the main README.md for general information
2. Review component files in `/components/` to see how data is used
3. Test changes in development mode: `npm run dev`
4. Check browser console for errors

---

**Last Updated**: 2025
**Template Version**: 1.0.0

