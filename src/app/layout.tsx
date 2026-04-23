import type { Metadata } from "next";
import "./globals.css";
import Link from "next/link";
import layoutStyles from "./layout.module.css";

export const metadata: Metadata = {
  title: "NASA Space Weather App",
  description: "Monitor real-time Coronal Mass Ejections (CME), Geomagnetic Storms (GST), and Solar Energetic Particles (SEP) using NASA's DONKI API.",
  keywords: ["NASA", "Space Weather", "Solar Flares", "CME", "Geomagnetic Storm", "Solar Particles", "Astronomy", "3D Earth", "3D Sun"],
  authors: [{ name: "Space Weather Tracker" }],
  openGraph: {
    title: "NASA Space Weather App",
    description: "Interactive 3D visualization of NASA's DONKI Space Weather data.",
    type: "website",
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <header className={`glass-panel ${layoutStyles.navbar}`}>
          <div className={layoutStyles.navBrand}>
            <Link href="/">Space Weather App</Link>
          </div>
          <nav aria-label="Main Navigation" className={layoutStyles.navLinks}>
            <Link href="/" className={layoutStyles.navLink}>Home</Link>
            <Link href="/cme" className={layoutStyles.navLink}>CME (Flares)</Link>
            <Link href="/gst" className={layoutStyles.navLink}>Geomagnetic Storms</Link>
            <Link href="/sep" className={layoutStyles.navLink}>Solar Particles</Link>
          </nav>
        </header>
        <main className={layoutStyles.mainContent}>
          {children}
        </main>
      </body>
    </html>
  );
}
