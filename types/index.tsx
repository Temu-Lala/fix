export interface Category {
  id: string;
  name: string;
  icon: 'zap' | 'droplet' | 'refrigerator' | 'hammer' | 'flower' | 'car' | 'paintbrush' | 'sparkles';
  description?: string;
}

export interface Service {
  id: string;
  name: string;
  price: string;
  description?: string;
}

export interface Fixer {
  id: string;
  name: string;
  avatar: string;
  rating: number;
  reviewCount: number;
  categories: string[];
  location: string;
  distance: number;
  hourlyRate: number;
  isAvailable: boolean;
  description: string;
  skills: string[];
  completedJobs: number;
  verified?: boolean;
  priceRange?: string;
  services: Service[];
  availability?: string[];
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
}

export interface Booking {
  id: string;
  fixerId: string;
  fixerName: string;
  fixerAvatar: string;
  service: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  date: string;
  time: string;
  address: string;
  price: string;
}

export interface Review {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  rating: number;
  comment: string;
  date: string;
}