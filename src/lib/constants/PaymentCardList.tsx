import { PaymentMethods } from './PaymentMethod';

export const PaymentCardList = [
  {
    id: '1',
    accNo: '1234 2343 3423 343',
    cardType: 'KBZ',
    accName: 'saw win thant',
    isSelected: true,
    cardImageUrl: PaymentMethods.kbz.url,
  },
  {
    id: '2',
    accNo: '1234 2343 3423 343',
    cardType: 'AYA',
    accName: 'saw win thant',
    isSelected: false,
    cardImageUrl: PaymentMethods.aya.url,
  },
  {
    id: '3',
    accNo: '1234 2343 3423 343',
    cardType: 'CB',
    accName: 'saw win thant',
    isSelected: false,
    cardImageUrl: PaymentMethods.cb.url,
  },
  {
    id: '4',
    accNo: '1234 2343 3423 343',
    cardType: 'Wave Pay',
    accName: 'saw win thant',
    isSelected: false,
    cardImageUrl: PaymentMethods.wavePay.url,
  },
];
