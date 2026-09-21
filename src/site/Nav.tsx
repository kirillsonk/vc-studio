"use client";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Container } from "./Chrome";
import { HOME_SECTIONS } from "./constants";
import { Arrow } from "./Arrow";
export function Nav() {
  const [open, setOpen] = React.useState(false);
  const path = usePathname();
  const menuRef = React.useRef<HTMLButtonElement>(null);
  React.useEffect(() => setOpen(false), [path]);
  return (
    <header
      className="vc-header"
      onKeyDown={(e) => {
        if (e.key === "Escape") {
          setOpen(false);
          menuRef.current?.focus();
        }
      }}
    >
      <Container className="nav-inner">
        <Link
          href="/"
          className="wordmark"
          aria-label="VC Studio — главная"
          onClick={() => setOpen(false)}
        >
          vc<span className="wordmark-slash">/</span>studio
        </Link>
        <nav className="nav-links" aria-label="Основная навигация">
          {HOME_SECTIONS.map(([id, label]) => (
            <Link key={id} href={`/#${id}`}>
              {label}
            </Link>
          ))}
        </nav>
        <Link
          className="nav-cta"
          href="/#intake"
          onClick={() => setOpen(false)}
        >
          Начать проект <Arrow diagonal />
        </Link>
        <button
          className="menu-toggle"
          ref={menuRef}
          type="button"
          aria-expanded={open}
          aria-controls="mobile-nav"
          aria-label={open ? "Закрыть меню" : "Открыть меню"}
          onClick={() => setOpen(!open)}
        >
          <span />
          <span />
        </button>
      </Container>
      <nav
        id="mobile-nav"
        className="mobile-nav"
        aria-label="Мобильная навигация"
        hidden={!open}
      >
        {HOME_SECTIONS.map(([id, label]) => (
          <Link key={id} href={`/#${id}`} onClick={() => setOpen(false)}>
            {label}
            <Arrow diagonal />
          </Link>
        ))}
      </nav>
    </header>
  );
}
