import { UserEntity } from '@/core/entity/User';

export type RegisterResponseDto = {
  status: string;
  message: string;
  user: {
    user: UserEntity;
  };
};
