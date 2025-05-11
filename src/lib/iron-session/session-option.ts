import { SessionOptions } from 'iron-session';

export const sessionOptions: SessionOptions = {
  password: process.env.SESSION_COOKIE_PASSWORD as string,
  cookieName: process.env.SESSION_COOKIE_NAME as string,
  cookieOptions: {
    secure: false,
    httpOnly: false,
  },
};

export interface SessionData {
  token: string;
  // user: {
  //   name: string;
  //   userId: string;
  //   email: string;
  //   role: string;
  // };
  user: {
    user: {
      merchant_id: number;
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
      name: string;
      phone: string;
      phone_code: string;
      postal_code: string;
      roles: number;
      state_id: string;
      updated_at: string;
      driver_id: number;
    };
  };
}
