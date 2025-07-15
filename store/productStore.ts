// store/productStore.ts
import { create } from 'zustand';

interface Product {
  id: string;
  name: string;
  image: string;
  price: number;
  rating: number;
  description: string;
  stock: number;
}

interface ProductStore {
  products: Product[];
  isLoading: boolean;
  fetchProducts: () => Promise<void>;
}

export const useProductStore = create<ProductStore>((set) => ({
  products: [],
  isLoading: false,
  fetchProducts: async () => {
    try {
      set({ isLoading: true });
      const res = await fetch('https://your-api-url/products');
      const data = await res.json();
      set({ products: data, isLoading: false });
    } catch (error) {
      console.error(error);
      set({ isLoading: false });
    }
  },
}));
