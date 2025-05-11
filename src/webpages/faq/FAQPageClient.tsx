import FAQ from '@/components/module/faq/FAQ';

interface FaqData {
  faq: any;
}

function FAQPageClient(props: FaqData) {
  return <FAQ {...props} />;
}

export default FAQPageClient;
