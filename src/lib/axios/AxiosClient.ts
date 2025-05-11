import axios, {
  AxiosError,
  AxiosHeaders,
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
} from 'axios';
import { getIronSession } from 'iron-session';
import { cookies } from 'next/headers';

import { SessionData, sessionOptions } from '../iron-session/session-option';

export class AxiosCustomClient {
  protected instance: AxiosInstance | undefined;

  public createInstance() {
    this.instance = axios.create({
      baseURL: '',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    this.initInterceptor();
    return this.instance;
  }

  public createInstanceWithToken() {
    this.instance = axios.create({
      baseURL: '',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    this.initInterceptorWithToken();
    return this.instance;
  }

  private initInterceptor() {
    this.instance?.interceptors.response.use(function (response) {
      return response;
    }, this.handleError);

    this.instance?.interceptors.request.use(async (config: any) => {
      // Don't set Content-Type for FormData - let browser set it automatically with boundary
      if (config.data instanceof FormData) {
        delete config.headers['Content-Type'];
      }
      return config;
    });
  }

  private initInterceptorWithToken() {
    this.instance?.interceptors.response.use(function (response) {
      return response;
    }, this.handleError);
    // TODO:implement refresh token here
    this.instance?.interceptors.request.use(async (config: any) => {
      const response = await fetch('/api/session/token');
      const session = await response.json();
      const token = session.token;

      // Set up authorization header with token
      if (token) {
        config.headers = {
          ...config.headers,
          Authorization: `Bearer ${token}`,
        };
      }

      // Don't set Content-Type for FormData - let browser set it automatically with boundary
      if (config.data instanceof FormData) {
        delete config.headers['Content-Type'];
      }

      return config;
    });
  }

  // private async refreshToken(){
  //   const userData=await getServerSession( authOptions);
  //   const response=await axios.post(`${BaseUrl}/${AuthEndpoint.refreshToken}`,{
  //     headers:{
  //       "Content-Type": "application/json",
  //       "Authorization": `Bearer ${userData?.user?.token}`
  //     }
  //   })
  //   if(response?.status == 200){
  //     userData?.user.token = response.data
  //   }
  // }

  private handleResponse = ({ data }: AxiosResponse) => data;
  private handleError = (error: AxiosError) => Promise.reject(error);
}
