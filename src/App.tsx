import { createContext, useContext, useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowRight,
  BadgeCheck,
  Banknote,
  Building2,
  CheckCircle2,
  CreditCard,
  Clock,
  FileText,
  Globe2,
  Home,
  Landmark,
  ChevronLeft,
  ChevronRight,
  MapPin,
  Menu,
  MessageCircle,
  Phone,
  Send,
  ShieldCheck,
  Sparkles,
  WalletCards,
  Mail,
  Eye,
  Download,
  Search,
  Maximize2,
  X
} from "lucide-react";
import { assets, faq, Project, projects, services } from "./content";
import { Button } from "./components/ui/button";
import { Card, CardContent } from "./components/ui/card";
import { Reveal, useScrolled, useParallax, scrollToAnchor, prefersReducedMotion } from "./lib/motion";
import { FacebookIcon, LinkedinIcon, YoutubeIcon, XIcon } from "./components/ui/social-icons";
import { documents, docCategories, documentsForProject, type LuxosDocument, type DocCategory, type Bilingual } from "./data/documents";

type Lang = "fr" | "en";

const LangContext = createContext<{ lang: Lang; setLang: (lang: Lang) => void }>({ lang: "fr", setLang: () => undefined });
const useLang = () => useContext(LangContext);

const copy = {
  fr: {
    nav: ["Accueil", "A propos", "Campagnes", "Concessions", "Paiement", "Documents", "Diaspora", "FAQ", "Contact"],
    announce: "Diaspora, familles et investisseurs :",
    announceBold: "Luxos RDC vous accompagne de la parcelle au patrimoine.",
    topNotice: <>✦ Nouvelle campagne <b>Azur</b> — Parcelles viabilisées dès 4 500 $ · Paiement <b>0 % d'intérêt</b> sur 24 mois</>,
    advisor: "Parler à un conseiller",
    heroEyebrow: "Votre rêve devient réalité",
    heroTitle: <>Investir en RDC avec <em className="text-or">confiance</em>, élégance et clarté.</>,
    heroText: "Luxos RDC accompagne vos projets immobiliers : parcelles viabilisées, constructions, concessions et solutions pensées pour la diaspora congolaise.",
    discover: "Découvrir les campagnes",
    diasporaSpace: "Espace diaspora",
    servicesSur: "Ce que nous offrons",
    servicesTitle: "Des solutions immobilières complètes",
    servicesText: "De la vente à la construction, Luxos réunit les métiers essentiels pour sécuriser votre projet.",
    projectsSur: "Biens et concessions",
    projectsTitle: "Les opportunités Luxos",
    projectsText: "Les campagnes et concessions actuelles du site existant sont reprises et présentées dans une expérience plus claire.",
    see: "Voir",
    online: "En ligne · français & anglais"
  },
  en: {
    nav: ["Home", "About", "Campaigns", "Concessions", "Payment", "Documents", "Diaspora", "FAQ", "Contact"],
    announce: "Diaspora, families and investors:",
    announceBold: "Luxos RDC supports you from land purchase to long-term heritage.",
    topNotice: <>✦ New <b>Azur</b> campaign — Serviced plots from $4,500 · <b>0% interest</b> payment over 24 months</>,
    advisor: "Talk to an advisor",
    heroEyebrow: "Your dream becomes reality",
    heroTitle: <>Invest in DRC with <em className="text-or">confidence</em>, elegance and clarity.</>,
    heroText: "Luxos RDC supports your real-estate projects: serviced plots, construction, concessions and solutions designed for the Congolese diaspora.",
    discover: "Explore campaigns",
    diasporaSpace: "Diaspora space",
    servicesSur: "What we offer",
    servicesTitle: "Complete real-estate solutions",
    servicesText: "From sales to construction, Luxos brings together the key expertise needed to secure your project.",
    projectsSur: "Properties and concessions",
    projectsTitle: "Luxos opportunities",
    projectsText: "The current campaigns and concessions are presented in a clearer premium experience.",
    see: "View",
    online: "Online · French & English"
  }
};

const navPaths = [
  "/",
  "/a-propos",
  "/campagnes",
  "/concessions",
  "/paiement",
  "/documents",
  "/diaspora",
  "/faq",
  "/contact"
];

const desktopNav = {
  fr: [
    { label: "Accueil", path: "/" },
    { label: "Projets", items: [["Campagnes", "/campagnes"], ["Concessions", "/concessions"]] },
    { label: "Services", path: "/services" },
    { label: "Diaspora", path: "/diaspora" },
    { label: "Ressources", items: [["Paiement", "/paiement"], ["Documents", "/documents"]] },
    { label: "Luxos", items: [["À propos", "/a-propos"], ["FAQ", "/faq"], ["Contact", "/contact"]] }
  ],
  en: [
    { label: "Home", path: "/" },
    { label: "Projects", items: [["Campaigns", "/campagnes"], ["Concessions", "/concessions"]] },
    { label: "Services", path: "/services" },
    { label: "Diaspora", path: "/diaspora" },
    { label: "Resources", items: [["Payment", "/paiement"], ["Documents", "/documents"]] },
    { label: "Luxos", items: [["About", "/a-propos"], ["FAQ", "/faq"], ["Contact", "/contact"]] }
  ]
} as const;

const projectTranslations: Record<string, Partial<Project>> = {
  "azur": {
    type: "Campaign",
    location: "Kinshasa, DRC",
    status: "New campaign",
    price: "On request",
    summary: "A campaign designed to help you become an owner with simple steps, commercial support and transparent follow-up.",
    details: ["Serviced plots", "Dedicated sales support", "Flexible payment options"],
    highlights: ["Guided purchase", "Document follow-up", "Site visit"]
  },
  "luxos-hills": {
    type: "Campaign",
    location: "Kinshasa outskirts",
    status: "Current offer",
    price: "Available opportunities",
    summary: "A residential program for a new generation of investors: clear, ambitious and built for lasting value.",
    details: ["Residential lots", "Heritage planning", "Diaspora support"],
    highlights: ["Premium site", "Plans available", "Guided booking"]
  },
  "muasi-ya-talo-2026": {
    title: "Muasi ya Talo 2026",
    type: "Campaign",
    location: "DRC",
    status: "2026 edition",
    price: "Dedicated plans",
    summary: "An accessible and reassuring investment experience that celebrates women builders and family heritage.",
    details: ["Limited-time offer", "Personalized advice", "Administrative follow-up"],
    highlights: ["Women of value", "Progressive payment", "Family heritage"]
  },
  "cdm-tongandaku": {
    type: "Campaign",
    location: "Cité des Merveilles",
    status: "Home construction",
    price: "From $30,000",
    monthly: "$250 / month for 120 months",
    summary: "The campaign that turns a CDM plot into tomorrow's home, with clear plans, zones and monthly payments.",
    details: ["Single-storey and duplex homes", "Zamundu, Abbé, Lipanda, CRS zones", "Payments up to 120 months"],
    highlights: ["Build tomorrow's home", "Outline plans", "Managed construction"]
  },
  "cite-des-merveilles": {
    type: "Concession",
    location: "Kinshasa, DRC",
    status: "Historic concession",
    price: "Lots by zone",
    summary: "A major Luxos RDC concession designed to build, live and transfer heritage in an organized setting.",
    details: ["City presentation", "Gallery and plan", "Concession rules"],
    highlights: ["Identified zones", "Organized setting", "Residential community"]
  },
  "peage": {
    type: "Concession",
    location: "Toll road area",
    status: "Lots available",
    price: "From $2,500",
    summary: "An accessible concession for a real-estate investment with clear rules and professional management.",
    details: ["City presentation", "Gallery and plan", "Péage concession ROI"],
    highlights: ["Land offers", "Resale rules", "Construction support"]
  },
  "luxos-c": {
    type: "Program",
    location: "DRC",
    status: "Real-estate program",
    price: "On consultation",
    summary: "A collection of Luxos C plots and opportunities with gallery, support and heritage planning.",
    details: ["Available plots", "Land gallery", "Purchase support"],
    highlights: ["Land investment", "Dedicated advice", "Luxos follow-up"]
  }
};

function localizeProject(project: Project, lang: Lang): Project {
  return lang === "en" ? { ...project, ...projectTranslations[project.slug] } as Project : project;
}

function go(path: string) {
  window.history.pushState({}, "", path);
  window.dispatchEvent(new PopStateEvent("popstate"));
  const lenis = (window as unknown as { lenis?: { scrollTo: (t: number, o?: unknown) => void } }).lenis;
  if (lenis) lenis.scrollTo(0, { immediate: true });
  else window.scrollTo({ top: 0, behavior: "auto" });
}

function openLina(topic?: string) {
  window.dispatchEvent(new CustomEvent("lina:open", { detail: topic }));
}

const whatsAppUrl = "https://wa.me/243840080000";

const socialLinks = [
  { label: "Facebook", href: "https://www.facebook.com/LUXOSRDCIMMO", Icon: FacebookIcon },
  { label: "LinkedIn", href: "https://www.linkedin.com/company/luxosrdc", Icon: LinkedinIcon },
  { label: "YouTube", href: "https://www.youtube.com/channel/UCn_nPpRnVltQxqagkVREXAw", Icon: YoutubeIcon },
  { label: "X", href: "https://x.com/LUXOSRDCIMMO", Icon: XIcon }
];

function usePath() {
  const [path, setPath] = useState(window.location.pathname);
  useEffect(() => {
    const onPop = () => setPath(window.location.pathname);
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);
  return path;
}

function Header() {
  const [open, setOpen] = useState(false);
  const { lang, setLang } = useLang();
  const c = copy[lang];
  const navItems = desktopNav[lang];
  const path = usePath();
  const scrolled = useScrolled(20);
  // Nav transparente par-dessus les héros sombres (accueil, projets, services, diaspora), solide au scroll.
  const heroRoutes = path === "/" || path === "/services" || path === "/diaspora" || path.startsWith("/projets/");
  const overHero = !scrolled && heroRoutes;

  const isActive = (target?: string, items?: readonly (readonly [string, string])[]) => {
    if (target) return path === target;
    if (items) return items.some(([, p]) => path === p);
    return false;
  };

  return (
    <>
      <div className="bg-encre px-4 py-2.5 text-center text-[0.82rem] tracking-wide text-or-pale">
        <button onClick={() => go("/projets/azur")} className="transition-colors duration-300 hover:text-white">
          {c.topNotice}
        </button>
      </div>
      <header
        className={`sticky top-0 z-40 transition-all duration-500 ease-lux ${
          overHero
            ? "border-b border-transparent bg-transparent"
            : scrolled
              ? "border-b border-ligne bg-ivoire/92 shadow-[0_10px_30px_-24px_rgba(22,20,15,.5)] backdrop-blur-xl"
              : "border-b border-transparent bg-ivoire/70 backdrop-blur-md"
        }`}
      >
        <div className={`mx-auto flex max-w-[86rem] items-center justify-between px-5 transition-all duration-500 ease-lux lg:px-8 ${scrolled ? "h-[68px]" : "h-20"}`}>
          <button onClick={() => go("/")} className="flex items-center gap-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-or" aria-label="Accueil Luxos">
            <img src={assets.logo} alt="Luxos RDC" className={`w-auto transition-all duration-500 ease-lux ${scrolled ? "h-10" : "h-12"} ${overHero ? "brightness-0 invert" : ""}`} />
          </button>

          <nav className={`hidden items-center gap-1 text-[0.9rem] transition-colors duration-500 lg:flex ${overHero ? "text-white/90" : "text-encre-soft"}`}>
            {navItems.map((item) =>
              "items" in item ? (
                <div key={item.label} className="group relative">
                  <button className={`inline-flex items-center gap-1.5 px-4 py-6 transition-colors duration-300 ${isActive(undefined, item.items) ? "text-or" : "hover:text-or"}`}>
                    {item.label}
                    <span className="text-[0.6rem] text-or transition-transform duration-300 group-hover:rotate-180">▾</span>
                  </button>
                  <div className="invisible absolute left-1/2 top-full w-64 -translate-x-1/2 translate-y-1 border border-ligne bg-blanc p-2 opacity-0 shadow-float transition-all duration-300 ease-lux group-hover:visible group-hover:translate-y-0 group-hover:opacity-100">
                    {item.items.map(([label, p]) => (
                      <button
                        key={p}
                        onClick={() => go(p)}
                        className={`flex w-full items-center justify-between rounded-[3px] px-4 py-3 text-left text-[0.9rem] transition-colors duration-200 hover:bg-or-fond hover:text-or ${path === p ? "text-or" : ""}`}
                      >
                        {label}
                        <ArrowRight size={14} className="opacity-0 transition-opacity duration-200 group-hover:opacity-40" />
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <button
                  key={item.path}
                  onClick={() => go(item.path)}
                  className={`relative px-4 py-6 transition-colors duration-300 after:absolute after:bottom-4 after:left-4 after:h-px after:bg-or after:transition-all after:duration-300 ${
                    isActive(item.path) ? "text-or after:w-[calc(100%-2rem)]" : "hover:text-or after:w-0 hover:after:w-[calc(100%-2rem)]"
                  }`}
                >
                  {item.label}
                </button>
              )
            )}
          </nav>

          <div className="hidden items-center gap-4 lg:flex">
            <div className={`flex overflow-hidden rounded-full border text-[0.72rem] font-medium tracking-label transition-colors duration-500 ${overHero ? "border-white/25" : "border-encre/15"}`}>
              {(["fr", "en"] as Lang[]).map((label) => (
                <button
                  key={label}
                  onClick={() => setLang(label)}
                  className={`px-3 py-1.5 transition-colors duration-300 ${lang === label ? "bg-or text-white" : overHero ? "text-white/70 hover:text-white" : "text-encre-muted hover:text-or"}`}
                >
                  {label.toUpperCase()}
                </button>
              ))}
            </div>
            <Button asChild size="sm">
              <a href={whatsAppUrl} target="_blank" rel="noreferrer">{c.advisor}</a>
            </Button>
          </div>

          <button className={`grid h-11 w-11 place-items-center rounded-[3px] border transition-colors hover:border-or hover:text-or lg:hidden ${overHero ? "border-white/30 text-white" : "border-encre/20 text-encre"}`} onClick={() => setOpen(true)} aria-label="Ouvrir le menu">
            <Menu size={20} />
          </button>
        </div>
      </header>

      {open && (
        <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true">
          <button className="absolute inset-0 bg-encre/50 backdrop-blur-sm" onClick={() => setOpen(false)} aria-label="Fermer" />
          <div className="absolute right-0 top-0 flex h-full w-[86%] max-w-sm flex-col bg-ivoire p-6 shadow-float">
            <div className="mb-8 flex items-center justify-between">
              <img src={assets.logo} alt="Luxos RDC" className="h-11" />
              <button className="grid h-11 w-11 place-items-center rounded-[3px] border border-encre/20 text-encre" onClick={() => setOpen(false)} aria-label="Fermer le menu"><X size={18} /></button>
            </div>
            <div className="mb-6 flex overflow-hidden rounded-full border border-encre/15 text-xs font-medium tracking-label">
              {(["fr", "en"] as Lang[]).map((label) => (
                <button key={label} onClick={() => setLang(label)} className={`flex-1 px-3 py-2.5 transition-colors ${lang === label ? "bg-encre text-white" : "text-encre-muted"}`}>
                  {label.toUpperCase()}
                </button>
              ))}
            </div>
            <div className="grid gap-1 overflow-y-auto" data-lenis-prevent>
              {navItems.map((item) =>
                "items" in item ? (
                  <details key={item.label} className="border-b border-ligne">
                    <summary className="flex cursor-pointer list-none items-center justify-between py-3.5 text-encre">{item.label}<span className="text-or">+</span></summary>
                    <div className="grid gap-1 pb-3 pl-4">
                      {item.items.map(([label, p]) => (
                        <button key={p} onClick={() => { setOpen(false); go(p); }} className="py-2.5 text-left text-[0.92rem] text-encre-muted">
                          {label}
                        </button>
                      ))}
                    </div>
                  </details>
                ) : (
                  <button key={item.path} onClick={() => { setOpen(false); go(item.path); }} className="border-b border-ligne py-3.5 text-left text-encre">
                    {item.label}
                  </button>
                )
              )}
              <a href={whatsAppUrl} target="_blank" rel="noreferrer" className="mt-5 rounded-[3px] bg-or px-4 py-3.5 text-center text-[0.78rem] font-medium uppercase tracking-label text-white">
                {c.advisor}
              </a>
              <div className="mt-5 flex gap-3">
                {socialLinks.map(({ label, href, Icon }) => (
                  <a key={label} href={href} target="_blank" rel="noreferrer" aria-label={label} className="grid h-10 w-10 place-items-center rounded-[3px] border border-encre/15 text-encre-muted transition-colors hover:border-or hover:text-or">
                    <Icon size={17} />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function SectionTitle({ sur, title, text, align = "center", tone = "dark", as = "h2" }: { sur: string; title: string; text?: string; align?: "center" | "left"; tone?: "dark" | "light"; as?: "h1" | "h2" }) {
  const centered = align === "center";
  const light = tone === "light";
  const Heading = as;
  return (
    <Reveal className={`mb-12 max-w-3xl md:mb-16 ${centered ? "mx-auto text-center" : ""}`}>
      <span className={`mb-4 inline-flex items-center gap-3 text-eyebrow font-medium uppercase tracking-eyebrow ${light ? "text-or-clair" : "text-or-deep"} ${centered ? "" : "before:h-px before:w-9 before:bg-or/50"}`}>{sur}</span>
      <Heading className={`font-display text-display-md font-semibold leading-tight ${light ? "text-white" : "text-encre"}`}>{title}</Heading>
      {text && <p className={`mt-5 max-w-2xl text-[1.05rem] leading-relaxed ${centered ? "mx-auto" : ""} ${light ? "text-white/65" : "text-encre-muted"}`}>{text}</p>}
    </Reveal>
  );
}

function CountUp({ value, suffix = "", duration = 1300 }: { value: number; suffix?: string; duration?: number }) {
  const [display, setDisplay] = useState(0);
  const [started, setStarted] = useState(false);
  const ref = useRef<HTMLSpanElement | null>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node || started) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      setStarted(true);
      const start = performance.now();
      const step = (now: number) => {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        setDisplay(Math.round(value * eased));
        if (progress < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
      observer.disconnect();
    }, { threshold: 0.35 });
    observer.observe(node);
    return () => observer.disconnect();
  }, [duration, started, value]);

  return <span ref={ref}>{display.toLocaleString("fr-FR")}{suffix}</span>;
}

function ProjectCard({ project }: { project: Project }) {
  const { lang } = useLang();
  const c = copy[lang];
  const goToProject = () => go(`/projets/${project.slug}`);
  return (
    <article
      onClick={goToProject}
      className="group flex h-full cursor-pointer flex-col overflow-hidden rounded-[6px] border border-ligne bg-blanc shadow-card transition duration-500 ease-lux hover:-translate-y-1.5 hover:border-or/40 hover:shadow-luxos"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-creme">
        <img src={project.coverImage ?? project.image} alt={project.title} loading="lazy" decoding="async" className="h-full w-full object-cover transition duration-[900ms] ease-lux group-hover:scale-[1.06]" />
        <div className="absolute inset-0 bg-gradient-to-t from-encre/45 via-transparent to-transparent opacity-70" />
        <span className="absolute left-4 top-4 rounded-[3px] bg-encre/85 px-3 py-1 text-[0.66rem] font-medium uppercase tracking-label text-or-clair backdrop-blur-sm">{project.type}</span>
        <span className="absolute bottom-4 left-4 flex items-center gap-1.5 text-[0.72rem] font-medium uppercase tracking-label text-white"><MapPin size={13} />{project.location}</span>
      </div>
      <div className="flex flex-1 flex-col p-6">
        <h3 className="font-display text-2xl font-semibold leading-snug">{project.title}</h3>
        <p className="mt-3 flex-1 text-[0.92rem] leading-relaxed text-encre-muted">{project.summary}</p>
        <div className="mt-6 flex items-end justify-between border-t border-ligne pt-5">
          <div>
            <div className="font-display text-2xl font-semibold text-or">{project.price}</div>
            {project.monthly && <div className="mt-0.5 text-[0.76rem] text-encre-muted">{project.monthly}</div>}
          </div>
          <span className="inline-flex items-center gap-2 text-[0.76rem] font-medium uppercase tracking-label text-encre transition-colors group-hover:text-or">
            {c.see}
            <span className="grid h-9 w-9 place-items-center rounded-full border border-or/30 text-or transition-all duration-500 ease-lux group-hover:bg-or group-hover:text-white"><ArrowRight size={15} /></span>
          </span>
        </div>
      </div>
    </article>
  );
}

function HomePage() {
  const { lang } = useLang();
  const isEn = lang === "en";
  const c = copy[lang];
  const parallax = useParallax<HTMLDivElement>(0.08);

  const heroStats: [number, string, string][] = [
    [2500, "+", isEn ? "Clients supported" : "Clients accompagnés"],
    [12, " ha", isEn ? "Available land" : "Foncier disponible"],
    [0, "%", isEn ? "Interest · Luxos Green" : "Intérêt · Luxos Green"]
  ];

  return (
    <>
      <section className="relative -mt-20 min-h-[88vh] w-full overflow-hidden bg-encre text-white lg:min-h-[94vh]">
        <div ref={parallax} className="lux-media absolute inset-0 -top-[6%] h-[112%]">
          <img src={assets.hero} alt={isEn ? "Luxos advisor supporting a family with their real-estate project in Kinshasa" : "Conseiller Luxos accompagnant une famille dans son projet immobilier à Kinshasa"} decoding="async" className="h-full w-full object-cover object-[68%_center]" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-encre via-encre/70 to-encre/25" />
        <div className="absolute inset-0 bg-gradient-to-t from-encre/85 via-transparent to-encre/40" />

        <div className="relative mx-auto flex min-h-[88vh] max-w-[86rem] flex-col justify-center px-5 pb-20 pt-32 lg:min-h-[94vh] lg:px-8">
          <div className="max-w-3xl animate-fadeUp">
            <span className="inline-flex items-center gap-3 text-eyebrow font-medium uppercase tracking-eyebrow text-or-clair before:h-px before:w-9 before:bg-or-clair/60">{c.heroEyebrow}</span>
            <h1 className="mt-6 font-display text-display-xl font-medium leading-[0.98]">{c.heroTitle}</h1>
            <p className="mt-7 max-w-xl text-lg leading-relaxed text-white/75">{c.heroText}</p>
            <div className="mt-9 flex flex-wrap gap-4">
              <Button size="lg" onClick={() => go("/campagnes")}>{c.discover} <ArrowRight size={16} /></Button>
              <Button size="lg" variant="light" onClick={() => go("/diaspora")}>{c.diasporaSpace}</Button>
            </div>
            <div className="mt-14 grid max-w-2xl grid-cols-3 gap-6 border-t border-white/15 pt-8 md:gap-10">
              {heroStats.map(([value, suffix, label]) => (
                <div key={label}>
                  <div className="font-display text-4xl font-semibold text-or-clair md:text-5xl"><CountUp value={value} suffix={suffix} /></div>
                  <div className="mt-1 text-[0.68rem] uppercase tracking-label text-white/55">{label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="absolute bottom-8 right-5 z-10 hidden max-w-[19rem] items-start gap-3 border border-white/15 bg-encre/40 p-5 text-sm text-white/85 backdrop-blur-md lg:flex lg:right-8">
          <ShieldCheck size={20} className="mt-0.5 shrink-0 text-or-clair" />
          {isEn ? "Purchase, documents, payment and follow-up in one premium journey." : "Achat, documents, paiement et suivi dans un parcours premium."}
        </div>
        <button onClick={() => scrollToAnchor("#parcours")} className="absolute bottom-8 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 text-[0.62rem] uppercase tracking-label text-white/50 transition-colors hover:text-or-clair lg:flex" aria-label={isEn ? "Scroll down" : "Défiler"}>
          {isEn ? "Scroll" : "Explorer"}
          <span className="h-9 w-px animate-heroFloat bg-gradient-to-b from-or-clair to-transparent" />
        </button>
      </section>

      <Services />
      <FeaturedProjects />
      <ConstructionTeaser />
      <AboutBlock />
      <ProofBlock />
      <PaymentBlock />
      <DiasporaTeaser />
      <DocumentsTeaser />
      <FinalCTA />
    </>
  );
}

function Services() {
  const { lang } = useLang();
  const c = copy[lang];
  const serviceItems = lang === "en"
    ? [
        ["Property sales", "Purchase land, plots and properties with a clear path from first contact to document handover."],
        ["Custom construction", "Design office, plans, execution and follow-up to build the home that fits your budget."],
        ["Property rental", "Management and value creation for properties to secure income and simplify daily operations."],
        ["Fencing and works", "Fencing, extensions and renovations to protect and improve your property."]
      ]
    : services;
  return (
    <section id="parcours" className="scroll-mt-24 bg-creme py-20 lg:py-28">
      <div className="mx-auto max-w-[86rem] px-5 lg:px-8">
        <SectionTitle sur={c.servicesSur} title={c.servicesTitle} text={c.servicesText} align="left" />
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {serviceItems.map(([title, text], i) => (
            <Reveal key={title} delay={i * 90}>
              <Card className="group h-full transition duration-500 ease-lux hover:-translate-y-1.5 hover:border-or/40 hover:shadow-luxos">
                <CardContent className="p-7">
                  {[Landmark, Home, Building2, ShieldCheck].map((Icon, index) => index === i && <Icon key={title} className="mb-6 text-or transition-transform duration-500 group-hover:-translate-y-0.5" size={32} strokeWidth={1.5} />)}
                  <h3 className="font-display text-2xl font-semibold">{title}</h3>
                  <p className="mt-3 text-[0.95rem] leading-relaxed text-encre-muted">{text}</p>
                </CardContent>
              </Card>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function FeaturedProjects() {
  const { lang } = useLang();
  const isEn = lang === "en";
  const c = copy[lang];
  return (
    <section className="py-20 lg:py-28">
      <div className="mx-auto max-w-[86rem] px-5 lg:px-8">
        <div className="mb-12 flex flex-wrap items-end justify-between gap-6 md:mb-16">
          <SectionTitle sur={c.projectsSur} title={c.projectsTitle} text={c.projectsText} align="left" />
          <Reveal delay={120} className="hidden md:block">
            <Button variant="outline" onClick={() => go("/campagnes")}>{isEn ? "All opportunities" : "Toutes les opportunités"} <ArrowRight size={16} /></Button>
          </Reveal>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {projects.slice(0, 6).map((project, i) => (
            <Reveal key={project.slug} delay={(i % 3) * 100}>
              <ProjectCard project={localizeProject(project, lang)} />
            </Reveal>
          ))}
        </div>
        <div className="mt-10 md:hidden">
          <Button variant="outline" className="w-full" onClick={() => go("/campagnes")}>{isEn ? "All opportunities" : "Toutes les opportunités"} <ArrowRight size={16} /></Button>
        </div>
      </div>
    </section>
  );
}

function AboutBlock() {
  const { lang } = useLang();
  const isEn = lang === "en";
  const points = isEn
    ? ["Proven field expertise across Kinshasa", "Sales support and in-house design office", "A relationship of trust with families and the diaspora"]
    : ["Expertise éprouvée sur le terrain à Kinshasa", "Accompagnement commercial et bureau d'études intégré", "Relation de confiance avec les familles et la diaspora"];
  return (
    <section className="bg-ivoire py-20 lg:py-28">
      <div className="mx-auto grid max-w-[86rem] items-center gap-14 px-5 lg:grid-cols-2 lg:px-8">
        <Reveal variant="fade" className="relative">
          <div className="lux-media rounded-[8px]">
            <img src={assets.advisorDiaspora} alt={isEn ? "The Luxos team supporting a family with their real-estate project" : "L'équipe Luxos accompagnant une famille dans son projet immobilier"} loading="lazy" decoding="async" className="aspect-[5/4] w-full object-cover" />
          </div>
          <div className="absolute -bottom-6 -right-2 hidden border border-ligne bg-blanc p-6 shadow-float sm:block lg:-right-8">
            <div className="flex items-center gap-6">
              <div>
                <div className="font-display text-4xl font-semibold text-or">+100</div>
                <div className="text-[0.66rem] uppercase tracking-label text-encre-muted">{isEn ? "Experts" : "Experts"}</div>
              </div>
              <div className="h-10 w-px bg-ligne" />
              <div>
                <div className="font-display text-4xl font-semibold text-or">+2 500</div>
                <div className="text-[0.66rem] uppercase tracking-label text-encre-muted">{isEn ? "Clients" : "Clients"}</div>
              </div>
            </div>
          </div>
        </Reveal>
        <div>
          <SectionTitle
            sur={isEn ? "About us" : "À propos de nous"}
            title={isEn ? "A real-estate group built to make your projects real." : "Un groupe immobilier bâti pour concrétiser vos projets."}
            text={isEn ? "Founded by real-estate professionals, Luxos RDC brings together more than 100 experts and supports individuals, businesses and institutions in secured projects." : "Créé par des professionnels de l'immobilier, Luxos RDC réunit plus de 100 experts et accompagne particuliers, entreprises et institutions dans des projets sécurisés."}
            align="left"
          />
          <div className="grid gap-4">
            {points.map((point, i) => (
              <Reveal key={point} delay={i * 90} className="flex gap-3 text-encre-soft"><CheckCircle2 className="mt-0.5 shrink-0 text-rdc-green" size={20} strokeWidth={1.75} />{point}</Reveal>
            ))}
          </div>
          <Reveal delay={280}>
            <Button className="mt-9" variant="outline" onClick={() => go("/a-propos")}>{isEn ? "Discover Luxos" : "Découvrir Luxos"} <ArrowRight size={16} /></Button>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function DiasporaTeaser() {
  const { lang } = useLang();
  const isEn = lang === "en";
  const steps = isEn
    ? ["Project diagnosis", "Plot or house selection", "Payment and follow-up", "Family heritage"]
    : ["Diagnostic projet", "Sélection parcelle ou maison", "Paiement et suivi", "Transmission familiale"];
  return (
    <section className="overflow-hidden bg-encre py-20 text-white lg:py-28">
      <div className="mx-auto grid max-w-[86rem] items-center gap-14 px-5 lg:grid-cols-[1.05fr_.95fr] lg:px-8">
        <div>
          <SectionTitle
            sur={isEn ? "Diaspora space" : "Espace diaspora"}
            title={isEn ? "Buy back home without losing the thread, even from abroad." : "Acheter au pays sans perdre le fil, même à distance."}
            text={isEn ? "Appointments matched to your time zone, document control, progress proof and human follow-up." : "Rendez-vous adaptés à votre fuseau horaire, contrôle documentaire, preuves d'avancement et suivi humain."}
            align="left"
            tone="light"
          />
          <div className="grid gap-4">
            {steps.map((step, i) => (
              <Reveal key={step} delay={i * 80} className="flex gap-4 border border-white/12 bg-white/[.03] p-4 transition-colors duration-500 hover:border-or/30">
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-or font-display text-xl">{i + 1}</span>
                <div>
                  <h3 className="font-display text-xl">{step}</h3>
                  <p className="mt-1 text-[0.88rem] text-white/55">{isEn ? "A Luxos advisor guides you with simple checkpoints." : "Un conseiller Luxos vous accompagne avec des points de contrôle simples."}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
        <Reveal variant="fade"><FuseauCard /></Reveal>
      </div>
    </section>
  );
}

function FuseauCard() {
  const { lang } = useLang();
  const isEn = lang === "en";
  return (
    <div className="border border-or/25 bg-white/[.04] text-white shadow-luxos">
      <div className="p-8">
        <div className="font-display text-3xl">{isEn ? "International availability" : "Disponibilité internationale"}</div>
        <div className="mb-7 mt-1 text-[0.68rem] uppercase tracking-label text-or-clair">{isEn ? "Kinshasa connected to your time zone" : "Kinshasa connectée à votre fuseau"}</div>
        {[["Kinshasa", "RDC", "09:00"], ["Bruxelles", "Europe", "10:00"], ["Paris", "Europe", "10:00"], ["Montréal", "Canada", "04:00"]].map(([city, zone, time]) => (
          <div key={city} className="mb-3 flex items-center justify-between border border-white/12 bg-white/[.04] px-4 py-3">
            <div><div>{city}</div><div className="text-[0.62rem] uppercase tracking-label text-white/45">{zone}</div></div>
            <div className="font-display text-2xl text-or-clair">{time}</div>
          </div>
        ))}
        <Button className="mt-4 w-full" onClick={() => go("/diaspora")}>{isEn ? "Open the diaspora space" : "Ouvrir l'espace diaspora"}</Button>
      </div>
    </div>
  );
}

function PaymentBlock() {
  const { lang } = useLang();
  const isEn = lang === "en";
  const [amount, setAmount] = useState(45000);
  const [depositRate, setDepositRate] = useState(20);
  const [duration, setDuration] = useState(12);
  const deposit = amount * depositRate / 100;
  const monthly = (amount - deposit) / duration;
  const fmt = (value: number) => `${Math.round(value).toLocaleString(isEn ? "en-US" : "fr-FR")} $`;

  const cashPoints = isEn
    ? ["Up to -8% on the total price", "No instalments to track", "Immediate document handover"]
    : ["Jusqu'à -8 % sur le prix total", "Aucune échéance à suivre", "Remise des documents immédiate"];
  const greenPoints = isEn
    ? ["Up to 24 instalments", "Guaranteed 0% interest rate", "Automatic reminders from the assistant"]
    : ["Jusqu'à 24 mensualités", "0 % de taux d'intérêt garanti", "Rappels automatiques par l'assistant"];

  const sliders: [string, number, number, number, number, string, (v: number) => void][] = [
    [isEn ? "Property amount" : "Montant du bien", amount, 4500, 125000, 500, fmt(amount), setAmount],
    [isEn ? "Down payment" : "Apport initial", depositRate, 10, 60, 5, `${depositRate} %`, setDepositRate],
    [isEn ? "Duration" : "Durée", duration, 3, 24, 1, `${duration} ${isEn ? "months" : "mois"}`, setDuration]
  ];
  const results: [string, string][] = [
    [isEn ? "Down payment" : "Apport", fmt(deposit)],
    [isEn ? "Monthly" : "Mensualité", fmt(monthly)],
    [isEn ? "Interest" : "Intérêts", "0 $"]
  ];

  return (
    <section className="bg-creme py-20 lg:py-28">
      <div className="mx-auto max-w-[86rem] px-5 lg:px-8">
        <SectionTitle sur={isEn ? "Payment plans" : "Nos formules de paiement"} title={isEn ? "Pay at your own pace." : "Un paiement à votre rythme."} text={isEn ? "Simulate your instalments in seconds and choose the plan that fits you." : "Simulez vos mensualités en quelques secondes et choisissez la formule qui vous convient."} align="left" />
        <div className="mb-6 grid gap-6 lg:grid-cols-2">
          <Reveal>
            <div className="h-full border border-ligne bg-blanc p-8 shadow-card">
              <Banknote className="mb-5 text-or" size={32} strokeWidth={1.5} />
              <h3 className="font-display text-4xl font-semibold">Luxos Cash</h3>
              <div className="mt-1 text-[0.68rem] uppercase tracking-label text-or-deep">{isEn ? "Upfront payment" : "Paiement comptant"}</div>
              <p className="mt-4 leading-relaxed text-encre-muted">{isEn ? "Pay in one go and enjoy exclusive discounts on your land, fencing or construction." : "Réglez en une fois et profitez de réductions exclusives sur votre terrain, votre clôture ou votre construction."}</p>
              <ul className="mt-5 grid gap-3 text-[0.95rem] text-encre-soft">
                {cashPoints.map((item) => <li key={item} className="flex gap-2"><CheckCircle2 className="shrink-0 text-rdc-green" size={18} />{item}</li>)}
              </ul>
              <Button className="mt-7 w-full" variant="outline" onClick={() => openLina("cash")}>{isEn ? "Choose Luxos Cash" : "Choisir Luxos Cash"}</Button>
            </div>
          </Reveal>
          <Reveal delay={100}>
            <div className="relative h-full border-2 border-or bg-gradient-to-br from-or-fond to-blanc p-8 shadow-soft">
              <span className="absolute left-8 top-[-13px] rounded-[3px] bg-or px-4 py-1 text-[0.66rem] font-medium uppercase tracking-label text-white">{isEn ? "Most chosen" : "Le plus choisi"}</span>
              <Sparkles className="mb-5 text-or" size={32} strokeWidth={1.5} />
              <h3 className="font-display text-4xl font-semibold">Luxos Green</h3>
              <div className="mt-1 text-[0.68rem] uppercase tracking-label text-or-deep">{isEn ? "Instalments · 0% interest" : "Paiement échelonné · 0 % d'intérêt"}</div>
              <p className="mt-4 leading-relaxed text-encre-muted">{isEn ? "Spread your investment over several instalments with zero interest, with reminders and follow-up from Lina." : "Étalez votre investissement sur plusieurs mensualités sans le moindre intérêt, avec rappels et suivi par Lina."}</p>
              <ul className="mt-5 grid gap-3 text-[0.95rem] text-encre-soft">
                {greenPoints.map((item) => <li key={item} className="flex gap-2"><CheckCircle2 className="shrink-0 text-rdc-green" size={18} />{item}</li>)}
              </ul>
              <Button className="mt-7 w-full" onClick={() => openLina("green")}>{isEn ? "Choose Luxos Green" : "Choisir Luxos Green"}</Button>
            </div>
          </Reveal>
        </div>

        <Reveal variant="fade">
          <div className="border border-ligne bg-blanc p-7 shadow-card md:p-11">
            <h3 className="font-display text-display-sm font-semibold">{isEn ? "Instalment simulator" : "Simulateur de mensualités"}</h3>
            <p className="mt-2 text-encre-muted">{isEn ? "Luxos Green plan — 0% interest" : "Formule Luxos Green — 0 % d'intérêt"}</p>
            <div className="mt-9 grid gap-8">
              {sliders.map(([label, value, min, max, step, display, setter]) => (
                <label key={label} className="grid gap-4 md:grid-cols-[220px_1fr_140px] md:items-center">
                  <span className="text-lg text-encre-soft">{label}</span>
                  <input type="range" min={min} max={max} step={step} value={value} onChange={(event) => setter(Number(event.target.value))} className="h-2 accent-or" aria-label={label} />
                  <span className="text-right font-display text-3xl font-semibold text-or">{display}</span>
                </label>
              ))}
            </div>
            <div className="mt-9 grid gap-4 bg-or-fond p-6 text-center md:grid-cols-3">
              {results.map(([label, value]) => (
                <div key={label}>
                  <div className="text-[0.68rem] uppercase tracking-label text-encre-muted">{label}</div>
                  <div className="mt-3 font-display text-5xl font-semibold text-or">{value}</div>
                </div>
              ))}
            </div>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              {[
                [CreditCard, "Visa / Mastercard", ""],
                [WalletCards, "M-Pesa", ""],
                [WalletCards, "Orange Money", ""],
                [WalletCards, "Airtel Money", ""],
                [ArrowRight, isEn ? "International transfer" : "Virement international", "border-rdc-blue/25 text-rdc-blue"]
              ].map(([Icon, label, className]) => {
                const MethodIcon = Icon as typeof CreditCard;
                return (
                  <div key={String(label)} className={`inline-flex items-center gap-3 rounded-full border border-ligne bg-creme px-5 py-2.5 text-[0.9rem] text-encre-soft ${String(className)}`}>
                    <MethodIcon className="text-or" size={18} />
                    {String(label)}
                  </div>
                );
              })}
            </div>
            <div className="mt-8 text-center">
              <Button onClick={() => openLina("payer")}>{isEn ? "Make a payment" : "Effectuer un paiement"}</Button>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function ProofBlock() {
  const { lang } = useLang();
  const isEn = lang === "en";
  const stats: [string, number, string][] = isEn
    ? [["Plots sold", 2800, ""], ["Houses built", 2021, ""], ["Available area", 82, " ha"], ["Clients supported", 2500, ""]]
    : [["Parcelles vendues", 2800, ""], ["Maisons construites", 2021, ""], ["Superficie disponible", 82, " ha"], ["Clients accompagnés", 2500, ""]];
  return (
    <section className="border-y border-ligne bg-blanc py-16 lg:py-20">
      <div className="mx-auto max-w-[86rem] px-5 lg:px-8">
        <div className="grid gap-10 md:grid-cols-4 md:gap-8">
          {stats.map(([label, value, suffix], i) => (
            <Reveal key={label} delay={i * 90} className="text-center md:text-left">
              <div className="font-display text-5xl font-semibold text-encre md:text-6xl"><CountUp value={value} suffix={suffix} /></div>
              <div className="mt-2 text-[0.7rem] uppercase tracking-label text-encre-muted">{label}</div>
              <div className="mt-4 h-px w-10 bg-or/40 md:mx-0 mx-auto" />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function ConstructionTeaser() {
  const { lang } = useLang();
  const isEn = lang === "en";
  const parallax = useParallax<HTMLDivElement>(0.06);
  const capabilities = isEn
    ? ["Design office & architectural plans", "Turnkey construction & project management", "Renovation, extensions & fencing"]
    : ["Bureau d'études & plans architecturaux", "Construction clé en main & maîtrise d'ouvrage", "Rénovation, agrandissements & clôtures"];
  return (
    <section className="relative overflow-hidden bg-encre text-white">
      <div className="grid lg:grid-cols-2">
        <div className="relative min-h-[320px] overflow-hidden lg:min-h-full">
          <div ref={parallax} className="lux-media absolute inset-0 -top-[6%] h-[112%]">
            <img src={assets.construction} alt={isEn ? "Luxos custom-built home at Cité des Merveilles" : "Maison Luxos construite sur mesure à Cité des Merveilles"} loading="lazy" decoding="async" className="h-full w-full object-cover" />
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-encre via-transparent to-transparent lg:bg-gradient-to-r" />
        </div>
        <div className="px-5 py-20 lg:px-16 lg:py-28">
          <SectionTitle
            sur="Construction"
            title={isEn ? "We don't only sell land — we build homes." : "Nous ne vendons pas que du terrain — nous bâtissons des maisons."}
            text={isEn ? "From outline plans to handover, Luxos designs and builds houses that respect your budget, with managed construction and a ten-year structural guarantee." : "Des plans sommaires à la remise des clés, Luxos conçoit et construit des maisons qui respectent votre budget, avec une construction encadrée et une garantie décennale."}
            align="left"
            tone="light"
          />
          <div className="grid gap-4">
            {capabilities.map((cap, i) => (
              <Reveal key={cap} delay={i * 90} className="flex items-center gap-3 border-b border-white/12 pb-4 text-white/85">
                <Building2 size={20} className="shrink-0 text-or-clair" strokeWidth={1.5} />{cap}
              </Reveal>
            ))}
          </div>
          <Reveal delay={300}>
            <Button className="mt-9" onClick={() => go("/services")}>{isEn ? "Explore construction" : "Découvrir la construction"} <ArrowRight size={16} /></Button>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function DocumentsTeaser() {
  const { lang } = useLang();
  const isEn = lang === "en";
  const docs = [
    { label: isEn ? "CDM concession rules" : "Règlement concession CDM", meta: "PDF · 2,8 Mo", href: "/documents/reglement-concession-cite-des-merveilles.pdf" },
    { label: "ROI Concession Péage", meta: "PDF · 2,7 Mo", href: "/documents/roi-concession-peage.pdf" }
  ];
  return (
    <section className="bg-creme py-20 lg:py-28">
      <div className="mx-auto grid max-w-[86rem] items-center gap-12 px-5 lg:grid-cols-[1fr_1.1fr] lg:px-8">
        <SectionTitle
          sur={isEn ? "Resources" : "Ressources"}
          title={isEn ? "Documents, rules and plans — all in one place." : "Documents, règlements et plans — au même endroit."}
          text={isEn ? "Concession rules, ROI, campaign sheets and zone plans: transparent, verifiable and always accessible from the document center." : "Règlements de concession, ROI, fiches campagnes et plans de zone : transparents, vérifiables et toujours accessibles depuis le centre de documentation."}
          align="left"
        />
        <div className="grid gap-3">
          {docs.map((doc, i) => (
            <Reveal key={doc.href} delay={i * 100}>
              <a href={doc.href} target="_blank" rel="noreferrer" className="group flex items-center gap-4 border border-ligne bg-blanc p-5 shadow-card transition duration-500 ease-lux hover:-translate-y-0.5 hover:border-or/40 hover:shadow-soft">
                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-[4px] bg-or-fond text-or"><FileText size={22} strokeWidth={1.5} /></span>
                <div className="min-w-0 flex-1">
                  <div className="font-display text-lg font-semibold leading-tight">{doc.label}</div>
                  <div className="mt-0.5 text-[0.72rem] uppercase tracking-label text-encre-muted">{doc.meta}</div>
                </div>
                <ArrowRight size={18} className="shrink-0 text-encre-muted transition-colors group-hover:text-or" />
              </a>
            </Reveal>
          ))}
          <Reveal delay={220}>
            <Button variant="outline" className="mt-2 w-full" onClick={() => go("/documents")}>{isEn ? "Open the document center" : "Ouvrir le centre de documentation"} <ArrowRight size={16} /></Button>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function FinalCTA() {
  const { lang } = useLang();
  const isEn = lang === "en";
  return (
    <section className="bg-encre py-24 text-white lg:py-32">
      <div className="mx-auto max-w-[70rem] px-5 text-center lg:px-8">
        <Reveal>
          <span className="lux-eyebrow lux-eyebrow--center justify-center text-or-clair">{isEn ? "Start your project" : "Démarrez votre projet"}</span>
          <h2 className="mx-auto mt-6 max-w-4xl font-display text-display-lg font-semibold leading-[1.02]">
            {isEn ? "From your first plot to a lasting family heritage." : "De votre première parcelle au patrimoine familial."}
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-white/65">
            {isEn ? "Talk to a Luxos advisor today — in Kinshasa or from abroad. We structure your purchase, your payments and your follow-up." : "Parlez à un conseiller Luxos aujourd'hui — à Kinshasa ou depuis l'étranger. Nous structurons votre achat, vos paiements et votre suivi."}
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Button size="lg" asChild><a href={whatsAppUrl} target="_blank" rel="noreferrer"><MessageCircle size={18} />{isEn ? "Talk on WhatsApp" : "Parler sur WhatsApp"}</a></Button>
            <Button size="lg" variant="light" onClick={() => go("/contact")}>{isEn ? "Contact Luxos" : "Contacter Luxos"}</Button>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function DocumentItem({ doc }: { doc: LuxosDocument }) {
  const { lang } = useLang();
  const isEn = lang === "en";
  const cat = docCategories.find((c) => c.id === doc.category);
  const isImage = doc.kind !== "pdf";
  return (
    <div className="group flex gap-4 border border-ligne bg-blanc p-4 shadow-card transition duration-500 ease-lux hover:-translate-y-0.5 hover:border-or/40 hover:shadow-soft">
      <div className="relative h-24 w-20 shrink-0 overflow-hidden rounded-[4px] bg-creme">
        {isImage ? (
          <img src={doc.file} alt="" loading="lazy" decoding="async" className="h-full w-full object-cover transition duration-700 ease-lux group-hover:scale-105" />
        ) : (
          <div className="grid h-full place-items-center bg-or-fond text-or"><FileText size={26} strokeWidth={1.5} /></div>
        )}
      </div>
      <div className="flex min-w-0 flex-1 flex-col">
        <span className="text-[0.6rem] font-medium uppercase tracking-label text-or-deep">{cat?.label[lang]}</span>
        <h3 className="mt-1 font-display text-lg font-semibold leading-tight">{doc.title[lang]}</h3>
        {doc.description && <p className="mt-1 line-clamp-2 text-[0.85rem] leading-relaxed text-encre-muted">{doc.description[lang]}</p>}
        <div className="mt-auto flex flex-wrap items-center gap-x-4 gap-y-2 pt-3">
          <a href={doc.file} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 text-[0.72rem] font-medium uppercase tracking-label text-encre transition-colors hover:text-or"><Eye size={15} />{isEn ? "View" : "Consulter"}</a>
          <a href={doc.file} download className="inline-flex items-center gap-1.5 text-[0.72rem] font-medium uppercase tracking-label text-encre-muted transition-colors hover:text-or"><Download size={15} />{isEn ? "Download" : "Télécharger"}</a>
          {doc.sizeLabel && <span className="ml-auto text-[0.64rem] uppercase tracking-label text-encre-muted/70">{doc.sizeLabel}</span>}
        </div>
      </div>
    </div>
  );
}

const projectTypeLabels: Record<string, Bilingual> = {
  all: { fr: "Tous les projets", en: "All projects" },
  Campagne: { fr: "Campagnes", en: "Campaigns" },
  Concession: { fr: "Concessions", en: "Concessions" },
  Programme: { fr: "Programmes", en: "Programs" }
};

function ListingPage({ mode }: { mode: "all" | "Campagne" | "Concession" }) {
  const { lang } = useLang();
  const isEn = lang === "en";
  const [filter, setFilter] = useState<string>(mode);

  useEffect(() => setFilter(mode), [mode]);

  const list = filter === "all" ? projects : projects.filter((p) => p.type === filter);
  const availableTypes = ["all", ...Array.from(new Set(projects.map((p) => p.type as string)))];

  const heading = mode === "Concession"
    ? (isEn ? "Luxos RDC concessions" : "Concessions Luxos RDC")
    : (isEn ? "Luxos real-estate campaigns" : "Campagnes immobilières Luxos");
  const sur = isEn ? "Projects" : "Projets";
  const intro = isEn
    ? "Explore Luxos land, concessions and residential programs — filter by type and open each project for plans, documents and payment options."
    : "Explorez les terrains, concessions et programmes résidentiels Luxos — filtrez par type et ouvrez chaque projet pour les plans, documents et options de paiement.";

  return (
    <main className="pt-28 lg:pt-36">
      <div className="mx-auto max-w-[86rem] px-5 lg:px-8">
        <SectionTitle sur={sur} title={heading} text={intro} align="left" as="h1" />
        <div className="mb-10 flex flex-wrap gap-2">
          {availableTypes.map((t) => (
            <button
              key={t}
              onClick={() => setFilter(t)}
              className={`rounded-full border px-5 py-2.5 text-[0.78rem] font-medium uppercase tracking-label transition-all duration-300 ${
                filter === t ? "border-or bg-or text-white" : "border-ligne bg-blanc text-encre-muted hover:border-or/50 hover:text-or"
              }`}
            >
              {projectTypeLabels[t]?.[lang] ?? t}
            </button>
          ))}
          <span className="ml-auto self-center text-[0.78rem] uppercase tracking-label text-encre-muted">{list.length} {isEn ? (list.length > 1 ? "projects" : "project") : (list.length > 1 ? "projets" : "projet")}</span>
        </div>
        <div className="grid gap-6 pb-24 md:grid-cols-2 lg:grid-cols-3">
          {list.map((project, i) => (
            <Reveal key={project.slug} delay={(i % 3) * 90}>
              <ProjectCard project={localizeProject(project, lang)} />
            </Reveal>
          ))}
        </div>
      </div>
    </main>
  );
}

function ProjectPage({ project }: { project: Project }) {
  const { lang } = useLang();
  const isEn = lang === "en";
  const heroParallax = useParallax<HTMLDivElement>(0.08);
  const projectDocs = documentsForProject(project.slug);
  const [activeImage, setActiveImage] = useState<number | null>(null);
  const galleryImages = project.gallery;
  const closeGallery = () => setActiveImage(null);
  const showPrev = () => setActiveImage((current) => current === null ? null : (current - 1 + galleryImages.length) % galleryImages.length);
  const showNext = () => setActiveImage((current) => current === null ? null : (current + 1) % galleryImages.length);

  useEffect(() => {
    if (activeImage === null) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeGallery();
      if (event.key === "ArrowLeft") showPrev();
      if (event.key === "ArrowRight") showNext();
    };
    const lenis = (window as unknown as { lenis?: { stop: () => void; start: () => void } }).lenis;
    lenis?.stop();
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      lenis?.start();
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [activeImage]);

  return (
    <main>
      <section className="relative -mt-20 flex min-h-[78vh] items-end overflow-hidden bg-encre text-white">
        <div ref={heroParallax} className="lux-media absolute inset-0 -top-[6%] h-[112%]">
          <img src={project.coverImage ?? project.image} alt={project.title} decoding="async" className="h-full w-full object-cover" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-encre via-encre/55 to-encre/25" />
        <div className="relative mx-auto w-full max-w-[86rem] px-5 pb-16 pt-32 lg:px-8">
          <nav className="mb-6 flex items-center gap-2 text-[0.72rem] uppercase tracking-label text-white/55">
            <button onClick={() => go("/")} className="hover:text-or-clair">{isEn ? "Home" : "Accueil"}</button>
            <ChevronRight size={12} />
            <button onClick={() => go(project.type === "Concession" ? "/concessions" : "/campagnes")} className="hover:text-or-clair">{isEn ? "Projects" : "Projets"}</button>
            <ChevronRight size={12} />
            <span className="text-or-clair">{project.title}</span>
          </nav>
          <span className="inline-flex items-center gap-2 text-eyebrow font-medium uppercase tracking-eyebrow text-or-clair">{project.type} · {project.status}</span>
          <h1 className="mt-4 max-w-4xl font-display text-display-lg font-semibold leading-[1.0]">{project.title}</h1>
          <div className="mt-5 flex items-center gap-2 text-white/70"><MapPin size={17} className="text-or-clair" />{project.location}</div>
          <div className="mt-8 flex flex-wrap gap-3">
            {project.highlights.map((tag) => <span key={tag} className="rounded-full border border-white/20 bg-white/[.06] px-4 py-2 text-sm text-or-pale backdrop-blur-sm">{tag}</span>)}
          </div>
        </div>
      </section>

      <section className="py-16 lg:py-24">
        <div className="mx-auto grid max-w-[86rem] gap-12 px-5 lg:grid-cols-[1fr_360px] lg:px-8">
          <div>
            <Reveal>
              <span className="lux-eyebrow">{isEn ? "The project" : "Le projet"}</span>
              <p className="mt-5 max-w-2xl font-display text-display-sm leading-snug text-encre">{project.summary}</p>
            </Reveal>

            <Reveal className="mt-12">
              <h2 className="mb-6 font-display text-2xl font-semibold">{isEn ? "Key information" : "Informations clés"}</h2>
              <div className="grid gap-4 sm:grid-cols-3">
                {project.details.map((detail) => (
                  <div key={detail} className="flex gap-3 border border-ligne bg-blanc p-5 text-[0.92rem] text-encre-soft shadow-card">
                    <BadgeCheck className="mt-0.5 shrink-0 text-rdc-green" size={18} />{detail}
                  </div>
                ))}
              </div>
            </Reveal>

            <Reveal className="mt-14">
              <h2 className="mb-6 font-display text-2xl font-semibold">{isEn ? "Gallery" : "Galerie"}</h2>
              <div className="grid gap-4 sm:grid-cols-2">
                {galleryImages.map((image, index) => (
                  <button key={image} onClick={() => setActiveImage(index)} className="lux-media group relative rounded-[6px] text-left shadow-card focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-or" aria-label={`${isEn ? "Open image" : "Ouvrir l'image"} ${index + 1}`}>
                    <img src={image} alt={project.title} loading="lazy" decoding="async" className="aspect-[4/3] w-full rounded-[6px] object-cover transition duration-700 ease-lux group-hover:scale-[1.04]" />
                    <span className="absolute bottom-3 right-3 grid h-10 w-10 place-items-center rounded-full bg-encre/70 text-white opacity-0 backdrop-blur-sm transition group-hover:opacity-100"><Maximize2 size={16} /></span>
                  </button>
                ))}
              </div>
            </Reveal>

            {projectDocs.length > 0 && (
              <Reveal className="mt-14">
                <div className="mb-6 flex items-end justify-between gap-4">
                  <h2 className="font-display text-2xl font-semibold">Documents</h2>
                  <button onClick={() => go("/documents")} className="inline-flex items-center gap-1.5 text-[0.74rem] font-medium uppercase tracking-label text-encre-muted transition-colors hover:text-or">{isEn ? "All documents" : "Tous les documents"} <ArrowRight size={14} /></button>
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  {projectDocs.map((doc) => <DocumentItem key={doc.id} doc={doc} />)}
                </div>
              </Reveal>
            )}
          </div>

          <aside className="lg:sticky lg:top-28 lg:h-fit">
            <div className="border border-or/25 bg-blanc p-7 shadow-float">
              <div className="text-[0.7rem] uppercase tracking-label text-encre-muted">{project.location}</div>
              <div className="mt-2 font-display text-4xl font-semibold text-or">{project.price}</div>
              {project.monthly && <p className="mt-1 text-[0.92rem] text-encre-muted">{project.monthly}</p>}
              <div className="my-6 lux-rule" />
              <Button className="w-full" onClick={() => go("/contact")}>{isEn ? "Request the file" : "Demander la fiche"}</Button>
              <Button className="mt-3 w-full" variant="outline" onClick={() => openLina("terrain")}>{isEn ? "A question about this project?" : "Une question sur ce projet ?"}</Button>
              <Button className="mt-3 w-full" variant="ghost" onClick={() => go("/paiement")}>{isEn ? "See payment options" : "Voir le paiement"} <ArrowRight size={15} /></Button>
              <a href={whatsAppUrl} target="_blank" rel="noreferrer" className="mt-5 flex items-center justify-center gap-2 text-[0.74rem] font-medium uppercase tracking-label text-rdc-green transition-colors hover:text-encre"><MessageCircle size={15} />WhatsApp</a>
            </div>
          </aside>
        </div>
      </section>

      <section className="bg-encre py-20 text-white">
        <div className="mx-auto flex max-w-[86rem] flex-col items-start justify-between gap-8 px-5 lg:flex-row lg:items-center lg:px-8">
          <div>
            <h2 className="max-w-2xl font-display text-display-sm font-semibold">{isEn ? `Talk to Luxos about ${project.title}.` : `Parlez à Luxos de ${project.title}.`}</h2>
            <p className="mt-3 max-w-xl text-white/60">{isEn ? "A dedicated advisor answers your questions, shares documents and plans your visit." : "Un conseiller dédié répond à vos questions, partage les documents et planifie votre visite."}</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button size="lg" asChild><a href={whatsAppUrl} target="_blank" rel="noreferrer"><MessageCircle size={18} />{isEn ? "Talk to an advisor" : "Parler à un conseiller"}</a></Button>
            <Button size="lg" variant="light" onClick={() => go("/contact")}>{isEn ? "Contact form" : "Formulaire"}</Button>
          </div>
        </div>
      </section>
      {activeImage !== null && (
        <div data-lenis-prevent className="fixed inset-0 z-[80] bg-encre/95 p-4 text-white" role="dialog" aria-modal="true" aria-label={lang === "en" ? "Image gallery" : "Galerie d'images"}>
          <button className="absolute inset-0 cursor-zoom-out" onClick={closeGallery} aria-label={lang === "en" ? "Close gallery" : "Fermer la galerie"} />
          <div className="relative z-10 mx-auto flex h-full max-w-6xl flex-col">
            <div className="mb-3 flex items-center justify-between gap-4">
              <div>
                <div className="font-display text-2xl">{project.title}</div>
                <div className="text-sm text-white/55">{activeImage + 1} / {galleryImages.length}</div>
              </div>
              <Button size="icon" variant="outline" className="border-white/30 text-white hover:text-or" onClick={closeGallery} aria-label={lang === "en" ? "Close" : "Fermer"}>
                <X size={20} />
              </Button>
            </div>
            <div className="relative min-h-0 flex-1">
              <img src={galleryImages[activeImage]} alt={project.title} className="h-full w-full rounded-lg object-contain" />
              {galleryImages.length > 1 && (
                <>
                  <Button size="icon" className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full" onClick={showPrev} aria-label={lang === "en" ? "Previous image" : "Image précédente"}>
                    <ChevronLeft size={22} />
                  </Button>
                  <Button size="icon" className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full" onClick={showNext} aria-label={lang === "en" ? "Next image" : "Image suivante"}>
                    <ChevronRight size={22} />
                  </Button>
                </>
              )}
            </div>
            {galleryImages.length > 1 && (
              <div className="mt-4 flex gap-3 overflow-x-auto pb-1">
                {galleryImages.map((image, index) => (
                  <button key={image} onClick={() => setActiveImage(index)} className={`h-16 w-24 shrink-0 overflow-hidden rounded border ${activeImage === index ? "border-or" : "border-white/20 opacity-65"}`}>
                    <img src={image} alt="" className="h-full w-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </main>
  );
}

function AboutPage() {
  const { lang } = useLang();
  const isEn = lang === "en";
  const values = isEn
    ? [["Trust", "Official titles, physical office and traceable payments at every step."], ["Scale", "A group structure covering land, construction, management and investment."], ["Local expertise", "Deep knowledge of Kinshasa's land, zones and administrative reality."]]
    : [["Confiance", "Titres officiels, bureau physique et paiements traçables à chaque étape."], ["Envergure", "Une structure de groupe couvrant terrain, construction, gestion et investissement."], ["Expertise locale", "Une connaissance fine du foncier, des zones et de la réalité administrative de Kinshasa."]];
  return (
    <main>
      <section className="pt-28 pb-4 lg:pt-36">
        <div className="mx-auto max-w-[86rem] px-5 lg:px-8">
          <SectionTitle
            sur={isEn ? "About Luxos" : "À propos de Luxos"}
            title={isEn ? "A world-class real-estate group, from Congo." : "Un groupe immobilier d'envergure, né au Congo."}
            text={isEn ? "Luxos RDC helps families, businesses, institutions and the diaspora build, live and pass on real-estate heritage — from serviced plots to turnkey construction and property management." : "Luxos RDC aide les familles, les entreprises, les institutions et la diaspora à bâtir, habiter et transmettre un patrimoine immobilier — de la parcelle viabilisée à la construction clé en main et à la gestion locative."}
            align="left"
            as="h1"
          />
          <div className="grid gap-5 md:grid-cols-3">
            {values.map(([title, text], i) => (
              <Reveal key={title} delay={i * 90} className="border-t border-or/30 pt-6">
                <h3 className="font-display text-2xl font-semibold">{title}</h3>
                <p className="mt-3 text-[0.95rem] leading-relaxed text-encre-muted">{text}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
      <AboutBlock />
      <ProofBlock />
      <Services />
      <FinalCTA />
    </main>
  );
}

function DiasporaPage() {
  const { lang } = useLang();
  const isEn = lang === "en";
  const heroParallax = useParallax<HTMLDivElement>(0.08);

  const journey = isEn
    ? [
        ["Discover", "Browse projects, plans and documents online, with a video tour when needed."],
        ["Choose", "Select a plot or a house with your dedicated advisor, adjusted to your budget."],
        ["Build", "Start a construction project remotely — plans, quote and managed site."],
        ["Pay securely", "Card, mobile money or international transfer, with official receipts."],
        ["Follow progress", "Monthly photos, milestones and a clear decision history."],
        ["Manage remotely", "Rental and property management once your project is delivered."]
      ]
    : [
        ["Découvrir", "Parcourez projets, plans et documents en ligne, avec visite vidéo au besoin."],
        ["Choisir", "Sélectionnez une parcelle ou une maison avec votre conseiller dédié, selon votre budget."],
        ["Construire", "Lancez une construction à distance — plans, devis et chantier encadré."],
        ["Payer en sécurité", "Carte, mobile money ou virement international, avec reçus officiels."],
        ["Suivre l'avancement", "Photos mensuelles, jalons et historique de décision clair."],
        ["Gérer à distance", "Location et gestion locative une fois votre projet livré."]
      ];

  const garanties = isEn
    ? ["Document control", "Field photos & milestones", "Time-zone appointments", "Decision history"]
    : ["Contrôle documentaire", "Photos et jalons terrain", "Rendez-vous fuseau horaire", "Historique de décision"];

  return (
    <main>
      <section className="relative -mt-20 flex min-h-[74vh] items-end overflow-hidden bg-encre text-white">
        <div ref={heroParallax} className="lux-media absolute inset-0 -top-[6%] h-[112%]">
          <img src={assets.citeMerveilles} alt={isEn ? "Aerial view of a Luxos development in Kinshasa" : "Vue aérienne d'un développement Luxos à Kinshasa"} decoding="async" className="h-full w-full object-cover" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-encre via-encre/65 to-encre/30" />
        <div className="relative mx-auto w-full max-w-[86rem] px-5 pb-16 pt-36 lg:px-8">
          <span className="inline-flex items-center gap-3 text-eyebrow font-medium uppercase tracking-eyebrow text-or-clair before:h-px before:w-9 before:bg-or-clair/60">Luxos Diaspora</span>
          <h1 className="mt-5 max-w-4xl font-display text-display-lg font-semibold leading-[1.0]">{isEn ? "Work with Luxos from abroad — without becoming a stranger to your project." : "Travailler avec Luxos depuis l'étranger — sans devenir étranger à votre projet."}</h1>
          <p className="mt-6 max-w-2xl text-lg text-white/75">{isEn ? "From Brussels, Paris, Montréal, London or Johannesburg, Luxos Diaspora is your access layer to the full Luxos ecosystem: buy, build, pay and follow your project remotely. Mboka ezali mosika te." : "Depuis Bruxelles, Paris, Montréal, Londres ou Johannesburg, Luxos Diaspora est votre porte d'accès à tout l'écosystème Luxos : acheter, bâtir, payer et suivre votre projet à distance. Mboka ezali mosika te."}</p>
          <div className="mt-9 flex flex-wrap gap-4">
            <Button size="lg" asChild><a href={whatsAppUrl} target="_blank" rel="noreferrer"><MessageCircle size={18} />{isEn ? "Schedule a WhatsApp call" : "Planifier un appel WhatsApp"}</a></Button>
            <Button size="lg" variant="light" onClick={() => openLina("diaspora")}>{isEn ? "Ask Lina from abroad" : "Interroger Lina depuis l'étranger"}</Button>
          </div>
        </div>
      </section>

      <section className="py-20 lg:py-28">
        <div className="mx-auto max-w-[86rem] px-5 lg:px-8">
          <SectionTitle sur={isEn ? "How it works" : "Comment ça marche"} title={isEn ? "Your project, managed from anywhere." : "Votre projet, piloté depuis partout."} text={isEn ? "The same Luxos ecosystem — with an access layer designed for distance and time zones." : "Le même écosystème Luxos — avec une couche d'accès pensée pour la distance et les fuseaux horaires."} align="left" />
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {journey.map(([title, text], i) => (
              <Reveal key={title} delay={(i % 3) * 90}>
                <div className="group flex h-full gap-5 border border-ligne bg-blanc p-6 shadow-card transition duration-500 ease-lux hover:-translate-y-1 hover:border-or/40 hover:shadow-soft">
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-or-fond font-display text-xl text-or">{i + 1}</span>
                  <div>
                    <h3 className="font-display text-xl font-semibold">{title}</h3>
                    <p className="mt-2 text-[0.92rem] leading-relaxed text-encre-muted">{text}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-creme py-20 lg:py-28">
        <div className="mx-auto grid max-w-[86rem] gap-12 px-5 lg:grid-cols-2 lg:px-8">
          <SectionTitle sur={isEn ? "Anti-fraud" : "Anti-arnaque"} title={isEn ? "Visible guarantees at every step." : "Des garanties visibles à chaque étape."} text={isEn ? "You receive progress proof, identified documents, a single point of contact and full payment traceability." : "Vous recevez des preuves d'avancement, des documents identifiés, un interlocuteur unique et une traçabilité complète du paiement."} align="left" />
          <div className="grid gap-4 sm:grid-cols-2">
            {garanties.map((item, i) => (
              <Reveal key={item} delay={i * 80} className="flex items-center gap-3 border border-ligne bg-blanc p-5 text-encre-soft shadow-card"><ShieldCheck className="shrink-0 text-rdc-green" size={20} strokeWidth={1.75} />{item}</Reveal>
            ))}
          </div>
        </div>
      </section>

      <DiasporaTeaser />
      <ContactPage embedded />
    </main>
  );
}

function PaymentPage() {
  const { lang } = useLang();
  const isEn = lang === "en";
  return (
    <main className="pt-20 lg:pt-24">
      <PaymentBlock />
      <div className="mx-auto max-w-3xl px-5 pb-24">
        <div className="border border-ligne bg-blanc p-8 text-center shadow-card md:p-11">
          <h2 className="font-display text-display-sm font-semibold">{isEn ? "Make a payment" : "Effectuer un paiement"}</h2>
          <p className="mx-auto mt-4 max-w-2xl leading-relaxed text-encre-muted">
            {isEn ? "To finalise a payment, send your reference, full name and the campaign concerned to the Luxos team on WhatsApp — you'll receive an official receipt." : "Pour finaliser un paiement, envoyez votre référence, votre nom complet et la campagne concernée à l'équipe Luxos sur WhatsApp — vous recevez un reçu officiel."}
          </p>
          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <Button asChild><a href={whatsAppUrl} target="_blank" rel="noreferrer"><MessageCircle size={16} />{isEn ? "Pay via WhatsApp" : "Payer via WhatsApp"}</a></Button>
            <Button variant="outline" onClick={() => openLina("payer")}>{isEn ? "Ask Lina" : "Demander à Lina"}</Button>
          </div>
        </div>
      </div>
    </main>
  );
}

function DocumentsPage() {
  const { lang } = useLang();
  const isEn = lang === "en";
  const [activeCat, setActiveCat] = useState<DocCategory | "all">("all");
  const [query, setQuery] = useState("");

  const q = query.trim().toLowerCase();
  const filtered = documents.filter((doc) => {
    const matchCat = activeCat === "all" || doc.category === activeCat;
    const matchQuery = !q || `${doc.title[lang]} ${doc.description?.[lang] ?? ""}`.toLowerCase().includes(q);
    return matchCat && matchQuery;
  });

  const cats: { id: DocCategory | "all"; label: string }[] = [
    { id: "all", label: isEn ? "All" : "Tous" },
    ...docCategories.map((c) => ({ id: c.id, label: c.label[lang] }))
  ];

  return (
    <main className="pt-28 lg:pt-36">
      <div className="mx-auto max-w-[86rem] px-5 lg:px-8">
        <SectionTitle
          sur={isEn ? "Documentation center" : "Centre de documentation"}
          title={isEn ? "Documents, rules, plans and brochures." : "Documents, règlements, plans et brochures."}
          text={isEn ? "Every Luxos document in one place — view or download regulations, investment sheets, zone plans and campaign brochures." : "Tous les documents Luxos au même endroit — consultez ou téléchargez règlements, fiches d'investissement, plans de zone et brochures de campagne."}
          align="left"
          as="h1"
        />

        <div className="mb-10 flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap gap-2">
            {cats.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCat(cat.id)}
                className={`rounded-full border px-5 py-2.5 text-[0.76rem] font-medium uppercase tracking-label transition-all duration-300 ${
                  activeCat === cat.id ? "border-or bg-or text-white" : "border-ligne bg-blanc text-encre-muted hover:border-or/50 hover:text-or"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
          <div className="relative w-full lg:w-72">
            <Search size={17} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-encre-muted" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={isEn ? "Search documents..." : "Rechercher un document..."}
              className="lux-input pl-11"
            />
          </div>
        </div>

        {filtered.length > 0 ? (
          <div className="grid gap-4 pb-24 md:grid-cols-2">
            {filtered.map((doc, i) => (
              <Reveal key={doc.id} delay={(i % 2) * 80}><DocumentItem doc={doc} /></Reveal>
            ))}
          </div>
        ) : (
          <div className="border border-ligne bg-blanc p-12 pb-24 text-center text-encre-muted">
            <FileText size={32} className="mx-auto mb-4 text-or/50" strokeWidth={1.5} />
            <p>{isEn ? "No document matches your search." : "Aucun document ne correspond à votre recherche."}</p>
            <Button variant="ghost" className="mt-4" onClick={() => { setActiveCat("all"); setQuery(""); }}>{isEn ? "Reset filters" : "Réinitialiser"}</Button>
          </div>
        )}

        <div className="mb-24 border border-ligne bg-creme p-8 text-center">
          <p className="text-encre-soft">{isEn ? "Looking for a specific file? Lina or a Luxos advisor can share it with you." : "Vous cherchez un document précis ? Lina ou un conseiller Luxos peut vous le transmettre."}</p>
          <div className="mt-5 flex flex-wrap justify-center gap-3">
            <Button onClick={() => openLina("infos")}>{isEn ? "Ask Lina" : "Demander à Lina"}</Button>
            <Button variant="outline" asChild><a href={whatsAppUrl} target="_blank" rel="noreferrer"><MessageCircle size={16} />WhatsApp</a></Button>
          </div>
        </div>
      </div>
    </main>
  );
}

const faqEn: [string, string][] = [
  ["Can I buy from abroad?", "Yes. Luxos Diaspora offers remote support, appointments matched to your time zone and full document follow-up."],
  ["What payment methods are available?", "Luxos Cash lets you pay in one instalment. Luxos Green lets you spread payment at 0% interest, subject to the offer's conditions."],
  ["How can I verify a plot is safe?", "Luxos supports the commercial, administrative and document steps to limit risk and clarify the purchase."],
  ["Does Lina use AI?", "For this version, Lina runs on scripted scenarios. The code is isolated so an AI API can be connected later."]
];

function FAQPage() {
  const { lang } = useLang();
  const isEn = lang === "en";
  const items = isEn ? faqEn : faq;
  const [open, setOpen] = useState(0);
  return (
    <main className="pt-28 lg:pt-36">
      <div className="mx-auto max-w-3xl px-5 pb-24">
        <SectionTitle sur="FAQ" title={isEn ? "Frequently asked questions" : "Questions fréquentes"} text={isEn ? "The essentials about buying, building, paying and the diaspora journey." : "L'essentiel sur l'achat, la construction, le paiement et le parcours diaspora."} align="left" as="h1" />
        <div className="divide-y divide-ligne border-y border-ligne">
          {items.map(([q, a], i) => {
            const isOpen = open === i;
            return (
              <div key={q}>
                <button className="flex w-full items-center justify-between gap-6 py-6 text-left" onClick={() => setOpen(isOpen ? -1 : i)} aria-expanded={isOpen}>
                  <span className="font-display text-xl font-semibold text-encre">{q}</span>
                  <span className={`grid h-8 w-8 shrink-0 place-items-center rounded-full border border-or/30 text-or transition-transform duration-300 ${isOpen ? "rotate-45" : ""}`}>+</span>
                </button>
                <div className={`grid transition-all duration-500 ease-lux ${isOpen ? "grid-rows-[1fr] pb-6" : "grid-rows-[0fr]"}`}>
                  <div className="overflow-hidden text-[1.02rem] leading-relaxed text-encre-muted">{a}</div>
                </div>
              </div>
            );
          })}
        </div>
        <div className="mt-12 border border-ligne bg-creme p-8 text-center">
          <p className="text-encre-soft">{isEn ? "Still have a question?" : "Une autre question ?"}</p>
          <div className="mt-4 flex flex-wrap justify-center gap-3">
            <Button onClick={() => openLina("infos")}>{isEn ? "Ask Lina" : "Demander à Lina"}</Button>
            <Button variant="outline" onClick={() => go("/contact")}>{isEn ? "Contact us" : "Nous contacter"}</Button>
          </div>
        </div>
      </div>
    </main>
  );
}

function ContactPage({ embedded = false }: { embedded?: boolean }) {
  const { lang } = useLang();
  const isEn = lang === "en";
  const [sent, setSent] = useState(false);
  const Heading = embedded ? "h2" : "h1";
  return (
    <section className={embedded ? "bg-encre py-20 text-white lg:py-28" : "pt-28 pb-24 lg:pt-36"}>
      <div className="mx-auto grid max-w-[86rem] items-center gap-12 px-5 lg:grid-cols-[.85fr_1.15fr] lg:px-8">
        <div>
          <span className={`mb-4 inline-flex items-center gap-3 text-eyebrow font-medium uppercase tracking-eyebrow ${embedded ? "text-or-clair" : "text-or-deep"} before:h-px before:w-9 before:bg-or/50`}>Contact</span>
          <Heading className="font-display text-display-md font-semibold leading-tight">{embedded ? (isEn ? "Talk to a diaspora advisor." : "Parlez à un conseiller diaspora.") : (isEn ? "Contact Luxos RDC." : "Contactez Luxos RDC.")}</Heading>
          <div className={`mt-8 grid gap-4 text-[0.95rem] ${embedded ? "text-white/80" : "text-encre-soft"}`}>
            <a href="tel:+243840080000" className="flex items-center gap-3 hover:text-or"><Phone size={18} className="shrink-0 text-or" />+243 840 080 000 · +243 970 002 565</a>
            <div className="flex items-center gap-3"><MapPin size={18} className="shrink-0 text-or" />6, avenue Likasi, Quartier Royal, Kinshasa-Gombe</div>
            <a href="mailto:contactrdc@luxos.co.za" className="flex items-center gap-3 hover:text-or"><Mail size={18} className="shrink-0 text-or" />contactrdc@luxos.co.za</a>
          </div>
          <a href={whatsAppUrl} target="_blank" rel="noreferrer" className={`mt-7 inline-flex items-center gap-2 rounded-[3px] border px-5 py-3 text-[0.78rem] font-medium uppercase tracking-label transition-colors duration-300 ${embedded ? "border-white/25 text-white hover:border-or hover:text-or-clair" : "border-encre/20 text-encre hover:border-or hover:text-or"}`}><MessageCircle size={16} />WhatsApp</a>
        </div>
        <Card>
          <CardContent className="p-8">
            {sent ? (
              <div className="py-12 text-center text-encre"><CheckCircle2 className="mx-auto mb-4 text-rdc-green" size={48} /><h3 className="font-display text-3xl">{isEn ? "Request received" : "Demande reçue"}</h3><p className="mt-2 text-encre-muted">{isEn ? "A Luxos advisor will get back to you." : "Un conseiller Luxos vous recontactera."}</p></div>
            ) : (
              <form className="grid gap-4" onSubmit={async (e) => { e.preventDefault(); const form = new FormData(e.currentTarget); await fetch("/api/leads", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(Object.fromEntries(form)) }).catch(() => null); setSent(true); }}>
                <input type="hidden" name="source" value={embedded ? "diaspora" : "contact"} />
                <input name="name" required placeholder={isEn ? "Full name" : "Nom complet"} className="lux-input" />
                <input name="email" type="email" required placeholder="Email" className="lux-input" />
                <input name="phone" required placeholder={isEn ? "Phone / WhatsApp" : "Téléphone / WhatsApp"} className="lux-input" />
                <select name="interest" className="lux-input" defaultValue="Diaspora" aria-label={isEn ? "Your interest" : "Votre intérêt"}>
                  {["Diaspora", "Azur", "Luxos Hills", "Muasi ya Talo", "Cité des Merveilles", "Péage", "Luxos C", "Construction", "Paiement"].map((i) => <option key={i}>{i}</option>)}
                </select>
                <textarea name="message" placeholder={isEn ? "Tell us about your project" : "Votre besoin"} className="lux-input min-h-28" />
                <Button type="submit">{isEn ? "Send request" : "Envoyer la demande"}</Button>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </section>
  );
}

type ChatOption = {
  label: string;
  action: () => void;
};

type ChatMessage = {
  from: "bot" | "user";
  html?: string;
  text?: string;
  card?: {
    icon: string;
    name: string;
    location: string;
    price: string;
  };
};

function LinaChat() {
  const { lang } = useLang();
  const isEn = lang === "en";
  const c = copy[lang];
  const [open, setOpen] = useState(false);
  const [started, setStarted] = useState(false);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [options, setOptions] = useState<ChatOption[]>([]);
  const chatBodyRef = useRef<HTMLDivElement | null>(null);

  const addUser = (text: string) => setMessages((current) => [...current, { from: "user", text }]);
  const addBot = (html: string, card?: ChatMessage["card"], delay = 420) => {
    setTyping(true);
    window.setTimeout(() => {
      setTyping(false);
      setMessages((current) => [...current, { from: "bot", html, card }]);
    }, delay);
  };
  const showOptions = (items: ChatOption[]) => window.setTimeout(() => setOptions(items), 480);

  function choose(label: string, action: () => void) {
    addUser(label);
    setOptions([]);
    action();
  }

  function menuPrincipal() {
    showOptions([
      { label: isEn ? "▦ Buy land" : "▦ Acheter un terrain", action: flowTerrain },
      { label: isEn ? "⌂ Build a house" : "⌂ Construire une maison", action: flowConstruire },
      { label: isEn ? "⌂ Rent / manage a property" : "⌂ Louer / faire gérer un bien", action: flowLocation },
      { label: isEn ? "$ Simulate a payment" : "$ Simuler un paiement", action: flowPaiement },
      { label: isEn ? "✈ I buy from abroad" : "✈ J'achète depuis l'étranger", action: flowDiaspora },
      { label: isEn ? "Quick info" : "Infos rapides", action: infosRapides }
    ]);
  }

  function demarrer(topic?: string) {
    if (!started) {
      setMessages([]);
      setStarted(true);
      addBot(isEn ? "Hello! I am <b>Lina</b>, your Luxos assistant. I can help you find the right property, simulate a payment or plan a visit. How can I help?" : "Bonjour ! Je suis <b>Lina</b>, votre assistante Luxos. Je vous aide à trouver le bon bien, simuler un paiement ou planifier une visite. Que puis-je faire pour vous ?");
      window.setTimeout(() => {
        if (topic) routeTopic(topic);
        else menuPrincipal();
      }, 520);
      return;
    }
    if (topic) routeTopic(topic);
  }

  function routeTopic(topic: string) {
    const actions: Record<string, () => void> = {
      cash: flowPaiement,
      green: flowPaiement,
      payer: flowPaiement,
      terrain: flowTerrain,
      diaspora: flowDiaspora,
      construire: flowConstruire,
      garanties,
      infos: infosRapides
    };
    actions[topic]?.();
  }

  function infosRapides() {
    addBot(isEn ? "I can give you the essentials without overloading you. Choose a topic:" : "Je peux vous donner l'essentiel, sans vous charger. Choisissez un sujet :");
    showOptions([
      { label: isEn ? "Available campaigns" : "Campagnes disponibles", action: infoCampagnes },
      { label: isEn ? "Concessions" : "Concessions", action: infoConcessions },
      { label: isEn ? "Payment" : "Paiement", action: infoPaiement },
      { label: isEn ? "Documents" : "Documents", action: infoDocuments },
      { label: isEn ? "Luxos contact" : "Contact Luxos", action: infoContact },
      { label: isEn ? "← Menu" : "← Menu", action: menuPrincipal }
    ]);
  }

  function infoCampagnes() {
    addBot(isEn ? "<b>Luxos campaigns</b><br>• Azur: guided land purchase<br>• Luxos Hills: premium residential program<br>• Muasi ya Talo 2026: heritage campaign for women and families<br>• Maison CDM: build at Cité des Merveilles" : "<b>Campagnes Luxos</b><br>• Azur : achat terrain accompagné<br>• Luxos Hills : résidentiel premium<br>• Muasi ya Talo 2026 : campagne patrimoniale dédiée aux femmes et familles<br>• Maison CDM : construire à Cité des Merveilles");
    showOptions([{ label: isEn ? "View campaigns" : "Voir les campagnes", action: () => go("/campagnes") }, { label: isEn ? "Talk to an advisor" : "Parler à un conseiller", action: openWhatsApp }, { label: "← Infos", action: infosRapides }]);
  }

  function infoConcessions() {
    addBot(isEn ? "<b>Concessions</b><br>• Cité des Merveilles: organized concession to build and transfer heritage<br>• Péage: accessible lots, rules and ROI available<br>• Luxos C: land opportunities with support" : "<b>Concessions</b><br>• Cité des Merveilles : concession structurée pour bâtir et transmettre<br>• Péage : lots accessibles, règlement et ROI disponibles<br>• Luxos C : opportunités foncières avec accompagnement");
    showOptions([{ label: isEn ? "View concessions" : "Voir les concessions", action: () => go("/concessions") }, { label: isEn ? "Talk to an advisor" : "Parler à un conseiller", action: openWhatsApp }, { label: "← Infos", action: infosRapides }]);
  }

  function infoPaiement() {
    addBot(isEn ? "<b>Payment</b><br>Luxos Cash lets you pay in one instalment. Luxos Green lets you spread payment up to 24 months at <b>0% interest</b>. Methods: Visa/Mastercard, M-Pesa, Orange Money, Airtel Money, international transfer." : "<b>Paiement</b><br>Luxos Cash pour payer en une fois. Luxos Green pour échelonner jusqu'à 24 mois à <b>0 % d'intérêt</b>. Moyens : Visa/Mastercard, M-Pesa, Orange Money, Airtel Money, virement international.");
    showOptions([{ label: isEn ? "Simulate payment" : "Simuler un paiement", action: flowPaiement }, { label: isEn ? "Pay via WhatsApp" : "Payer via WhatsApp", action: openWhatsApp }, { label: "← Infos", action: infosRapides }]);
  }

  function infoDocuments() {
    addBot(isEn ? "<b>Documents</b><br>You can access rules, ROI, campaign sheets and plans. For a specific file, Lina can connect you with the Luxos team." : "<b>Documents</b><br>Vous pouvez consulter les règlements, ROI, fiches campagnes et plans. Pour un dossier précis, Lina vous met en relation avec l'équipe Luxos.");
    showOptions([{ label: isEn ? "View documents" : "Voir documents", action: () => go("/documents") }, { label: isEn ? "Request a document" : "Demander un document", action: openWhatsApp }, { label: "← Infos", action: infosRapides }]);
  }

  function infoContact() {
    addBot(isEn ? "<b>Luxos RDC contact</b><br>WhatsApp: +243 840 080 000<br>Email: contactrdc@luxos.co.za<br>Office: 6 avenue Likasi, Quartier Royal, Kinshasa-Gombe" : "<b>Contact Luxos RDC</b><br>WhatsApp : +243 840 080 000<br>Email : contactrdc@luxos.co.za<br>Bureau : 6, avenue Likasi, Quartier Royal, Kinshasa-Gombe");
    showOptions([{ label: isEn ? "Open WhatsApp" : "Ouvrir WhatsApp", action: openWhatsApp }, { label: isEn ? "Contact page" : "Page contact", action: () => go("/contact") }, { label: "← Infos", action: infosRapides }]);
  }

  function openWhatsApp() {
    window.open(whatsAppUrl, "_blank", "noopener,noreferrer");
  }

  function flowTerrain() {
    addBot(isEn ? "Excellent choice! What budget are you considering for your land?" : "Excellent choix ! Quel budget envisagez-vous pour votre terrain ?");
    showOptions([
      { label: isEn ? "Under $10,000" : "Moins de 10 000 $", action: proposerTerrain },
      { label: "$10,000 - $30,000", action: proposerTerrain },
      { label: isEn ? "Over $30,000" : "Plus de 30 000 $", action: proposerTerrain }
    ]);
  }

  function proposerTerrain() {
    addBot(isEn ? "Here is our most requested plot, with a verified land title:" : "Voici notre parcelle la plus demandée, avec titre foncier vérifié :", { icon: "▦", name: "Parcelle Azur", location: "Cité des Merveilles · 500 m²", price: "4 500 $" });
    window.setTimeout(() => addBot(isEn ? "Payable <b>in one go (-8%)</b> or over <b>24 instalments at 0%</b> (about $187/month). What would you like?" : "Payable <b>en une fois (-8 %)</b> ou en <b>24 mensualités à 0 %</b> (environ 187 $/mois). Que souhaitez-vous ?"), 650);
    showOptions([
      { label: isEn ? "Book a visit" : "Planifier une visite", action: planifier },
      { label: isEn ? "Simulate payment" : "Simuler le paiement", action: flowPaiement },
      { label: isEn ? "← Menu" : "← Menu", action: menuPrincipal }
    ]);
  }

  function flowConstruire() {
    addBot(isEn ? "We build your turnkey home with a <b>10-year guarantee</b>. How many bedrooms would you like?" : "Nous construisons votre maison clé en main avec <b>garantie 10 ans</b>. Combien de chambres souhaitez-vous ?");
    showOptions([
      { label: isEn ? "2 to 3 bedrooms" : "2 à 3 chambres", action: proposerVilla },
      { label: isEn ? "4 bedrooms and more" : "4 chambres et +", action: proposerVilla }
    ]);
  }

  function proposerVilla() {
    addBot(isEn ? "Our Villa Tonga is ideal to start:" : "Notre Villa Tonga est idéale pour démarrer :", { icon: "⌂", name: isEn ? "Villa Tonga 3bed" : "Villa Tonga 3ch", location: "Luxos Hills · 220 m²", price: "68 000 $" });
    window.setTimeout(() => addBot(isEn ? "Would you like to receive the detailed plans and a personalised quote?" : "Souhaitez-vous recevoir les plans détaillés et un devis personnalisé ?"), 650);
    showOptions([
      { label: isEn ? "Yes, send the plans" : "Oui, recevoir les plans", action: collecter },
      { label: isEn ? "Simulate payment" : "Simuler le paiement", action: flowPaiement },
      { label: "← Menu", action: menuPrincipal }
    ]);
  }

  function flowLocation() {
    addBot(isEn ? "With pleasure. Are you looking to <b>rent a property</b>, or to <b>hand over the management</b> of a property you own?" : "Avec plaisir. Cherchez-vous à <b>louer un bien</b>, ou à <b>confier la gestion</b> d'un bien que vous possédez ?");
    showOptions([
      { label: isEn ? "I'm looking to rent" : "Je cherche à louer", action: collecter },
      { label: isEn ? "Hand over management" : "Confier la gestion", action: collecter },
      { label: "← Menu", action: menuPrincipal }
    ]);
  }

  function flowDiaspora() {
    addBot(isEn ? "You live abroad? No problem, you can become an owner 100% remotely. Which city do you live in? I'll adapt to your time zone." : "Vous vivez à l'étranger ? Aucun souci, vous pouvez devenir propriétaire à 100 % à distance. Dans quelle ville vivez-vous ? Je m'adapte à votre fuseau.");
    showOptions([
      { label: "Bruxelles / Paris", action: apresVille },
      { label: isEn ? "London / UK" : "Londres / UK", action: apresVille },
      { label: "Johannesburg / SA", action: apresVille },
      { label: isEn ? "Another city" : "Autre ville", action: apresVille }
    ]);
  }

  function apresVille() {
    addBot(isEn ? "Here is how it works:<br>1. Virtual tour + plans<br>2. You receive the <b>verified land title</b><br>3. Secure payment (transfer/card/mobile money)<br>4. Monthly photo follow-up" : "Voici comment ça se passe :<br>1. Visite virtuelle + plans<br>2. Vous recevez le <b>titre foncier vérifié</b><br>3. Paiement sécurisé (virement/carte/mobile money)<br>4. Suivi photo chaque mois");
    window.setTimeout(() => addBot(isEn ? "What are you interested in?" : "Qu'est-ce qui vous intéresse ?"), 650);
    showOptions([
      { label: isEn ? "▦ Land" : "▦ Un terrain", action: flowTerrain },
      { label: isEn ? "⌂ A turnkey home" : "⌂ Une maison clé en main", action: flowConstruire },
      { label: isEn ? "$ See payments" : "$ Voir les paiements", action: flowPaiement },
      { label: isEn ? "Anti-fraud guarantees" : "Garanties anti-arnaque", action: garanties }
    ]);
  }

  function garanties() {
    addBot(isEn ? "Great question. Here are our guarantees:<br>⬢ <b>Official land title</b> sent before any payment<br>◉ <b>Physical office</b> you can visit in Gombe<br>⊟ <b>Contract + official receipts</b> at every instalment" : "Très bonne question. Voici nos garanties :<br>⬢ <b>Titre foncier officiel</b> envoyé avant tout paiement<br>◉ <b>Bureau physique</b> visitable à Gombe<br>⊟ <b>Contrat + reçus officiels</b> à chaque versement");
    window.setTimeout(() => addBot(isEn ? "You, or a relative in the DRC, can verify everything at the land registry. Would you like to talk to an advisor?" : "Vous, ou un proche en RDC, pouvez tout vérifier au cadastre. Souhaitez-vous parler à un conseiller ?"), 700);
    showOptions([
      { label: isEn ? "Talk to an advisor" : "Parler à un conseiller", action: openWhatsApp },
      { label: "← Menu", action: menuPrincipal }
    ]);
  }

  function flowPaiement() {
    addBot(isEn ? "With <b>Luxos Green</b>, pay in instalments at <b>0% interest</b>. Example: a $4,500 plot, 20% down over 24 months:" : "Avec <b>Luxos Green</b>, payez en plusieurs fois à <b>0 % d'intérêt</b>. Exemple : parcelle de 4 500 $, 20 % d'apport sur 24 mois :");
    window.setTimeout(() => addBot(isEn ? "Down payment: <b>$900</b><br>Monthly: <b>$150</b><br>Interest: <b>$0</b>" : "Apport : <b>900 $</b><br>Mensualité : <b>150 $</b><br>Intérêts : <b>0 $</b>"), 650);
    window.setTimeout(() => addBot(isEn ? "How would you prefer to pay?" : "Comment préférez-vous payer ?"), 1100);
    showOptions([
      { label: "M-Pesa / Orange / Airtel", action: collecter },
      { label: isEn ? "Bank card" : "Carte bancaire", action: collecter },
      { label: isEn ? "International transfer" : "Virement international", action: collecter },
      { label: "← Menu", action: menuPrincipal }
    ]);
  }

  function planifier() {
    addBot(isEn ? "With pleasure! Would you prefer a <b>physical visit</b> in Kinshasa or a <b>virtual visit</b> by video call, ideal from abroad?" : "Avec plaisir ! Préférez-vous une <b>visite physique</b> à Kinshasa ou une <b>visite virtuelle</b> en visio, idéale depuis l'étranger ?");
    showOptions([
      { label: isEn ? "Physical visit" : "Visite physique", action: collecter },
      { label: isEn ? "Virtual visit" : "Visite virtuelle", action: collecter }
    ]);
  }

  function collecter() {
    addBot(isEn ? "Perfect. So a dedicated advisor can call you back quickly, leave me your <b>WhatsApp number</b> below. I'll pass on our whole conversation — you won't have to repeat anything." : "Parfait. Pour qu'un conseiller dédié vous recontacte rapidement, laissez-moi votre <b>numéro WhatsApp</b> ci-dessous. Je transmets tout notre échange, vous n'aurez rien à répéter.");
  }

  function envoyer() {
    const value = input.trim();
    if (!value) return;
    addUser(value);
    setInput("");
    if (/\d{6,}/.test(value.replace(/\s/g, ""))) {
      const transcript = [
        ...messages.map((m) => `${m.from === "bot" ? "Lina" : "Client"}: ${(m.text ?? m.html ?? "").replace(/<[^>]+>/g, " ").trim()}`),
        `Client: ${value}`
      ]
        .join("\n")
        .slice(0, 3500);
      fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: "Contact Lina", phone: value, interest: "Lina", message: transcript, source: "lina" })
      }).catch(() => null);
      addBot(isEn ? "Thank you! A Luxos advisor will contact you on WhatsApp shortly." : "Merci ! Un conseiller Luxos vous contacte sur WhatsApp dans les <b>prochaines minutes</b>.");
      showOptions([{ label: isEn ? "← Back to menu" : "← Retour au menu", action: menuPrincipal }]);
      return;
    }
    addBot(isEn ? "Good question. I can point you in the right direction quickly, or open WhatsApp with the Luxos team." : "Bonne question. Je peux vous orienter rapidement ou ouvrir WhatsApp avec l'équipe Luxos.");
    showOptions([
      { label: isEn ? "Talk to an advisor" : "Parler à un conseiller", action: openWhatsApp },
      { label: isEn ? "Quick info" : "Infos rapides", action: infosRapides },
      { label: "← Menu", action: menuPrincipal }
    ]);
  }

  useEffect(() => {
    const handler = (event: Event) => {
      const topic = (event as CustomEvent<string | undefined>).detail;
      setOpen(true);
      window.setTimeout(() => demarrer(topic), 0);
    };
    window.addEventListener("lina:open", handler);
    return () => window.removeEventListener("lina:open", handler);
  });

  useEffect(() => {
    if (!open) return;
    const body = chatBodyRef.current;
    if (!body) return;
    body.scrollTo({ top: body.scrollHeight, behavior: "smooth" });
  }, [messages, options, typing, open]);

  return (
    <>
      {!open && (
        <button
          className="group fixed bottom-5 right-5 z-50 flex items-center gap-3 rounded-full bg-encre py-2.5 pl-2.5 pr-3 text-white shadow-float transition-all duration-500 ease-lux hover:bg-or sm:pr-5"
          onClick={() => { setOpen(true); demarrer(); }}
          aria-label={isEn ? "Chat with Lina, Luxos assistant" : "Discuter avec Lina, assistante Luxos"}
        >
          <span className="relative grid h-11 w-11 place-items-center rounded-full bg-or font-display text-lg transition-colors duration-500 group-hover:bg-encre">
            L
            <span className="absolute inset-0 rounded-full border border-or/50 animate-pulseRing" />
          </span>
          <span className="hidden text-left sm:block">
            <span className="block font-display text-[0.98rem] leading-tight">{isEn ? "Chat with Lina" : "Discuter avec Lina"}</span>
            <span className="flex items-center gap-1.5 text-[0.66rem] uppercase tracking-label text-or-clair transition-colors group-hover:text-white/90"><span className="h-1.5 w-1.5 rounded-full bg-rdc-green" />{isEn ? "Online" : "En ligne"}</span>
          </span>
        </button>
      )}
      {open && (
        <div className="fixed bottom-5 right-5 z-50 flex h-[620px] max-h-[calc(100vh-40px)] w-[400px] max-w-[calc(100vw-28px)] flex-col overflow-hidden rounded-lg border border-ligne bg-ivoire shadow-float">
          <div className="flex items-center gap-3 border-b border-white/10 bg-encre p-4 text-white">
            <div className="relative grid h-11 w-11 place-items-center rounded-full bg-or font-display text-xl">L<span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-encre bg-rdc-green" /></div>
            <div>
              <div className="font-display text-xl leading-tight">Lina · Luxos</div>
              <div className="flex items-center gap-2 text-[0.7rem] uppercase tracking-label text-or-clair"><span className="h-1.5 w-1.5 rounded-full bg-rdc-green" />{c.online}</div>
            </div>
            <button className="ml-auto grid h-9 w-9 place-items-center rounded-[3px] text-white/60 transition-colors hover:bg-white/10 hover:text-white" onClick={() => setOpen(false)} aria-label={isEn ? "Close" : "Fermer"}><X size={18} /></button>
          </div>
          <div ref={chatBodyRef} data-lenis-prevent className="flex-1 space-y-3 overflow-y-auto bg-creme p-4">
            {messages.map((m, i) => (
              <div key={`${m.from}-${i}`} className={m.from === "bot" ? "mr-8 rounded-lg rounded-bl-[2px] border border-ligne bg-blanc p-3.5 text-[0.9rem] leading-relaxed text-encre-soft shadow-[0_1px_0_rgba(22,20,15,.03)]" : "ml-8 rounded-lg rounded-br-[2px] bg-or p-3.5 text-[0.9rem] leading-relaxed text-white"}>
                {m.html && <span dangerouslySetInnerHTML={{ __html: m.html }} />}
                {m.text}
                {m.card && (
                  <div className="mt-3 overflow-hidden rounded-[6px] border border-ligne bg-blanc shadow-soft">
                    <div className="grid h-24 place-items-center bg-gradient-to-br from-creme to-or-fond text-4xl text-or">{m.card.icon}</div>
                    <div className="p-4">
                      <div className="font-display text-xl font-semibold text-encre">{m.card.name}</div>
                      <div className="mt-0.5 text-[0.68rem] uppercase tracking-label text-encre-muted">{m.card.location}</div>
                      <div className="mt-2 font-display text-2xl font-semibold text-or">{m.card.price}</div>
                      <button onClick={planifier} className="mt-3 w-full rounded-[3px] bg-encre px-3 py-2.5 text-[0.7rem] font-medium uppercase tracking-label text-white transition-colors hover:bg-or">{isEn ? "Book a visit" : "Planifier une visite"}</button>
                    </div>
                  </div>
                )}
              </div>
            ))}
            {typing && <div className="mr-8 flex w-fit gap-1 rounded-lg rounded-bl-[2px] border border-ligne bg-blanc px-4 py-3.5"><span className="h-1.5 w-1.5 animate-bounce rounded-full bg-or" /><span className="h-1.5 w-1.5 animate-bounce rounded-full bg-or [animation-delay:.15s]" /><span className="h-1.5 w-1.5 animate-bounce rounded-full bg-or [animation-delay:.3s]" /></div>}
            {options.length > 0 && <div className="grid gap-2 pt-1">{options.map((option) => <button key={option.label} onClick={() => choose(option.label, option.action)} className="w-fit rounded-full border border-or/40 bg-blanc px-4 py-2 text-left text-[0.86rem] text-or transition-colors duration-300 hover:bg-or hover:text-white">{option.label}</button>)}</div>}
          </div>
          <div className="flex gap-2 border-t border-ligne bg-ivoire p-3">
            <input value={input} onChange={(event) => setInput(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter") envoyer(); }} className="min-w-0 flex-1 rounded-full border border-encre/15 bg-blanc px-4 py-3 text-[0.9rem] outline-none transition-colors focus:border-or" placeholder={isEn ? "Type your message..." : "Écrivez votre message..."} />
            <button onClick={envoyer} className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-or text-white transition-colors hover:bg-encre" aria-label={isEn ? "Send" : "Envoyer"}><Send size={18} /></button>
          </div>
          <div className="bg-ivoire px-4 pb-3 text-center text-[0.78rem] text-encre-muted">{isEn ? "Prefer to talk?" : "Préférez parler ?"} <a className="font-medium text-rdc-green transition-colors hover:text-encre" href={whatsAppUrl} target="_blank" rel="noreferrer">{isEn ? "Continue on WhatsApp →" : "Continuer sur WhatsApp →"}</a></div>
        </div>
      )}
    </>
  );
}

function Footer() {
  const { lang } = useLang();
  const isEn = lang === "en";

  const exploreLinks: [string, string][] = isEn
    ? [["Home", "/"], ["Campaigns", "/campagnes"], ["Concessions", "/concessions"], ["Construction", "/services"], ["Payment", "/paiement"]]
    : [["Accueil", "/"], ["Campagnes", "/campagnes"], ["Concessions", "/concessions"], ["Construction", "/services"], ["Paiement", "/paiement"]];
  const companyLinks: [string, string][] = isEn
    ? [["About", "/a-propos"], ["Diaspora", "/diaspora"], ["FAQ", "/faq"], ["Contact", "/contact"]]
    : [["À propos", "/a-propos"], ["Diaspora", "/diaspora"], ["FAQ", "/faq"], ["Contact", "/contact"]];
  const documentLinks = [
    { label: isEn ? "CDM concession rules" : "Règlement concession CDM", href: "/documents/reglement-concession-cite-des-merveilles.pdf" },
    { label: "ROI Concession Péage", href: "/documents/roi-concession-peage.pdf" },
    { label: isEn ? "Document center" : "Centre de documentation", href: "/documents", internal: true }
  ];

  return (
    <footer className="relative overflow-hidden bg-encre text-white/60">
      <div className="mx-auto max-w-[86rem] px-5 pt-20 lg:px-8">
        <div className="grid gap-12 pb-16 md:grid-cols-2 lg:grid-cols-[1.8fr_1fr_1fr_1.4fr]">
          <div className="max-w-sm">
            <img src={assets.logo} alt="Luxos RDC" className="mb-6 h-14 w-auto brightness-0 invert" />
            <p className="font-display text-[1.4rem] leading-snug text-white/85">
              {isEn ? "Building, living and passing on heritage in the DRC." : "Bâtir, habiter et transmettre en RDC."}
            </p>
            <div className="mt-7 flex gap-3">
              {socialLinks.map(({ label, href, Icon }) => (
                <a key={label} href={href} target="_blank" rel="noreferrer" aria-label={label} className="grid h-10 w-10 place-items-center rounded-[3px] border border-white/15 text-white/70 transition-colors duration-300 hover:border-or hover:text-or-clair">
                  <Icon size={17} />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="mb-5 text-eyebrow font-medium uppercase tracking-eyebrow text-or-clair">{isEn ? "Explore" : "Explorer"}</h4>
            <ul className="grid gap-2.5 text-[0.92rem]">
              {exploreLinks.map(([label, p]) => (
                <li key={p}><button onClick={() => go(p)} className="transition-colors duration-200 hover:text-or-clair">{label}</button></li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="mb-5 text-eyebrow font-medium uppercase tracking-eyebrow text-or-clair">{isEn ? "Company" : "Groupe"}</h4>
            <ul className="grid gap-2.5 text-[0.92rem]">
              {companyLinks.map(([label, p]) => (
                <li key={p}><button onClick={() => go(p)} className="transition-colors duration-200 hover:text-or-clair">{label}</button></li>
              ))}
            </ul>
            <h4 className="mb-4 mt-8 text-eyebrow font-medium uppercase tracking-eyebrow text-or-clair">Documents</h4>
            <ul className="grid gap-2.5 text-[0.92rem]">
              {documentLinks.map((doc) => (
                <li key={doc.href}>
                  {doc.internal ? (
                    <button onClick={() => go(doc.href)} className="inline-flex items-center gap-2 transition-colors duration-200 hover:text-or-clair">{doc.label}</button>
                  ) : (
                    <a href={doc.href} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 transition-colors duration-200 hover:text-or-clair">
                      <FileText size={13} className="text-or/70" />{doc.label}
                    </a>
                  )}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="mb-5 text-eyebrow font-medium uppercase tracking-eyebrow text-or-clair">Contact</h4>
            <ul className="grid gap-3.5 text-[0.92rem]">
              <li className="flex gap-3"><Phone size={16} className="mt-0.5 shrink-0 text-or" /><span>+243 840 080 000<br />+243 970 002 565</span></li>
              <li className="flex gap-3"><Mail size={16} className="mt-0.5 shrink-0 text-or" /><a href="mailto:contactrdc@luxos.co.za" className="hover:text-or-clair">contactrdc@luxos.co.za</a></li>
              <li className="flex gap-3"><MapPin size={16} className="mt-0.5 shrink-0 text-or" />6, avenue Likasi, Quartier Royal, Kinshasa-Gombe</li>
            </ul>
            <a href={whatsAppUrl} target="_blank" rel="noreferrer" className="mt-6 inline-flex items-center gap-2 rounded-[3px] border border-white/20 px-5 py-3 text-[0.78rem] font-medium uppercase tracking-label text-white transition-colors duration-300 hover:border-or hover:text-or-clair">
              <MessageCircle size={16} />WhatsApp
            </a>
          </div>
        </div>

        <div className="flex flex-col items-center justify-between gap-4 border-t border-white/10 py-8 text-xs text-white/45 md:flex-row">
          <p>© 2026 Luxos RDC. {isEn ? "All rights reserved." : "Tous droits réservés."}</p>
          <p className="flex items-center gap-2"><Globe2 size={14} className="text-or/60" />{isEn ? "Kinshasa · Serving families, investors and the diaspora" : "Kinshasa · Familles, investisseurs et diaspora"}</p>
        </div>
      </div>
    </footer>
  );
}

function ServicesPage() {
  const { lang } = useLang();
  const isEn = lang === "en";
  const heroParallax = useParallax<HTMLDivElement>(0.08);

  const metiers = isEn
    ? [
        { icon: Landmark, title: "Property sales", text: "Land, serviced plots and properties, with a clear path from first contact to document handover." },
        { icon: Building2, title: "Custom construction", text: "Design office, architectural plans, execution and site management to build within your budget." },
        { icon: Home, title: "Rental & management", text: "Rental and property management that secures income and simplifies day-to-day ownership." },
        { icon: ShieldCheck, title: "Works & renovation", text: "Fencing, extensions and renovation to protect and increase the value of your property." }
      ]
    : [
        { icon: Landmark, title: "Vente immobilière", text: "Terrains, parcelles viabilisées et biens, avec un parcours clair du premier contact à la remise documentaire." },
        { icon: Building2, title: "Construction sur mesure", text: "Bureau d'études, plans architecturaux, exécution et maîtrise de chantier pour bâtir dans votre budget." },
        { icon: Home, title: "Location & gestion", text: "Location et gestion locative qui sécurisent les revenus et simplifient le quotidien de propriétaire." },
        { icon: ShieldCheck, title: "Travaux & rénovation", text: "Clôtures, agrandissements et rénovation pour protéger et valoriser votre bien." }
      ];

  const process = isEn
    ? [
        ["01", "Brief & feasibility", "We study your land, your budget and your program to frame a realistic project."],
        ["02", "Design & plans", "Our design office draws architectural plans and delivers a detailed quote."],
        ["03", "Construction", "Managed construction with milestones, quality control and progress reporting."],
        ["04", "Handover", "Keys, documents and after-sales follow-up — with a ten-year structural guarantee."]
      ]
    : [
        ["01", "Brief & faisabilité", "Nous étudions votre terrain, votre budget et votre programme pour cadrer un projet réaliste."],
        ["02", "Conception & plans", "Notre bureau d'études dessine les plans architecturaux et remet un devis détaillé."],
        ["03", "Construction", "Chantier encadré avec jalons, contrôle qualité et comptes rendus d'avancement."],
        ["04", "Remise des clés", "Clés, documents et suivi après-vente — avec garantie décennale."]
      ];

  const models = [
    { img: assets.construction, name: "Maison CDM — Type 39", meta: isEn ? "Exterior · Cité des Merveilles" : "Extérieur · Cité des Merveilles" },
    { img: assets.constructionInterior, name: "Maison CDM — Type 39", meta: isEn ? "Interior" : "Intérieur" }
  ];

  return (
    <main>
      <section className="relative -mt-20 flex min-h-[72vh] items-end overflow-hidden bg-encre text-white">
        <div ref={heroParallax} className="lux-media absolute inset-0 -top-[6%] h-[112%]">
          <img src={assets.construction} alt={isEn ? "Luxos custom-built home" : "Maison Luxos construite sur mesure"} decoding="async" className="h-full w-full object-cover" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-encre via-encre/60 to-encre/30" />
        <div className="relative mx-auto w-full max-w-[86rem] px-5 pb-16 pt-36 lg:px-8">
          <span className="inline-flex items-center gap-3 text-eyebrow font-medium uppercase tracking-eyebrow text-or-clair before:h-px before:w-9 before:bg-or-clair/60">Services</span>
          <h1 className="mt-5 max-w-4xl font-display text-display-lg font-semibold leading-[1.0]">{isEn ? "From land to a finished home — under one roof." : "Du terrain à la maison finie — sous un même toit."}</h1>
          <p className="mt-6 max-w-2xl text-lg text-white/75">{isEn ? "Luxos brings together sales, construction, management and works. We don't only sell land — we design, build and support your project to completion." : "Luxos réunit vente, construction, gestion et travaux. Nous ne vendons pas que du terrain — nous concevons, bâtissons et accompagnons votre projet jusqu'au bout."}</p>
          <div className="mt-9 flex flex-wrap gap-4">
            <Button size="lg" onClick={() => openLina("construire")}>{isEn ? "Tell us about your project" : "Parlez-nous de votre projet"} <ArrowRight size={16} /></Button>
            <Button size="lg" variant="light" onClick={() => go("/campagnes")}>{isEn ? "See our projects" : "Voir nos projets"}</Button>
          </div>
        </div>
      </section>

      <section className="py-20 lg:py-28">
        <div className="mx-auto max-w-[86rem] px-5 lg:px-8">
          <SectionTitle sur={isEn ? "Our expertise" : "Nos métiers"} title={isEn ? "Four complementary expertises" : "Quatre métiers complémentaires"} text={isEn ? "The essential real-estate expertise to secure your project, gathered in one group." : "Les métiers essentiels de l'immobilier pour sécuriser votre projet, réunis dans un même groupe."} align="left" />
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {metiers.map((m, i) => (
              <Reveal key={m.title} delay={i * 90}>
                <div className="group h-full border border-ligne bg-blanc p-7 shadow-card transition duration-500 ease-lux hover:-translate-y-1.5 hover:border-or/40 hover:shadow-luxos">
                  <m.icon className="mb-6 text-or transition-transform duration-500 group-hover:-translate-y-0.5" size={32} strokeWidth={1.5} />
                  <h3 className="font-display text-2xl font-semibold">{m.title}</h3>
                  <p className="mt-3 text-[0.95rem] leading-relaxed text-encre-muted">{m.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-creme py-20 lg:py-28">
        <div className="mx-auto grid max-w-[86rem] gap-12 px-5 lg:grid-cols-[0.8fr_1.2fr] lg:px-8">
          <div className="lg:sticky lg:top-28 lg:h-fit">
            <SectionTitle sur="Construction" title={isEn ? "How we build, step by step." : "Comment nous bâtissons, étape par étape."} text={isEn ? "A managed, transparent process — you always know where your project stands." : "Un processus encadré et transparent — vous savez toujours où en est votre projet."} align="left" />
            <Button className="hidden lg:inline-flex" onClick={() => openLina("construire")}>{isEn ? "Start your project" : "Démarrer votre projet"} <ArrowRight size={16} /></Button>
          </div>
          <div className="grid gap-4">
            {process.map(([num, title, text], i) => (
              <Reveal key={num} delay={i * 90}>
                <div className="flex gap-6 border border-ligne bg-blanc p-6 shadow-card lg:p-8">
                  <div className="font-display text-3xl font-semibold text-or/40">{num}</div>
                  <div>
                    <h3 className="font-display text-xl font-semibold">{title}</h3>
                    <p className="mt-2 text-[0.95rem] leading-relaxed text-encre-muted">{text}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 lg:py-28">
        <div className="mx-auto max-w-[86rem] px-5 lg:px-8">
          <SectionTitle sur={isEn ? "House models" : "Modèles de maisons"} title={isEn ? "Homes designed to be built and lived in." : "Des maisons pensées pour être bâties et habitées."} align="left" />
          <div className="grid gap-6 md:grid-cols-2">
            {models.map((model, i) => (
              <Reveal key={model.meta} delay={i * 100}>
                <div className="lux-media group rounded-[6px] border border-ligne shadow-card">
                  <div className="relative overflow-hidden rounded-t-[6px]">
                    <img src={model.img} alt={model.name} loading="lazy" decoding="async" className="aspect-[16/10] w-full object-cover transition duration-700 ease-lux group-hover:scale-[1.04]" />
                  </div>
                  <div className="bg-blanc p-6">
                    <h3 className="font-display text-xl font-semibold">{model.name}</h3>
                    <div className="mt-1 text-[0.7rem] uppercase tracking-label text-encre-muted">{model.meta}</div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <FinalCTA />
    </main>
  );
}

function NotFoundPage() {
  const { lang } = useLang();
  const isEn = lang === "en";
  return (
    <main className="grid min-h-[70vh] place-items-center px-5 pt-28">
      <div className="max-w-lg text-center">
        <div className="font-display text-display-xl font-semibold text-or/30">404</div>
        <h1 className="mt-2 font-display text-display-sm font-semibold">{isEn ? "This page could not be found." : "Cette page est introuvable."}</h1>
        <p className="mx-auto mt-4 max-w-md text-encre-muted">{isEn ? "The page may have moved. Explore Luxos projects or return home." : "La page a peut-être été déplacée. Explorez les projets Luxos ou revenez à l'accueil."}</p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Button onClick={() => go("/")}>{isEn ? "Back home" : "Retour à l'accueil"}</Button>
          <Button variant="outline" onClick={() => go("/campagnes")}>{isEn ? "See projects" : "Voir les projets"}</Button>
        </div>
      </div>
    </main>
  );
}

const routeTitles: Record<string, Bilingual> = {
  "/": { fr: "Luxos RDC — Bâtir, habiter et transmettre en RDC", en: "Luxos RDC — Build, live and pass on heritage in the DRC" },
  "/campagnes": { fr: "Campagnes immobilières — Luxos RDC", en: "Real-estate campaigns — Luxos RDC" },
  "/concessions": { fr: "Concessions — Luxos RDC", en: "Concessions — Luxos RDC" },
  "/services": { fr: "Services & construction — Luxos RDC", en: "Services & construction — Luxos RDC" },
  "/paiement": { fr: "Paiement · Luxos Cash & Green — Luxos RDC", en: "Payment · Luxos Cash & Green — Luxos RDC" },
  "/documents": { fr: "Centre de documentation — Luxos RDC", en: "Document center — Luxos RDC" },
  "/diaspora": { fr: "Luxos Diaspora — Investir depuis l'étranger", en: "Luxos Diaspora — Invest from abroad" },
  "/a-propos": { fr: "À propos — Luxos RDC", en: "About — Luxos RDC" },
  "/faq": { fr: "Questions fréquentes — Luxos RDC", en: "FAQ — Luxos RDC" },
  "/contact": { fr: "Contact — Luxos RDC", en: "Contact — Luxos RDC" }
};

/** Ferronnerie d'un battant (dessiné pour le battant droit ; le gauche est mis en miroir en CSS). */
function GateLeafFace() {
  return (
    <div className="gate-face">
      <svg className="gate-arch" viewBox="0 0 420 175" preserveAspectRatio="xMinYMin meet" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" aria-hidden="true">
        <defs>
          <g id="fin">
            <path d="M0 0 V-13" />
            <path d="M-5 -13 L0 -24 L5 -13 Z" fill="currentColor" stroke="none" />
            <circle cx="0" cy="-27.5" r="2.4" fill="currentColor" stroke="none" />
          </g>
        </defs>
        {/* rails de crête */}
        <path d="M2 36 C 130 12, 300 28, 418 72" />
        <path d="M2 70 C 130 50, 300 66, 418 106" strokeWidth="3" />
        {/* volute centrale (descend du rail près du centre) */}
        <path d="M10 40 C 8 70, 44 72, 42 46 C 41 33, 26 34, 30 45" strokeWidth="2.4" />
        {/* fleurons */}
        <use href="#fin" x="72" y="33" />
        <use href="#fin" x="164" y="27" />
        <use href="#fin" x="256" y="31" />
        <use href="#fin" x="352" y="55" />
      </svg>

      <div className="gate-pickets" />

      <div className="gate-panel">
        <svg className="gate-medallion" viewBox="0 0 140 64" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" aria-hidden="true">
          <path d="M70 8 C 79 22, 79 42, 70 56 C 61 42, 61 22, 70 8 Z" />
          <path d="M70 21 C 92 15, 108 23, 118 32 C 104 34, 88 34, 74 32" />
          <path d="M70 43 C 92 49, 108 41, 118 32" />
          <path d="M70 21 C 48 15, 32 23, 22 32 C 36 34, 52 34, 66 32" />
          <path d="M70 43 C 48 49, 32 41, 22 32" />
          <circle cx="70" cy="32" r="3.6" fill="currentColor" stroke="none" />
        </svg>
      </div>
    </div>
  );
}

function IntroLoader({ onDone }: { onDone: () => void }) {
  const [phase, setPhase] = useState<"reveal" | "open" | "gone">("reveal");
  const reduced = prefersReducedMotion();

  useEffect(() => {
    const lenis = (window as unknown as { lenis?: { stop: () => void; start: () => void } }).lenis;
    lenis?.stop();
    window.scrollTo(0, 0);
    document.documentElement.classList.add("intro-lock");
    const timers: number[] = [];
    if (reduced) {
      timers.push(window.setTimeout(() => setPhase("gone"), 950));
    } else {
      // Stratégie d'attente maximale : on avance même si un asset traîne.
      timers.push(window.setTimeout(() => setPhase("open"), 1250));
      timers.push(window.setTimeout(() => setPhase("gone"), 2350));
    }
    return () => timers.forEach((t) => clearTimeout(t));
  }, [reduced]);

  useEffect(() => {
    if (phase !== "gone") return;
    const lenis = (window as unknown as { lenis?: { start: () => void } }).lenis;
    document.documentElement.classList.remove("intro-lock");
    window.scrollTo(0, 0);
    lenis?.start();
    const t = window.setTimeout(onDone, 520);
    return () => clearTimeout(t);
  }, [phase, onDone]);

  return (
    <div className="intro" data-phase={phase} aria-hidden="true">
      {/* Héros derrière le portail (même image → transition sans coupure) */}
      <img className="intro-media" src={assets.hero} alt="" decoding="async" />

      <div className="gate">
        <div className="gate-leaf gate-leaf--left"><GateLeafFace /></div>
        <div className="gate-leaf gate-leaf--right"><GateLeafFace /></div>

        <div className="gate-seam">
          <svg className="gate-spire" width="22" height="56" viewBox="0 0 24 60" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true">
            <path d="M12 60 V20" />
            <path d="M5 20 L12 4 L19 20 Z" fill="currentColor" stroke="none" />
            <circle cx="12" cy="1.8" r="2.4" fill="currentColor" stroke="none" />
          </svg>

          <div className="gate-emblem">
            <span className="e-eyebrow">Luxos RDC</span>
            <span className="e-line"><span>Ouvrez la voie</span></span>
            <span className="e-line"><span>vers votre propriété.</span></span>
          </div>

          <svg className="gate-handle" width="50" height="118" viewBox="0 0 56 130" fill="none" aria-hidden="true">
            <rect x="20" y="10" width="16" height="110" rx="8" fill="currentColor" opacity="0.92" />
            <rect x="30" y="74" width="24" height="7" rx="3.5" fill="currentColor" />
            <circle cx="28" cy="50" r="5.5" fill="#16140f" />
            <rect x="26" y="54" width="4" height="10" rx="2" fill="#16140f" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function App() {
  const [lang, setLang] = useState<Lang>("fr");
  const [showIntro, setShowIntro] = useState(() => {
    if (typeof window === "undefined") return false;
    // Intro rejouée à chaque chargement de l'accueil (pas de verrou de session).
    return window.location.pathname === "/";
  });
  const path = usePath();
  const project = useMemo(() => projects.find((p) => path === `/projets/${p.slug}`), [path]);
  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);
  useEffect(() => {
    const suffix = lang === "en" ? "Luxos RDC" : "Luxos RDC";
    document.title = project
      ? `${project.title} — ${suffix}`
      : routeTitles[path]?.[lang] ?? (lang === "en" ? "Page not found — Luxos RDC" : "Page introuvable — Luxos RDC");
  }, [path, project, lang]);
  let page = <HomePage />;
  if (project) page = <ProjectPage project={localizeProject(project, lang)} />;
  else if (path === "/") page = <HomePage />;
  else if (path === "/a-propos") page = <AboutPage />;
  else if (path === "/campagnes") page = <ListingPage mode="Campagne" />;
  else if (path === "/concessions") page = <ListingPage mode="Concession" />;
  else if (path === "/services") page = <ServicesPage />;
  else if (path === "/paiement") page = <PaymentPage />;
  else if (path === "/documents") page = <DocumentsPage />;
  else if (path === "/diaspora") page = <DiasporaPage />;
  else if (path === "/faq") page = <FAQPage />;
  else if (path === "/contact") page = <ContactPage />;
  else page = <NotFoundPage />;

  return (
    <LangContext.Provider value={{ lang, setLang }}>
      <div className="min-h-screen bg-ivoire text-encre">
        <Header />
        {page}
        <Footer />
        <LinaChat />
        {showIntro && <IntroLoader onDone={() => setShowIntro(false)} />}
      </div>
    </LangContext.Provider>
  );
}

export default App;
