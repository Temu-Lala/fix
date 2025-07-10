import { create } from 'zustand';
import { Booking } from '@/types';
import { bookings as mockBookings } from '@/mocks/bookings';

interface BookingState {
  bookings: Booking[];
  isLoading: boolean;
  error: string | null;
  fetchBookings: () => Promise<void>;
  createBooking: (booking: Omit<Booking, 'id'>) => Promise<void>;
  cancelBooking: (id: string) => Promise<void>;
}

export const useBookingStore = create<BookingState>((set, get) => ({
  bookings: [],
  isLoading: false,
  error: null,
  
  fetchBookings: async () => {
    set({ isLoading: true, error: null });
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Use mock data
      set({ bookings: mockBookings, isLoading: false });
    } catch (error) {
      set({ error: "Failed to fetch bookings", isLoading: false });
    }
  },
  
  createBooking: async (booking) => {
    set({ isLoading: true, error: null });
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Create new booking with generated ID
      const newBooking: Booking = {
        ...booking,
        id: Date.now().toString(),
      };
      
      set(state => ({
        bookings: [...state.bookings, newBooking],
        isLoading: false,
      }));
    } catch (error) {
      set({ error: "Failed to create booking", isLoading: false });
    }
  },
  
  cancelBooking: async (id) => {
    set({ isLoading: true, error: null });
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update booking status to cancelled
      set(state => ({
        bookings: state.bookings.map(booking => 
          booking.id === id 
            ? { ...booking, status: 'cancelled' } 
            : booking
        ),
        isLoading: false,
      }));
    } catch (error) {
      set({ error: "Failed to cancel booking", isLoading: false });
    }
  },
}));