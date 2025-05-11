import { AxiosError } from 'axios';

import { AxiosCustomClient } from '@/lib/axios/AxiosClient';
import { API_BASE_URL, apiEndPoints } from '@/lib/endpoints/endpoints';

import { UploadImageRequestDto } from '../dtos/user/image-upload/UploadImageRequestDto';
import { IUserRepository } from '../interface/repository/IUserRepository';

// Custom error class for validation errors
export class ValidationError extends Error {
  errors: Record<string, string[]>;

  constructor(message: string, errors: Record<string, string[]>) {
    super(message);
    this.name = 'ValidationError';
    this.errors = errors;
  }
}

export class UserRepository implements IUserRepository {
  constructor(private readonly axiosClient: AxiosCustomClient) {}
  async getUserById<TResponseDto>(userId: string): Promise<TResponseDto> {
    try {
      const client = this.axiosClient.createInstanceWithToken();
      const url = `${API_BASE_URL}/${apiEndPoints.user.getUserById}/${userId}`;
      const response = await client.get(url);
      return response.data.data as TResponseDto;
    } catch (error) {
      const axiosError = error as AxiosError<any>;
      throw new Error(
        axiosError.response?.data?.message || 'Product Update Failed!'
      );
    }
  }
  async imageUpload<TRequestDto, TResponseDto>(
    requestDto: TRequestDto
  ): Promise<TResponseDto> {
    try {
      const client = this.axiosClient.createInstanceWithToken();
      const url = `${API_BASE_URL}/${apiEndPoints.user.uploadImage}`;
      const imageUploadDto = requestDto as UploadImageRequestDto;
      const response = await client.post(url, imageUploadDto.image);
      return response.data.data as TResponseDto;
    } catch (error) {
      const axiosError = error as AxiosError<any>;
      throw new Error(
        axiosError.response?.data?.message || 'Image upload failed!'
      );
    }
  }
  async profileUpdate<TRequestDto, TResponseDto>(
    requestDto: TRequestDto
  ): Promise<TResponseDto> {
    try {
      const client = this.axiosClient.createInstanceWithToken();
      const url = `${API_BASE_URL}/${apiEndPoints.user.profileUpdate}`;
      const response = await client.post(url, requestDto);
      return response.data.data as TResponseDto;
    } catch (error) {
      const axiosError = error as AxiosError<any>;
      throw new Error(
        axiosError.response?.data?.message || 'Product Update Failed!'
      );
    }
  }
  async register<TRequestDto, TResponseDto>(
    registerDto: TRequestDto
  ): Promise<TResponseDto> {
    try {
      const client = this.axiosClient.createInstance();
      const url = `${API_BASE_URL}/${apiEndPoints.user.registration}`;
      const response = await client.post(url, registerDto);
      return response as TResponseDto;
    } catch (error: unknown) {
      const axiosError = error as AxiosError<any>;
      const responseData = axiosError.response?.data;

      // Check if the error contains validation errors
      if (responseData?.errors && typeof responseData.errors === 'object') {
        throw new ValidationError(
          responseData.message || 'Validation failed',
          responseData.errors
        );
      }

      // Handle other types of errors
      throw new Error(responseData?.message || 'Registration failed');
    }
  }
  async updateLatLong(): Promise<void> {
    try {
      const client = this.axiosClient.createInstanceWithToken();
      const url = `${API_BASE_URL}/${apiEndPoints.user.registration}`;
      await client.post(url);
    } catch {
      throw new Error('latlong update fail');
    }
  }
}
