import "./globals.css";
import type { Metadata } from "next";
import { ModelProvider } from "@/lib/contexts/ModelContext";

export const metadata: Metadata = {
  title: "AR Furniture Placement",
  description: "Place furniture in your space using augmented reality",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-gray-50 min-h-screen">
        <ModelProvider>{children}</ModelProvider>
      </body>
    </html>
  );
}
