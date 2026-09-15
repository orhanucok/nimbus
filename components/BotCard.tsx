'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { BotAvatar } from './BotAvatar';
import type { Bot } from '@/lib/bots';

interface BotCardProps {
  bot: Bot;
  /** Optional href override (e.g. /b/<slug> for public preview). */
  href?: string;
}

export function BotCard({ bot, href }: BotCardProps) {
  const target = href ?? `/bots/${bot.id}`;
  return (
    <motion.div
      whileHover={{ y: -3 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
    >
      <Link
        href={target}
        className="block h-full bg-card border border-border rounded-xl p-4 hover:bg-accent/30 transition-colors"
      >
        <div className="flex items-start gap-3">
          <BotAvatar glyph={bot.avatar} name={bot.name} size={48} shape="rounded" />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-base truncate">{bot.name}</h3>
              {bot.builtin && (
                <span className="px-1.5 py-0.5 text-[10px] rounded bg-blue-500/20 text-blue-500 font-medium">
                  BUILT-IN
                </span>
              )}
            </div>
            <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
              {bot.tagline}
            </p>
            {bot.tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {bot.tags.slice(0, 3).map((t) => (
                  <span
                    key={t}
                    className="px-1.5 py-0.5 text-[10px] rounded bg-muted text-muted-foreground"
                  >
                    {t}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

export default BotCard;
