export interface IAuthRepository {
  login<TRequestDto, TResponseDto>(
    loginDto: TRequestDto
  ): Promise<TResponseDto>;
  logout<TResponseDto>(): Promise<TResponseDto>;
}
