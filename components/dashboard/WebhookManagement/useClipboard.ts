export function useClipboard() {
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return { copyToClipboard };
}
