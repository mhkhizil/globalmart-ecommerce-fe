export interface IUserRepository {
  /**
   * Register a new user
   * @throws {ValidationError} When validation fails with field-specific errors
   * @throws {Error} For other registration failures
   */
  register<TRequestDto, TResponseDto>(
    registerDto: TRequestDto
  ): Promise<TResponseDto>;
  updateLatLong: () => Promise<void>;

  imageUpload<TRequestDto, TResponseDto>(
    requestDto: TRequestDto
  ): Promise<TResponseDto>;

  profileUpdate<TRequestDto, TResponseDto>(
    requestDto: TRequestDto
  ): Promise<TResponseDto>;

  getUserById<TResponseDto>(userId: string): Promise<TResponseDto>;
}
