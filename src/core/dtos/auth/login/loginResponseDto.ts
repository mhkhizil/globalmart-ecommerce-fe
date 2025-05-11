export type LoginResponseDto = {
  response: string | number;
  description: string;
  data: {
    user: {
      address: string;
      city_id: string;
      country_id: string;
      created_at: string;
      email: string;
      email_verified_at: string;
      fcm_id: string;
      id: number;
      image: string;
      latlong: string;
      name: 'string';
      phone: string;
      phone_code: string;
      postal_code: string;
      roles: number;
      state_id: string;
      updated_at: string;
    };

    token: string;
  };
};
