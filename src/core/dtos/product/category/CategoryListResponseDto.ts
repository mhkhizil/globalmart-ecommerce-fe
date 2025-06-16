export type CategoryListResponseDto = {
  category: Category[];
};

export type Category = {
  id: number;
  name: string;
  description: string;
  is_available: number;
  image: string | null;
  created_at: string;
  updated_at: string;
  subcategories: SubCategory[];
};

export type SubCategory = {
  id: number;
  name: string;
  category_id: number;
  is_available: number;
  image: string | null;
  sorting_order: number;
  created_at: string;
  updated_at: string;
};
