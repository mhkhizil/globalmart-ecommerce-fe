'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

function TanStackQueryClientProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const queryClient = new QueryClient();
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
export default TanStackQueryClientProvider;
