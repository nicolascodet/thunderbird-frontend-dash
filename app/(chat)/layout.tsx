import { SessionProvider } from '@/components/session-provider';
import { TooltipProvider } from '@/components/ui/tooltip';
import { auth } from '../(auth)/auth';

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  return (
    <SessionProvider
      isAuthDisabled={false}
      isPersistenceDisabled={true}
      guestSession={undefined}
    >
      <TooltipProvider>
        <div className="flex flex-col h-screen w-full bg-white dark:bg-gray-900">
          <main className="flex-1 overflow-hidden">{children}</main>
        </div>
      </TooltipProvider>
    </SessionProvider>
  );
}
