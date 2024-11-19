"use client";

import "./globals.css";
import Footer from "./components/Footer";
import { MantineProvider } from "@mantine/core";

// Fonts (if needed)
import localFont from "next/font/local";
const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});

export const metadata = {
  title: "Real Estate App",
  description: "Find your dream home",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} antialiased`}
      >
        <MantineProvider
          withGlobalStyles
          withNormalizeCSS
          theme={{
            colorScheme: "light", // You can toggle this to "dark" for dark mode
            fontFamily: "Inter, sans-serif", // Optional font customization
            colors: {
              brand: [
                "#E3FCEC",
                "#C7F5D8",
                "#A8ECC2",
                "#85E0AA",
                "#56CF89",
              ], // Custom color palette
            },
            primaryColor: "brand", // Use the custom "brand" color
          }}
        >
          {children}
          <Footer />
        </MantineProvider>
      </body>
    </html>
  );
}
