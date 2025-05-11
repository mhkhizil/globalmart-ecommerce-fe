export interface ContactInfoDto {
  contactinfo: Array<{
    id: number;
    name: string;
    type: 'telegram' | 'wechat' | 'phone';
    image: string;
    contact_number: string;
    status: number;
    created_at: string;
    updated_at: string;
  }>;
}
