// All website content is configurable through this file
// In the future, this will be managed through a dashboard

export const siteConfig = {
  // Basic Information
  businessName: "Aroma Coffee House",
  tagline: "Where Every Cup Tells a Story",
  description: "Experience the finest artisan coffee in a warm, welcoming atmosphere. Our passion is crafting the perfect cup for you.",
  
  // Contact Information
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
  },
  
  // Social Media Links
  socialMedia: {
    facebook: "https://facebook.com/aromacoffee",
    instagram: "https://instagram.com/aromacoffee",
    twitter: "https://twitter.com/aromacoffee",
    tiktok: "https://tiktok.com/@aromacoffee"
  },
  
  // Business Hours
  hours: {
    monday: { open: "7:00 AM", close: "8:00 PM", closed: false },
    tuesday: { open: "7:00 AM", close: "8:00 PM", closed: false },
    wednesday: { open: "7:00 AM", close: "8:00 PM", closed: false },
    thursday: { open: "7:00 AM", close: "8:00 PM", closed: false },
    friday: { open: "7:00 AM", close: "10:00 PM", closed: false },
    saturday: { open: "8:00 AM", close: "10:00 PM", closed: false },
    sunday: { open: "8:00 AM", close: "6:00 PM", closed: false }
  },
  
  // Hero Section
  hero: {
    title: "Welcome to Aroma Coffee House",
    subtitle: "Crafting Perfect Moments, One Cup at a Time",
    description: "Discover our handcrafted beverages made with premium beans sourced from around the world",
    backgroundImage: "/images/hero-background.jpg",
    ctaButton: {
      text: "Explore Our Menu",
      link: "#menu"
    },
    secondaryButton: {
      text: "Visit Us Today",
      link: "#contact"
    }
  },
  
  // About Section
  about: {
    title: "Our Story",
    subtitle: "Passion Brewed Daily",
    description: "Founded in 2020, Aroma Coffee House has been serving the community with exceptional coffee and warm hospitality. We believe in sustainable sourcing, expert roasting, and creating a space where everyone feels at home.",
    image: "/images/about-coffee-shop.jpg",
    features: [
      {
        icon: "☕",
        title: "Premium Beans",
        description: "Sourced from the finest coffee farms worldwide"
      },
      {
        icon: "🌱",
        title: "Sustainable",
        description: "Committed to ethical and eco-friendly practices"
      },
      {
        icon: "👨‍🍳",
        title: "Expert Baristas",
        description: "Trained professionals crafting your perfect cup"
      },
      {
        icon: "🏠",
        title: "Cozy Atmosphere",
        description: "A welcoming space for work, study, or relaxation"
      }
    ]
  },
  
  // Menu Categories
  menu: {
    title: "Our Menu",
    subtitle: "Handcrafted Beverages & Fresh Treats",
    categories: [
      {
        id: "hot-coffee",
        name: "Hot Coffee",
        description: "Classic coffee beverages served hot",
        image: "/images/menu-hot-coffee.jpg",
        items: [
          {
            name: "Espresso",
            description: "Rich and bold single shot",
            price: "$3.50",
            image: "/images/espresso.jpg",
            popular: true
          },
          {
            name: "Americano",
            description: "Espresso with hot water",
            price: "$4.00",
            image: "/images/americano.jpg",
            popular: false
          },
          {
            name: "Cappuccino",
            description: "Espresso with steamed milk and foam",
            price: "$4.50",
            image: "/images/cappuccino.jpg",
            popular: true
          },
          {
            name: "Latte",
            description: "Espresso with steamed milk",
            price: "$4.75",
            image: "/images/latte.jpg",
            popular: true
          },
          {
            name: "Mocha",
            description: "Espresso with chocolate and steamed milk",
            price: "$5.25",
            image: "/images/mocha.jpg",
            popular: false
          },
          {
            name: "Flat White",
            description: "Espresso with microfoam milk",
            price: "$4.50",
            image: "/images/flat-white.jpg",
            popular: false
          }
        ]
      },
      {
        id: "cold-coffee",
        name: "Cold Coffee",
        description: "Refreshing iced coffee drinks",
        image: "/images/menu-cold-coffee.jpg",
        items: [
          {
            name: "Iced Coffee",
            description: "Cold brew over ice",
            price: "$4.25",
            image: "/images/iced-coffee.jpg",
            popular: true
          },
          {
            name: "Iced Latte",
            description: "Espresso with cold milk over ice",
            price: "$5.00",
            image: "/images/iced-latte.jpg",
            popular: true
          },
          {
            name: "Cold Brew",
            description: "Smooth, slow-steeped coffee",
            price: "$4.50",
            image: "/images/cold-brew.jpg",
            popular: true
          },
          {
            name: "Frappuccino",
            description: "Blended ice coffee drink",
            price: "$5.75",
            image: "/images/frappuccino.jpg",
            popular: false
          }
        ]
      },
      {
        id: "specialty",
        name: "Specialty Drinks",
        description: "Unique signature creations",
        image: "/images/menu-specialty.jpg",
        items: [
          {
            name: "Caramel Macchiato",
            description: "Vanilla, espresso, milk, and caramel drizzle",
            price: "$5.50",
            image: "/images/caramel-macchiato.jpg",
            popular: true
          },
          {
            name: "Vanilla Latte",
            description: "Espresso with vanilla and steamed milk",
            price: "$5.25",
            image: "/images/vanilla-latte.jpg",
            popular: false
          },
          {
            name: "Hazelnut Mocha",
            description: "Chocolate, hazelnut, and espresso",
            price: "$5.75",
            image: "/images/hazelnut-mocha.jpg",
            popular: false
          },
          {
            name: "Pumpkin Spice Latte",
            description: "Seasonal favorite with pumpkin and spices",
            price: "$5.50",
            image: "/images/pumpkin-latte.jpg",
            popular: true
          }
        ]
      },
      {
        id: "tea",
        name: "Tea & More",
        description: "Premium teas and alternative beverages",
        image: "/images/menu-tea.jpg",
        items: [
          {
            name: "Green Tea",
            description: "Organic Japanese green tea",
            price: "$3.50",
            image: "/images/green-tea.jpg",
            popular: false
          },
          {
            name: "Chai Latte",
            description: "Spiced tea with steamed milk",
            price: "$4.75",
            image: "/images/chai-latte.jpg",
            popular: true
          },
          {
            name: "Matcha Latte",
            description: "Premium matcha with steamed milk",
            price: "$5.25",
            image: "/images/matcha-latte.jpg",
            popular: true
          },
          {
            name: "Hot Chocolate",
            description: "Rich chocolate with steamed milk",
            price: "$4.25",
            image: "/images/hot-chocolate.jpg",
            popular: false
          }
        ]
      },
      {
        id: "food",
        name: "Food & Pastries",
        description: "Fresh baked goods and light bites",
        image: "/images/menu-food.jpg",
        items: [
          {
            name: "Croissant",
            description: "Buttery, flaky French pastry",
            price: "$3.75",
            image: "/images/croissant.jpg",
            popular: true
          },
          {
            name: "Blueberry Muffin",
            description: "Fresh baked with real blueberries",
            price: "$3.50",
            image: "/images/muffin.jpg",
            popular: false
          },
          {
            name: "Avocado Toast",
            description: "Smashed avocado on artisan bread",
            price: "$7.50",
            image: "/images/avocado-toast.jpg",
            popular: true
          },
          {
            name: "Breakfast Sandwich",
            description: "Egg, cheese, and choice of meat",
            price: "$6.75",
            image: "/images/breakfast-sandwich.jpg",
            popular: true
          },
          {
            name: "Chocolate Chip Cookie",
            description: "Homemade with premium chocolate",
            price: "$2.75",
            image: "/images/cookie.jpg",
            popular: false
          }
        ]
      }
    ]
  },
  
  // Gallery Section
  gallery: {
    title: "Our Space",
    subtitle: "A Place to Relax and Enjoy",
    images: [
      { url: "/images/gallery-1.jpg", alt: "Coffee shop interior", caption: "Cozy seating area" },
      { url: "/images/gallery-2.jpg", alt: "Barista making coffee", caption: "Expert craftsmanship" },
      { url: "/images/gallery-3.jpg", alt: "Coffee and pastry", caption: "Perfect pairings" },
      { url: "/images/gallery-4.jpg", alt: "Outdoor seating", caption: "Al fresco dining" },
      { url: "/images/gallery-5.jpg", alt: "Coffee beans", caption: "Premium beans" },
      { url: "/images/gallery-6.jpg", alt: "Latte art", caption: "Beautiful presentations" }
    ]
  },
  
  // Testimonials
  testimonials: {
    title: "What Our Customers Say",
    subtitle: "Real Reviews from Real People",
    reviews: [
      {
        name: "Sarah Johnson",
        role: "Regular Customer",
        image: "/images/customer-1.jpg",
        rating: 5,
        text: "Best coffee in town! The atmosphere is perfect for getting work done, and the staff is always friendly.",
        date: "2024-01-15"
      },
      {
        name: "Michael Chen",
        role: "Coffee Enthusiast",
        image: "/images/customer-2.jpg",
        rating: 5,
        text: "Their cold brew is absolutely amazing. I come here every morning before work!",
        date: "2024-01-10"
      },
      {
        name: "Emily Rodriguez",
        role: "Local Resident",
        image: "/images/customer-3.jpg",
        rating: 5,
        text: "Love this place! Great coffee, delicious pastries, and such a welcoming environment.",
        date: "2024-01-05"
      },
      {
        name: "David Thompson",
        role: "Business Owner",
        image: "/images/customer-4.jpg",
        rating: 5,
        text: "Perfect spot for client meetings. Professional atmosphere with excellent service.",
        date: "2024-01-03"
      },
      {
        name: "Lisa Martinez",
        role: "Student",
        image: "/images/customer-5.jpg",
        rating: 5,
        text: "My favorite study spot! Great WiFi, comfortable seating, and the best lattes.",
        date: "2023-12-28"
      },
      {
        name: "James Wilson",
        role: "Coffee Lover",
        image: "/images/customer-6.jpg",
        rating: 5,
        text: "The baristas really know their craft. Every drink is made with care and precision.",
        date: "2023-12-20"
      }
    ]
  },

  // Additional Customization Options
  theme: {
    primaryColor: "amber",
    accentColor: "amber-600",
    textColor: "gray-900",
    backgroundColor: "white"
  },

  // Features/Services (can be displayed in various sections)
  features: [
    {
      id: "wifi",
      name: "Free WiFi",
      icon: "📶",
      description: "High-speed internet for all customers"
    },
    {
      id: "parking",
      name: "Free Parking",
      icon: "🅿️",
      description: "Ample parking space available"
    },
    {
      id: "outdoor",
      name: "Outdoor Seating",
      icon: "🌳",
      description: "Enjoy your coffee in our garden patio"
    },
    {
      id: "takeout",
      name: "Takeout Available",
      icon: "🥤",
      description: "Quick grab-and-go service"
    },
    {
      id: "events",
      name: "Private Events",
      icon: "🎉",
      description: "Host your events in our space"
    },
    {
      id: "delivery",
      name: "Delivery Service",
      icon: "🚗",
      description: "Order online for delivery"
    }
  ],

  // SEO and Meta Information
  seo: {
    keywords: ["coffee shop", "cafe", "artisan coffee", "espresso", "latte", "local coffee"],
    ogImage: "/images/og-image.jpg",
    twitterHandle: "@aromacoffee"
  }
};

