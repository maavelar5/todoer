export const metadata = {
  title: "Marco Avelar - todoer",
  description: "Simple TODO app",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
