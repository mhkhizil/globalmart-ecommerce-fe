import { Store } from 'lucide-react';

const ShopIcon = ({ isSelected = false }: { isSelected?: boolean }) => {
  return (
    <Store
      className="size-6"
      fill={isSelected ? '#FE8C00' : '#C2C2C2'}
      stroke={isSelected ? 'gray' : 'gray'}
    />
  );
};

export default ShopIcon;
