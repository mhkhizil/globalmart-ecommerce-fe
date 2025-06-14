export interface IAuthRepository {
  login<TRequestDto, TResponseDto>(
    loginDto: TRequestDto
  ): Promise<TResponseDto>;
  logout<TResponseDto>(): Promise<TResponseDto>;
  forgotPassword<TRequestDto, TResponseDto>(
    forgotPasswordDto: TRequestDto
  ): Promise<TResponseDto>;
  resetPassword<TRequestDto, TResponseDto>(
    resetPasswordDto: TRequestDto
  ): Promise<TResponseDto>;
  verifyOtp<TRequestDto, TResponseDto>(
    verifyOtpDto: TRequestDto
  ): Promise<TResponseDto>;
  resendOtp<TRequestDto, TResponseDto>(
    resendOtpDto: TRequestDto
  ): Promise<TResponseDto>;
}
