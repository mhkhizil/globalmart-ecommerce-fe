import Image from 'next/image';

interface InputProps {
  url: string;
}

function BrandPreviewCard(props: InputProps) {
  const { url } = props;
  return (
    <div className="flex w-full flex-col items-center justify-center ">
      <Image
        src={url}
        alt={'brand'}
        width={512}
        height={512}
        className="h-[80px] rounded-[8px]"
      />
      <span className="text-center text-[0.8rem] leading-4 font-poppins font-[500]">
        {'Brand'}
      </span>
    </div>
  );
}
export default BrandPreviewCard;
