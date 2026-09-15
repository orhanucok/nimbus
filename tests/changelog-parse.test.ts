import { describe, it, expect } from 'vitest';

// Mirror the parser logic from /app/changelog/page.tsx for unit testing.
// Keep them in sync if you change either side.

const HEADING_PREFIXES: Record<string, true> = {
  Added: true,
  Changed: true,
  Fixed: true,
  Removed: true,
  Deprecated: true,
  Security: true,
};

function parseChangelog(raw: string): Array<{
  version: string;
  date: string;
  intro: string;
  sections: Array<{ heading: string; bullets: string[] }>;
}> {
  const releases: Array<{
    version: string;
    date: string;
    intro: string;
    sections: Array<{ heading: string; bullets: string[] }>;
  }> = [];
  const lines = raw.split(/\r?\n/);
  let current: (typeof releases)[number] | null = null;

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
      current.sections.push({
        heading: heading in HEADING_PREFIXES ? heading : 'Changed',
        bullets: [],
      });
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

describe('parseChangelog', () => {
  it('returns an empty list for empty input', () => {
    expect(parseChangelog('')).toEqual([]);
  });

  it('parses one release with one Added section', () => {
    const md = `# Changelog

## [1.0.0] – 2026-09-15 — Initial release

### Added

- First bullet.
- Second bullet with \`code\`.
`;
    const releases = parseChangelog(md);
    expect(releases).toHaveLength(1);
    expect(releases[0]?.version).toBe('1.0.0');
    expect(releases[0]?.intro).toBe('Initial release');
    expect(releases[0]?.sections).toHaveLength(1);
    expect(releases[0]?.sections[0]?.heading).toBe('Added');
    expect(releases[0]?.sections[0]?.bullets).toHaveLength(2);
    expect(releases[0]?.sections[0]?.bullets[1]).toContain('`code`');
  });

  it('handles multiple releases and multiple section kinds', () => {
    const md = `## [2.0.0] – 2026-09-15 — Major

### Added

- new thing

### Fixed

- bug

## [1.5.0] – 2026-09-01 — Patch

### Changed

- tweak
`;
    const releases = parseChangelog(md);
    expect(releases).toHaveLength(2);
    expect(releases[0]?.sections.map((s) => s.heading)).toEqual(['Added', 'Fixed']);
    expect(releases[1]?.sections.map((s) => s.heading)).toEqual(['Changed']);
  });

  it('falls back to "Changed" for unrecognised sub-headings', () => {
    const md = `## [1.0.0] – 2026-09-15 — X

### Custom Heading

- bullet
`;
    const releases = parseChangelog(md);
    expect(releases[0]?.sections[0]?.heading).toBe('Changed');
  });
});
