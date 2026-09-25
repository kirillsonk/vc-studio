"use client";
import { useEffect, useState } from "react";
import { Arrow } from "./Arrow";
export function FloatingContact() {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const hero = document.querySelector(".hero");
    const demo = document.getElementById("cases");
    const intake = document.getElementById("intake");
    if (!hero || !intake || !("IntersectionObserver" in window)) return;
    const update = () => {
      const editing = document.activeElement?.matches(
        "input,textarea,select,[contenteditable=true]",
      );
      const heroRect = hero.getBoundingClientRect();
      const intakeRect = intake.getBoundingClientRect();
      const demoRect = demo?.getBoundingClientRect();
      const inDemo = demoRect && demoRect.top < window.innerHeight && demoRect.bottom > 0;
      setVisible(
        heroRect.bottom <= 0 &&
          intakeRect.top >= window.innerHeight &&
          !editing && !inDemo,
      );
    };
    const observer = new IntersectionObserver(update, { threshold: 0 });
    observer.observe(hero);
    observer.observe(intake);
    if(demo)observer.observe(demo);
    document.addEventListener("focusin", update);
    document.addEventListener("focusout", update);
    window.addEventListener("resize", update);
    update();
    return () => {
      observer.disconnect();
      document.removeEventListener("focusin", update);
      document.removeEventListener("focusout", update);
      window.removeEventListener("resize", update);
    };
  }, []);
  return (
    <a
      href="#intake"
      className="action action-primary floating-contact"
      hidden={!visible}
    >
      Начать проект <Arrow diagonal />
    </a>
  );
}
