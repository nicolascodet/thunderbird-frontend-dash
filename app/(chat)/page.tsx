import { generateUUID } from '@/lib/utils';
import { SimpleChat } from '@/components/simple-chat';
import { DataStreamHandler } from '@/components/data-stream-handler';

export default async function Page() {
  const id = generateUUID();

  return (
    <>
      <SimpleChat
        key={id}
        id={id}
        initialMessages={[]}
      />
      <DataStreamHandler id={id} />
    </>
  );
}
