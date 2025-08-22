import "./globals.css";

export const metadata = {
  title: "Test App with Typesense",
  description: "Created with Next.js and Typesense",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
