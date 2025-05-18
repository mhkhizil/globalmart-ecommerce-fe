import FloatingButton from '@/components/common/FloatingButton';
import NavigationBar from '@/components/gm-module/navigation/NavigationBar';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex w-full flex-col h-[100dvh] relative">
      <div className="flex-1 overflow-y-auto scrollbar-none flex w-full relative flex-col">
        {' '}
        {children}
      </div>

      <div className="flex w-full h-16">
        <NavigationBar />
      </div>
      {/* <FloatingButton /> */}
    </div>
  );
}
