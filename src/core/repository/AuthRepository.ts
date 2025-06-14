import { AxiosError } from 'axios';

import { AxiosCustomClient } from '@/lib/axios/AxiosClient';
import { API_BASE_URL, apiEndPoints } from '@/lib/endpoints/endpoints';

import { IAuthRepository } from '../interface/repository/IAuthRepository';

export class AuthRepository implements IAuthRepository {
  constructor(private readonly axiosClient: AxiosCustomClient) {}

  async login<TReqeustDto, TResponseDto>(
    loginDto: TReqeustDto
  ): Promise<TResponseDto> {
    try {
      const client = this.axiosClient.createInstance();
      const url = `${API_BASE_URL}/${apiEndPoints.auth.login}`;
      const response = await client.post(url, loginDto);
      return response.data as TResponseDto;
    } catch (error: unknown) {
      const axiosError = error as AxiosError<any>;
      throw new Error(axiosError.response?.data?.message || 'Login Failed!');
    }
  }
  async logout<TResponseDto>(): Promise<TResponseDto> {
    try {
      const client = this.axiosClient.createInstanceWithToken();
      const url = `${API_BASE_URL}/${apiEndPoints.auth.logout}`;
      const response = await client.post(url);
      return response.data as TResponseDto;
    } catch {
      throw new Error('Logout Failed!');
    }
  }
  async forgotPassword<TRequestDto, TResponseDto>(
    forgotPasswordDto: TRequestDto
  ): Promise<TResponseDto> {
    try {
      const client = this.axiosClient.createInstance();
      const url = `${API_BASE_URL}/${apiEndPoints.auth.forgotPassword}`;
      const response = await client.post(url, forgotPasswordDto);
      return response.data as TResponseDto;
    } catch (error: unknown) {
      const axiosError = error as AxiosError<any>;
      throw new Error(
        axiosError.response?.data?.message || 'Forgot Password Failed!'
      );
    }
  }
  async resetPassword<TRequestDto, TResponseDto>(
    resetPasswordDto: TRequestDto
  ): Promise<TResponseDto> {
    try {
      const client = this.axiosClient.createInstance();
      const url = `${API_BASE_URL}/${apiEndPoints.auth.resetPassword}`;
      const response = await client.post(url, resetPasswordDto);
      return response.data as TResponseDto;
    } catch (error: unknown) {
      const axiosError = error as AxiosError<any>;
      throw new Error(
        axiosError.response?.data?.message || 'Reset Password Failed!'
      );
    }
  }
  async verifyOtp<TRequestDto, TResponseDto>(
    verifyOtpDto: TRequestDto
  ): Promise<TResponseDto> {
    try {
      const client = this.axiosClient.createInstance();
      const url = `${API_BASE_URL}/${apiEndPoints.auth.verifyOtp}`;
      const response = await client.post(url, verifyOtpDto);
      return response.data as TResponseDto;
    } catch (error: unknown) {
      const axiosError = error as AxiosError<any>;
      throw new Error(
        axiosError.response?.data?.message || 'Verify OTP Failed!'
      );
    }
  }
  async resendOtp<TRequestDto, TResponseDto>(
    resendOtpDto: TRequestDto
  ): Promise<TResponseDto> {
    try {
      const client = this.axiosClient.createInstance();
      const url = `${API_BASE_URL}/${apiEndPoints.auth.resendOtp}`;
      const response = await client.post(url, resendOtpDto);
      return response.data as TResponseDto;
    } catch (error: unknown) {
      const axiosError = error as AxiosError<any>;
      throw new Error(
        axiosError.response?.data?.message || 'Resend OTP Failed!'
      );
    }
  }
}
