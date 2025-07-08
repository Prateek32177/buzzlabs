export default function PlatformLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <main className='max-w-4xl px-6 py-16 mx-auto '>{children}</main>;
}
