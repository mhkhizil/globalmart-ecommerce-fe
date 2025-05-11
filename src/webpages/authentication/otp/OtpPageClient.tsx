import Otp from '@/components/module/authentication/otp/Otp';

interface IOptPageProps {
  email: string;
}

function OtpPageClient(props: IOptPageProps) {
  return <Otp {...props} />;
}
export default OtpPageClient;
