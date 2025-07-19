export type Barter = {
  id: string;
  title: string;
  description: string;
  image: string;
  images?: string[];
  user: { name: string };
  category: string;
  condition?: string;
  location?: string;
};
