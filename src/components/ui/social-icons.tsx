/**
 * Icônes sociales en SVG inline.
 * lucide-react 1.16 n'exporte plus les logos de marque (Facebook, X…),
 * on les fournit donc ici avec la même API `{ size }` que les icônes lucide.
 */
type IconProps = { size?: number; className?: string };

export function FacebookIcon({ size = 18, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
      <path d="M13.5 21v-8h2.7l.4-3.1h-3.1V7.9c0-.9.25-1.5 1.55-1.5H17V3.6c-.29-.04-1.28-.12-2.43-.12-2.4 0-4.05 1.47-4.05 4.16v2.32H7.8V13h2.72v8h2.98z" />
    </svg>
  );
}

export function LinkedinIcon({ size = 18, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
      <path d="M6.94 5A1.94 1.94 0 1 1 3.06 5a1.94 1.94 0 0 1 3.88 0zM3.4 8.4h3.1V21H3.4V8.4zm5.06 0h2.97v1.72h.04c.41-.78 1.42-1.6 2.93-1.6 3.13 0 3.71 2.06 3.71 4.74V21h-3.1v-5.55c0-1.32-.02-3.02-1.84-3.02-1.84 0-2.12 1.44-2.12 2.93V21H8.46V8.4z" />
    </svg>
  );
}

export function YoutubeIcon({ size = 18, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
      <path d="M23 12s0-3.2-.4-4.7c-.23-.85-.9-1.5-1.75-1.73C19.36 5.2 12 5.2 12 5.2s-7.36 0-8.85.37c-.85.23-1.52.88-1.75 1.73C1 8.8 1 12 1 12s0 3.2.4 4.7c.23.85.9 1.5 1.75 1.73 1.49.37 8.85.37 8.85.37s7.36 0 8.85-.37c.85-.23 1.52-.88 1.75-1.73C23 15.2 23 12 23 12zM9.75 15.02V8.98L15 12l-5.25 3.02z" />
    </svg>
  );
}

export function XIcon({ size = 18, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
      <path d="M17.53 3H20.5l-6.48 7.4L21.75 21h-5.98l-4.68-6.12L5.72 21H2.75l6.93-7.92L2.5 3h6.13l4.23 5.6L17.53 3zm-1.05 16.2h1.65L7.6 4.72H5.83l10.65 14.48z" />
    </svg>
  );
}
