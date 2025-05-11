export type CategoryListResponseDto = {
  category: [
    {
      id: number;
      name: string;
      description: string;
      is_available: number;
      image: string | null;
      created_at: string;
      updated_at: string;
    },
  ];
};
