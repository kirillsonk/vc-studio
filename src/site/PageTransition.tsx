'use client';

import React from 'react';
import { usePathname } from 'next/navigation';

/** Fades a new route in from rest. Keyed on the pathname so the animation runs once per navigation, never on scroll */
export function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  return <div key={pathname} className="vc-page">{children}</div>;
}
