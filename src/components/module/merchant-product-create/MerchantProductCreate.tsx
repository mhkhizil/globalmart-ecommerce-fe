import ProductCreateForm from './ProductCreateForm';

function MerchantProductCreate() {
  return (
    <div className="flex w-full h-[100dvh] overflow-y-auto pb-[2rem] flex-col px-[24px]">
      <span className="text-[32px] font-semibold leading-[40px]  mt-[32px]">
        Create your product.
      </span>

      <div className="flex w-full items-center justify-center mb-[24px] mt-[32px]">
        <ProductCreateForm />
      </div>
    </div>
  );
}
export default MerchantProductCreate;
