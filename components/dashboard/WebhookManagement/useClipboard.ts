import { useToast } from '@/hooks/use-toast';

export function useClipboard() {
  const { toast } = useToast();

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: 'Copied to Clipboard',
      description: 'The text has been copied to your clipboard.',
    });
  };

  return { copyToClipboard };
}
