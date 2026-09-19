'use client';

import { useRouter } from 'next/navigation';

/** Navigate to a route or a home-page anchor. Smooth scrolling comes from `html{scroll-behavior:smooth}`. */
export function useGo() {
  const router = useRouter();
  return (href: string) => router.push(href);
}
