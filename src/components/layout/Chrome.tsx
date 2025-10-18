"use client";

import { usePathname } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/ui/footer-section";

type ChromeProps = { which: "navbar" | "footer" };

export function Chrome({ which }: ChromeProps) {
  const pathname = usePathname();
  const onAuth = pathname?.startsWith("/auth");
  if (which === "navbar") return <Navbar />;
  // Footer hidden on auth pages
  if (onAuth) return null;
  return <Footer />;
}
