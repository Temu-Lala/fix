import { Review } from '@/types';

export const reviews: Review[] = [
  {
    id: '1',
    userId: 'user1',
    userName: 'Alex Thompson',
    userAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde',
    rating: 5,
    comment: "John was amazing! Fixed my fridge in no time and explained what was wrong. Very professional.",
    date: '2025-07-01'
  },
  {
    id: '2',
    userId: 'user2',
    userName: 'Jessica Miller',
    userAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330',
    rating: 4,
    comment: "Great service, arrived on time and fixed the issue quickly. Would recommend.",
    date: '2025-06-28'
  },
  {
    id: '3',
    userId: 'user3',
    userName: 'David Wilson',
    userAvatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36',
    rating: 5,
    comment: "Very knowledgeable and professional. Solved a problem I've had for months in just 30 minutes!",
    date: '2025-06-25'
  }
];