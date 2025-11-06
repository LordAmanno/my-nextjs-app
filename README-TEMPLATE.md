# Coffee Shop Website Template

A fully customizable, modern coffee shop presentation website built with Next.js 16, TypeScript, and Tailwind CSS. Every element is configurable through a single configuration file, making it perfect for future dashboard integration.

## Features

- **100% Configurable**: All content managed through `config/site-config.ts`
- **Responsive Design**: Mobile-first approach, works on all devices
- **Modern Stack**: Next.js 16 with App Router, TypeScript, Tailwind CSS
- **Modular Components**: Clean, reusable component architecture
- **SEO Optimized**: Proper metadata and semantic HTML
- **Performance**: Optimized for speed with Next.js features
- **Smooth Animations**: Hover effects and transitions throughout

## Template Sections

1. **Hero Section** - Full-screen hero with customizable background, title, subtitle, and CTA buttons
2. **About Section** - Story, features grid with icons
3. **Menu Section** - Tabbed menu with categories, items, prices, and images
4. **Gallery Section** - Image grid with hover effects
5. **Testimonials** - Customer reviews with ratings
6. **Contact & Footer** - Contact info, business hours, map placeholder, social media, newsletter

## Configuration

All website content is managed in `/config/site-config.ts`. This file contains:

### Basic Information
- Business name
- Tagline
- Description

### Contact Information
- Phone number
- Email address
- Physical address
- Social media links (Facebook, Instagram, Twitter, TikTok)

### Business Hours
- Configurable hours for each day of the week
- Option to mark days as closed

### Hero Section
- Title, subtitle, description
- Background image URL
- CTA button text and links

### About Section
- Title, subtitle, description
- Feature cards with icons
- About image

### Menu
- Multiple categories (Hot Coffee, Cold Coffee, Specialty, Tea, Food)
- Each item includes:
  - Name
  - Description
  - Price
  - Image URL
  - Popular flag

### Gallery
- Image URLs
- Captions
- Alt text

### Testimonials
- Customer name
- Role/title
- Review text
- Rating (1-5 stars)
- Customer photo
- Date

## How to Customize

### Step 1: Edit Configuration
Open `config/site-config.ts` and modify any values:

```typescript
export const siteConfig = {
  businessName: "Your Coffee Shop Name",
  tagline: "Your Tagline Here",
  // ... modify any values
};
```

### Step 2: Add Images
Replace placeholder image URLs with your actual images:
- Upload images to `/public/images/` folder
- Update URLs in `site-config.ts` to point to your images
- Example: `/images/hero-background.jpg`

### Step 3: Customize Colors
The template uses Tailwind CSS with an amber color scheme. To change colors:
- Edit `tailwind.config.ts` to add custom colors
- Update component classes to use your colors

## Project Structure

```
website-biserica/
├── app/
│   ├── layout.tsx          # Root layout with metadata
│   ├── page.tsx            # Main page (imports all sections)
│   └── globals.css         # Global styles
├── components/
│   ├── Header.tsx          # Navigation header
│   ├── Hero.tsx            # Hero section
│   ├── About.tsx           # About section
│   ├── Menu.tsx            # Menu section with tabs
│   ├── Gallery.tsx         # Image gallery
│   ├── Testimonials.tsx    # Customer reviews
│   └── Contact.tsx         # Contact info & footer
├── config/
│   └── site-config.ts      # ALL CONTENT CONFIGURATION
└── public/
    └── images/             # Place your images here
```

## Component Details

### Header Component
- Fixed navigation bar
- Mobile responsive with hamburger menu
- Smooth scroll to sections
- Configurable navigation links

### Hero Component
- Full-screen background image
- Gradient overlay
- Two CTA buttons
- Scroll indicator
- All text configurable

### About Component
- Two-column layout (image + content)
- Features grid with icons
- Responsive design

### Menu Component
- Tabbed interface for categories
- Grid layout for menu items
- "Popular" badges
- Price display
- Item images with fallback gradients

### Gallery Component
- Responsive grid layout
- Hover overlay effects
- Image captions
- Fallback gradients for missing images

### Testimonials Component
- Star rating display
- Customer photos with fallback avatars
- Responsive card layout

### Contact Component
- Contact information cards
- Business hours table
- Map placeholder
- Social media links
- Newsletter signup form
- Footer with quick links

## Future Dashboard Integration

This template is designed for easy dashboard integration:

1. **Configuration File**: The `site-config.ts` file structure mirrors what a database schema would look like
2. **Type Safety**: TypeScript ensures all required fields are present
3. **Modular Design**: Each component independently reads from config
4. **Image Management**: All images referenced by URL, ready for cloud storage integration

### Suggested Dashboard Features
- Visual editor for each section
- Image upload and management
- Menu item CRUD operations
- Business hours scheduler
- Testimonial management
- Real-time preview
- Multiple template layouts

## Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## Customization Tips

### Adding New Menu Categories
Edit `config/site-config.ts`:
```typescript
menu: {
  categories: [
    // ... existing categories
    {
      id: "new-category",
      name: "New Category",
      description: "Description here",
      image: "/images/new-category.jpg",
      items: [
        {
          name: "Item Name",
          description: "Item description",
          price: "$5.00",
          image: "/images/item.jpg",
          popular: false
        }
      ]
    }
  ]
}
```

### Changing Color Scheme
The template uses Tailwind's amber colors. To change:
1. Find and replace color classes in components
2. Example: `bg-amber-600` → `bg-blue-600`
3. Update hover states and gradients accordingly

### Adding New Sections
1. Create new component in `/components/`
2. Import and add to `app/page.tsx`
3. Add configuration to `config/site-config.ts`

## Technologies Used

- **Next.js 16** - React framework with App Router
- **TypeScript** - Type safety and better DX
- **Tailwind CSS** - Utility-first CSS framework
- **React** - UI library
- **Turbopack** - Fast bundler for development

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers

## License

This is a template project. Customize and use as needed for your projects.

## Notes

- All images currently use placeholder gradients with emoji icons
- Replace with actual images for production use
- Newsletter form is UI-only (needs backend integration)
- Map section is a placeholder (integrate Google Maps or similar)
- Social media icons are simplified (can be replaced with icon library)

## Next Steps

1. Replace all placeholder images with actual photos
2. Test on various devices and browsers
3. Add actual map integration
4. Connect newsletter form to email service
5. Add analytics tracking
6. Optimize images for web
7. Set up CI/CD pipeline
8. Deploy to production

---

**Template Version**: 1.0.0  
**Created**: 2025  
**Framework**: Next.js 16.0.1

