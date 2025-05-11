import Image from 'next/image';

interface IPreviewProps {
  id: string;
  imageUrl: string;
  name: string;
  rating: number;
  price: number;
}

function ProductPreviewCard(props: IPreviewProps) {
  const { imageUrl, name, rating, price, id } = props;
  return (
    <div className="flex w-full flex-col items-center justify-center gap-y-[8px]">
      <Image
        src={imageUrl}
        alt={name}
        width={512}
        height={512}
        className="h-[80px] rounded-[8px]"
      />
      <span className="text-center text-[0.8rem] leading-4 font-poppins font-[500]">
        {name}
      </span>
    </div>
  );
}

export default ProductPreviewCard;
