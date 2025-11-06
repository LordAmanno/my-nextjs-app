// Database Models and Types

export interface AdminUser {
  _id?: string;
  email: string;
  password: string; // Hashed password
  createdAt: Date;
  updatedAt: Date;
}

export interface WebsiteContent {
  _id?: string;
  layoutType: 'classic' | 'modern' | 'minimal' | 'elegant' | 'bold';
  businessName: string;
  tagline: string;
  description: string;
  
  // Hero Section
  hero: {
    title: string;
    subtitle: string;
    description: string;
    backgroundImage: string;
    ctaButtons: {
      primary: { text: string; link: string };
      secondary: { text: string; link: string };
    };
  };
  
  // About Section
  about: {
    title: string;
    subtitle: string;
    description: string;
    image: string;
    features: Array<{
      icon: string;
      title: string;
      description: string;
    }>;
  };
  
  // Menu Section
  menu: {
    title: string;
    subtitle: string;
    categories: Array<{
      id: string;
      name: string;
      description: string;
      items: Array<{
        name: string;
        description: string;
        price: string;
        image: string;
        popular?: boolean;
      }>;
    }>;
  };
  
  // Gallery Section
  gallery: {
    title: string;
    subtitle: string;
    images: Array<{
      url: string;
      caption: string;
    }>;
  };
  
  // Testimonials Section
  testimonials: {
    title: string;
    subtitle: string;
    reviews: Array<{
      name: string;
      role: string;
      rating: number;
      comment: string;
      image: string;
    }>;
  };
  
  // Contact Section
  contact: {
    phone: string;
    email: string;
    address: {
      street: string;
      city: string;
      state: string;
      zip: string;
      country: string;
    };
    hours: {
      [key: string]: string;
    };
    socialMedia: {
      facebook?: string;
      instagram?: string;
      twitter?: string;
      tiktok?: string;
    };
  };
  
  // Theme Settings
  theme: {
    primaryColor: string;
    secondaryColor: string;
    accentColor: string;
  };
  
  updatedAt: Date;
  createdAt: Date;
}

export interface AnalyticsData {
  _id?: string;
  date: Date;
  pageViews: number;
  uniqueVisitors: number;
  averageTimeOnSite: number;
  topPages: Array<{
    path: string;
    views: number;
  }>;
  deviceTypes: {
    desktop: number;
    mobile: number;
    tablet: number;
  };
  referrers: Array<{
    source: string;
    count: number;
  }>;
}

export interface PageVisit {
  _id?: string;
  sessionId: string;
  page: string;
  timestamp: Date;
  userAgent: string;
  referrer?: string;
  ipAddress?: string;
}

// Collection names
export const COLLECTIONS = {
  ADMIN_USERS: 'admin_users',
  WEBSITE_CONTENT: 'website_content',
  ANALYTICS: 'analytics',
  PAGE_VISITS: 'page_visits',
} as const;

