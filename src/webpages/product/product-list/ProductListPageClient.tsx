import ProductList from '@/components/module/product/ProductList';

interface IPageProps {
  categoryId: string;
  shopId: string;
}

function ProductListPageClient(props: IPageProps) {
  return <ProductList {...props} />;
}
export default ProductListPageClient;
