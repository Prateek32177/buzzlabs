export type Message =
  | { success: string }
  | { error: string }
  | { message: string };

export function FormMessage({ message }: { message: Message }) {
  return (
    <div className='flex w-full max-w-md flex-col gap-3 text-sm'>
      {'success' in message && (
        <div className='flex items-start gap-2 rounded-md border border-green-700 bg-green-600/10 p-3 text-green-400'>
          <span>{message.success}</span>
        </div>
      )}
      {'error' in message && (
        <div className='flex items-start gap-2 rounded-md border border-red-700 bg-red-600/10 p-3 text-red-400'>
          <span>{message.error}</span>
        </div>
      )}
      {'message' in message && (
        <div className='flex items-start gap-2 rounded-md border border-zinc-700 bg-zinc-600/10 p-3 text-zinc-400'>
          <span>{message.message}</span>
        </div>
      )}
    </div>
  );
}
