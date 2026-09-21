"use client";
import { useEffect } from "react";

/** Content is visible by default, including without JavaScript. Animate once on entry. */
export function ScrollReveal() {
  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (preference.matches || !("IntersectionObserver" in window)) return;
    const animations = new Set<Animation>();
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          observer.unobserve(entry.target);
          if (preference.matches) continue;
          const animation = entry.target.animate(
            [
              { opacity: 0.25, transform: "translateY(18px)" },
              { opacity: 1, transform: "translateY(0)" },
            ],
            { duration: 650, easing: "cubic-bezier(.2,.7,.2,1)" },
          );
          animations.add(animation);
          if (entry.target.matches(".cost-comparison")) {
            entry.target
              .querySelectorAll(".cost-stacked-track")
              .forEach((bar) => {
                const growth = bar.animate(
                  [{ transform: "scaleX(0)" }, { transform: "scaleX(1)" }],
                  { duration: 800, easing: "cubic-bezier(.2,.7,.2,1)" },
                );
                animations.add(growth);
                growth.onfinish = () => animations.delete(growth);
              });
          }
          if (entry.target.matches(".process-list > li")) {
            entry.target
              .querySelectorAll<SVGPathElement>(".process-icon path")
              .forEach((path, index) => {
                const length = path.getTotalLength();
                const trace = path.animate(
                  [
                    {
                      strokeDasharray: `${length}`,
                      strokeDashoffset: length,
                      opacity: 0,
                    },
                    {
                      strokeDasharray: `${length}`,
                      strokeDashoffset: 0,
                      opacity: 1,
                    },
                  ],
                  {
                    duration: 900,
                    delay: index * 90,
                    easing: "cubic-bezier(.2,.7,.2,1)",
                  },
                );
                animations.add(trace);
                trace.onfinish = () => animations.delete(trace);
              });
          }
          animation.onfinish = () => animations.delete(animation);
        }
      },
      { threshold: 0.12 },
    );
    document
      .querySelectorAll(
        ".section-heading, .vibe-definition, .approach-points article, .process-list > li, .service-row, .cost-comparison, .agency-panel",
      )
      .forEach((element) => {
        if (element.getBoundingClientRect().top >= window.innerHeight)
          observer.observe(element);
      });
    const stop = () => {
      if (preference.matches) {
        observer.disconnect();
        animations.forEach((a) => a.cancel());
      }
    };
    preference.addEventListener("change", stop);
    return () => {
      observer.disconnect();
      animations.forEach((a) => a.cancel());
      preference.removeEventListener("change", stop);
    };
  }, []);
  return null;
}
