export type ConfirmOrderRequestDto = {
  id: string;
};

export type UpdateOrderStatusRequestDto = {
  status: number;
  remark?: string;
};
