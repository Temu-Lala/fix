import { Booking } from '@/types';

export const bookings: Booking[] = [
  {
    id: '1',
    fixerId: '1',
    fixerName: 'John Smith',
    fixerAvatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a',
    service: 'Fridge Repair',
    status: 'confirmed',
    date: '2025-07-10',
    time: '10:00 AM',
    address: '123 Main St, Anytown',
    price: '$45'
  },
  {
    id: '2',
    fixerId: '2',
    fixerName: 'Sarah Johnson',
    fixerAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2',
    service: 'Leak Repair',
    status: 'pending',
    date: '2025-07-12',
    time: '2:30 PM',
    address: '456 Oak Ave, Anytown',
    price: '$35'
  },
  {
    id: '3',
    fixerId: '3',
    fixerName: 'Michael Chen',
    fixerAvatar: 'https://images.unsplash.com/photo-1566492031773-4f4e44671857',
    service: 'Wiring Fix',
    status: 'completed',
    date: '2025-07-05',
    time: '11:00 AM',
    address: '789 Pine St, Anytown',
    price: '$40'
  }
];