import { useEffect, useRef, useState, type ElementType, type ReactNode } from "react";

type Lenis = {
  scrollTo: (target: number | string | HTMLElement, options?: Record<string, unknown>) => void;
  on: (event: "scroll", cb: (e: { scroll: number }) => void) => void;
  off: (event: "scroll", cb: (e: { scroll: number }) => void) => void;
  scroll: number;
};

function getLenis(): Lenis | undefined {
  return (window as unknown as { lenis?: Lenis }).lenis;
}

export function prefersReducedMotion(): boolean {
  return typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/** Hauteur du header fixe, pour caler les ancres. */
export const NAV_OFFSET = 88;

/** Scroll fluide vers une ancre (#id) via Lenis, avec compensation du header. */
export function scrollToAnchor(hash: string) {
  const id = hash.replace(/^#/, "");
  const el = document.getElementById(id);
  if (!el) return;
  const lenis = getLenis();
  if (lenis) {
    lenis.scrollTo(el, { offset: -NAV_OFFSET, duration: 1.1 });
  } else {
    const top = el.getBoundingClientRect().top + window.scrollY - NAV_OFFSET;
    window.scrollTo({ top, behavior: prefersReducedMotion() ? "auto" : "smooth" });
  }
}

/** Observe un élément et ajoute .is-visible une fois visible. */
export function useReveal<T extends HTMLElement = HTMLDivElement>(options?: { threshold?: number; once?: boolean }) {
  const ref = useRef<T | null>(null);
  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    if (prefersReducedMotion()) {
      node.classList.add("is-visible");
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            if (options?.once !== false) observer.unobserve(entry.target);
          } else if (options?.once === false) {
            entry.target.classList.remove("is-visible");
          }
        }
      },
      { threshold: options?.threshold ?? 0.18, rootMargin: "0px 0px -8% 0px" }
    );
    observer.observe(node);
    // Filet de sécurité : le contenu ne doit jamais dépendre de l'animation.
    // Si l'observer est throttlé (onglet en arrière-plan) ou n'a pas déclenché, on révèle quand même.
    const fallback = window.setTimeout(() => node.classList.add("is-visible"), 1400);
    return () => {
      observer.disconnect();
      window.clearTimeout(fallback);
    };
  }, [options?.threshold, options?.once]);
  return ref;
}

type RevealProps = {
  as?: ElementType;
  children: ReactNode;
  className?: string;
  /** "up" (défaut), "fade", ou "line" (pour masques de titre) */
  variant?: "up" | "fade" | "line";
  /** délai en ms (stagger) */
  delay?: number;
  threshold?: number;
};

/** Enveloppe révélée au scroll. Respecte prefers-reduced-motion. */
export function Reveal({ as, children, className, variant = "up", delay = 0, threshold }: RevealProps) {
  const Tag = (as ?? "div") as ElementType;
  const ref = useReveal<HTMLElement>({ threshold });
  // "up" → chaîne vide (présente) pour matcher le sélecteur de base [data-reveal].
  return (
    <Tag
      ref={ref as never}
      data-reveal={variant === "up" ? "" : variant}
      style={delay ? ({ ["--reveal-delay" as string]: `${delay}ms` } as React.CSSProperties) : undefined}
      className={className}
    >
      {children}
    </Tag>
  );
}

/** Parallaxe verticale très subtile pilotée par Lenis (ou scroll natif en repli). */
export function useParallax<T extends HTMLElement = HTMLDivElement>(strength = 0.12) {
  const ref = useRef<T | null>(null);
  useEffect(() => {
    const node = ref.current;
    if (!node || prefersReducedMotion()) return;
    let raf = 0;
    const update = () => {
      const rect = node.getBoundingClientRect();
      const viewport = window.innerHeight;
      // progression -1 (au-dessus) → 1 (en-dessous) centrée sur le viewport
      const progress = (rect.top + rect.height / 2 - viewport / 2) / viewport;
      const shift = -progress * strength * 100;
      node.style.transform = `translate3d(0, ${shift.toFixed(2)}px, 0)`;
    };
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(update);
    };
    const lenis = getLenis();
    update();
    if (lenis) lenis.on("scroll", onScroll);
    else window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(raf);
      if (lenis) lenis.off("scroll", onScroll);
      else window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [strength]);
  return ref;
}

/** Vrai dès que la page a défilé au-delà du seuil (pour la nav transparent→solide). */
export function useScrolled(threshold = 24): boolean {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const check = (y: number) => setScrolled(y > threshold);
    check(window.scrollY);
    const lenis = getLenis();
    const onScroll = (e: { scroll: number }) => check(e.scroll);
    const onNative = () => check(window.scrollY);
    if (lenis) lenis.on("scroll", onScroll);
    else window.addEventListener("scroll", onNative, { passive: true });
    return () => {
      if (lenis) lenis.off("scroll", onScroll);
      else window.removeEventListener("scroll", onNative);
    };
  }, [threshold]);
  return scrolled;
}
