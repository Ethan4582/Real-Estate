// types/index.d.ts
export interface Property {
  id: string;
  title: string;
  location: string;
  price: number;
  bedrooms: number;
  bathrooms: number;
  area: number;
  images: string[];
  description: string;
  type: string;
  createdAt?: Date;
  owner?: {
    id: string;
    name: string;
    email: string;
  };
}