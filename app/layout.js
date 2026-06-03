import './globals.css';

export const metadata = {
  title: 'Nexus AI — Chat, Music & TikTok',
  description: 'All-in-one platform: AI Chat, Music Search, TikTok Downloader',
};

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <body>{children}</body>
    </html>
  );
}
