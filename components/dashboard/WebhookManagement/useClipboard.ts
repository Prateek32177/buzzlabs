import { toast } from 'sonner';
export function useClipboard() {
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied!', { description: 'Copied to clipboard' });
  };

  return { copyToClipboard };
}
