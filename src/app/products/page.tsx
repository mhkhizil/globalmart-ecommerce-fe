import React from 'react';

import ProductPreviewList from '@/components/gm-module/product/ProductPreviewList';

export default function ProductsPage() {
  return (
    <div className="container mx-auto px-4 py-8 font-montserrat">
      <h1 className="text-2xl font-bold mb-6">Featured Products</h1>

      <ProductPreviewList title="Popular Products" />

      <div className="mt-8">
        <ProductPreviewList title="Clothing" categoryId="1" />
      </div>

      <div className="mt-8">
        <ProductPreviewList title="Electronics" categoryId="2" />
      </div>
    </div>
  );
}
