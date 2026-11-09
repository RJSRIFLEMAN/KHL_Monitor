import "./globals.css";

export const metadata = {
  title: "Karhutla Command Center",
  description: "Dashboard sistem mitigasi kebakaran lahan gambut berbasis IoT.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="id" className="h-full antialiased">
      <body className="min-h-full">{children}</body>
    </html>
  );
}
