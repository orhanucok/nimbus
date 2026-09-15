import { readFile } from 'node:fs/promises';
import path from 'node:path';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Nimbus — Changelog',
  description: 'Every release of Nimbus, in one place.',
};

interface ReleaseSection {
  heading: string;
  bullets: string[];
}

interface Release {
  version: string;
  date: string;
  intro: string;
  sections: ReleaseSection[];
}

const HEADING_PREFIXES: Record<ReleaseSection['heading'], true> = {
  Added: true,
  Changed: true,
  Fixed: true,
  Removed: true,
  Deprecated: true,
  Security: true,
};

function parseChangelog(raw: string): Release[] {
  const releases: Release[] = [];
  const lines = raw.split(/\r?\n/);
  let current: Release | null = null;

  for (const line of lines) {
    const releaseMatch = line.match(/^## \[(.+?)\] – (\d{4}-\d{2}-\d{2}) — (.+)$/);
    if (releaseMatch) {
      if (current) releases.push(current);
      current = {
        version: releaseMatch[1]!,
        date: releaseMatch[2]!,
        intro: releaseMatch[3]!,
        sections: [],
      };
      continue;
    }
    if (!current) continue;
    const sectionMatch = line.match(/^### (.+)$/);
    if (sectionMatch) {
      const heading = sectionMatch[1]!.trim();
      if (heading in HEADING_PREFIXES) {
        current.sections.push({ heading: heading as ReleaseSection['heading'], bullets: [] });
      } else {
        // Skip custom section for safety; reset to heading-less flow
        current.sections.push({ heading: 'Changed', bullets: [] });
      }
      continue;
    }
    const bullet = line.match(/^- (.*)$/);
    if (bullet && current.sections.length > 0) {
      current.sections[current.sections.length - 1]!.bullets.push(bullet[1]!.trim());
    }
  }
  if (current) releases.push(current);
  return releases;
}

export default async function ChangelogPage() {
  const filePath = path.join(process.cwd(), 'CHANGELOG.md');
  let releases: Release[] = [];
  try {
    const raw = await readFile(filePath, 'utf8');
    releases = parseChangelog(raw);
  } catch {
    releases = [];
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <main className="max-w-3xl mx-auto px-4 py-12">
        <header className="mb-10">
          <h1 className="text-3xl font-semibold">Changelog</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Every public release of Nimbus.
          </p>
        </header>

        {releases.length === 0 ? (
          <p className="text-sm text-muted-foreground">Changelog could not be loaded.</p>
        ) : (
          <ol className="space-y-10">
            {releases.map((rel) => (
              <li key={rel.version}>
                <header className="flex items-baseline gap-3 mb-3">
                  <h2 className="text-xl font-semibold">v{rel.version}</h2>
                  <time
                    dateTime={rel.date}
                    className="text-xs text-muted-foreground font-mono"
                  >
                    {rel.date}
                  </time>
                </header>
                <p className="text-sm text-muted-foreground mb-4">{rel.intro}</p>
                <div className="space-y-4">
                  {rel.sections.map((sec, i) => (
                    <section key={`${rel.version}-${i}`}>
                      <h3 className="text-sm uppercase tracking-wider text-muted-foreground mb-2">
                        {sec.heading}
                      </h3>
                      <ul className="space-y-1.5 text-sm">
                        {sec.bullets.map((b, j) => (
                          <li key={j} className="flex items-start gap-2">
                            <span className="text-blue-500 mt-1.5">·</span>
                            <span dangerouslySetInnerHTML={{ __html: renderInline(b) }} />
                          </li>
                        ))}
                      </ul>
                    </section>
                  ))}
                </div>
              </li>
            ))}
          </ol>
        )}
      </main>
    </div>
  );
}

/**
 * Inline markdown for `code` spans only. Avoids needing a full md parser;
 * CHANGELOG bullets use backticks liberally but no other formatting.
 */
function renderInline(input: string): string {
  const escaped = input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
  return escaped.replace(/`([^`]+)`/g, '<code class="bg-muted px-1 py-0.5 rounded text-[12px]">$1</code>');
}
