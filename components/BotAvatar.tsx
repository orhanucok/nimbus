import { useMemo } from 'react';

interface BotAvatarProps {
  /** Emoji glyph or initials; falls back to first letter of name. */
  glyph: string;
  /** Display name; used for the deterministic gradient and initials fallback. */
  name: string;
  /** Pixel size. Defaults to 48. */
  size?: number;
  className?: string;
  /** Rounded corners (square for grid tiles, full for bubbles). */
  shape?: 'circle' | 'rounded';
}

/** Deterministic 2-color gradient picked from a small palette by hashing name. */
function gradient(name: string): [string, string] {
  const palette: Array<[string, string]> = [
    ['#5b6cff', '#8b5cf6'], // indigo → purple
    ['#06b6d4', '#3b82f6'], // cyan → blue
    ['#10b981', '#0ea5e9'], // emerald → sky
    ['#f59e0b', '#ef4444'], // amber → red
    ['#ec4899', '#8b5cf6'], // pink → purple
    ['#14b8a6', '#22c55e'], // teal → green
    ['#f97316', '#eab308'], // orange → yellow
    ['#6366f1', '#a855f7'], // indigo → fuchsia
  ];
  let h = 0;
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) >>> 0;
  return palette[h % palette.length]!;
}

function isEmoji(glyph: string): boolean {
  if (!glyph) return false;
  // Quick test: emoji tend to have high code points.
  for (let i = 0; i < glyph.length; i++) {
    if (glyph.charCodeAt(i) > 0x1f00) return true;
  }
  return false;
}

export function BotAvatar({
  glyph,
  name,
  size = 48,
  className = '',
  shape = 'circle',
}: BotAvatarProps) {
  const [from, to] = useMemo(() => gradient(name || 'x'), [name]);
  const radius = shape === 'circle' ? '50%' : '12px';
  const display = glyph && isEmoji(glyph)
    ? glyph
    : (glyph || name.slice(0, 2)).toUpperCase();
  const isText = !(glyph && isEmoji(glyph));

  return (
    <div
      role="img"
      aria-label={`${name} avatar`}
      className={`inline-flex items-center justify-center font-semibold text-white shrink-0 select-none ${className}`}
      style={{
        width: size,
        height: size,
        borderRadius: radius,
        background: `linear-gradient(135deg, ${from}, ${to})`,
        fontSize: isText ? size * 0.4 : size * 0.55,
        lineHeight: 1,
      }}
    >
      <span aria-hidden="true">{display}</span>
    </div>
  );
}

export default BotAvatar;
