"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function RootPage() {
  const router = useRouter();
  useEffect(() => {
    const session = localStorage.getItem("shannon_session");
    router.replace(session ? "/dashboard" : "/login");
  }, [router]);
  return null;
}
