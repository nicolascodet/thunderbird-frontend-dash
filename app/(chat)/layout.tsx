import { SessionProvider } from '@/components/session-provider';
import { isAuthDisabled, isPersistenceDisabled } from '@/lib/constants';
import { createGuestSession } from '@/lib/utils';

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Always use guest session for simplicity
  const session = createGuestSession();

  return (
    <SessionProvider
      isAuthDisabled={true}
      isPersistenceDisabled={true}
      guestSession={session}
    >
      <div className="flex flex-col h-screen w-full bg-white dark:bg-gray-900">
        <main className="flex-1 overflow-hidden">{children}</main>
      </div>
    </SessionProvider>
  );
}
