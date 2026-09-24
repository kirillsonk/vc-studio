import React from 'react';
import { navigate, toHash } from './router';

/** Stand-in for next/link in the standalone preview build. */
export default function Link({ href, children, ...rest }: { href: string; children: React.ReactNode } & Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, 'href'>) {
  return (
    <a href={toHash(href)} onClick={e => { e.preventDefault(); navigate(href); }} {...rest}>{children}</a>
  );
}
