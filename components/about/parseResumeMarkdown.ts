export type ResumeInline =
  | {
      type: "text";
      text: string;
    }
  | {
      type: "strong";
      text: string;
    }
  | {
      type: "link";
      text: string;
      href: string;
    };

export type ResumeBlock =
  | {
      type: "heading";
      level: number;
      text: string;
    }
  | {
      type: "paragraph";
      inlines: ResumeInline[];
    }
  | {
      type: "list";
      items: ResumeInline[][];
    };

export type ResumeSection = {
  id: string;
  title: string;
  blocks: ResumeBlock[];
};

export type ParsedResume = {
  title: string;
  sections: ResumeSection[];
  isEmpty: boolean;
};

function slugify(value: string, fallback: string) {
  const slug = value
    .toLowerCase()
    .trim()
    .replace(/['"]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  return slug || fallback;
}

function createUniqueSlug(
  value: string,
  fallback: string,
  usedSlugs: Set<string>,
) {
  const baseSlug = slugify(value, fallback);
  let slug = baseSlug;
  let index = 2;

  while (usedSlugs.has(slug)) {
    slug = `${baseSlug}-${index}`;
    index += 1;
  }

  usedSlugs.add(slug);
  return slug;
}

function parseInline(value: string): ResumeInline[] {
  const result: ResumeInline[] = [];
  const pattern = /(\*\*([^*]+)\*\*)|(\[([^\]]+)\]\(([^)]+)\))/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = pattern.exec(value)) !== null) {
    if (match.index > lastIndex) {
      result.push({ type: "text", text: value.slice(lastIndex, match.index) });
    }

    if (match[2]) {
      result.push({ type: "strong", text: match[2] });
    } else if (match[4] && match[5]) {
      result.push({ type: "link", text: match[4], href: match[5] });
    }

    lastIndex = pattern.lastIndex;
  }

  if (lastIndex < value.length) {
    result.push({ type: "text", text: value.slice(lastIndex) });
  }

  return result.length > 0 ? result : [{ type: "text", text: value }];
}

function parseBlocks(markdown: string) {
  const blocks: ResumeBlock[] = [];
  const lines = markdown.replace(/\r\n/g, "\n").split("\n");
  let index = 0;

  while (index < lines.length) {
    const line = lines[index];
    const trimmed = line.trim();

    if (!trimmed) {
      index += 1;
      continue;
    }

    const headingMatch = /^(#{1,6})\s+(.+)$/.exec(trimmed);
    if (headingMatch) {
      blocks.push({
        type: "heading",
        level: headingMatch[1].length,
        text: headingMatch[2].trim(),
      });
      index += 1;
      continue;
    }

    if (/^[-*]\s+/.test(trimmed)) {
      const items: ResumeInline[][] = [];

      while (index < lines.length && /^[-*]\s+/.test(lines[index].trim())) {
        items.push(parseInline(lines[index].trim().replace(/^[-*]\s+/, "")));
        index += 1;
      }

      blocks.push({ type: "list", items });
      continue;
    }

    const paragraphLines: string[] = [];

    while (
      index < lines.length &&
      lines[index].trim() &&
      !/^(#{1,6})\s+/.test(lines[index].trim()) &&
      !/^[-*]\s+/.test(lines[index].trim())
    ) {
      paragraphLines.push(lines[index].trim());
      index += 1;
    }

    blocks.push({
      type: "paragraph",
      inlines: parseInline(paragraphLines.join(" ")),
    });
  }

  return blocks;
}

export function parseResumeMarkdown(markdown: string): ParsedResume {
  const trimmedMarkdown = markdown.trim();

  if (!trimmedMarkdown) {
    return {
      title: "About",
      sections: [],
      isEmpty: true,
    };
  }

  const blocks = parseBlocks(markdown);
  const firstHeading = blocks.find((block) => block.type === "heading");
  const title =
    firstHeading?.type === "heading" && firstHeading.level === 1
      ? firstHeading.text
      : "About";
  const headingLevels = blocks
    .filter((block): block is Extract<ResumeBlock, { type: "heading" }> => {
      return block.type === "heading";
    })
    .map((block) => block.level);
  const sectionLevel =
    firstHeading?.type === "heading" &&
    firstHeading.level === 1 &&
    headingLevels.includes(2)
      ? 2
      : Math.min(...headingLevels);
  const sections: ResumeSection[] = [];
  const usedSectionIds = new Set<string>();
  let currentSection: ResumeSection | null = null;
  let fallbackIndex = 1;

  for (const block of blocks) {
    if (block.type === "heading" && block.level === 1 && block.text === title) {
      continue;
    }

    if (block.type === "heading" && block.level === sectionLevel) {
      const id = createUniqueSlug(
        block.text,
        `section-${sections.length + 1}`,
        usedSectionIds,
      );
      currentSection = {
        id,
        title: block.text,
        blocks: [],
      };
      sections.push(currentSection);
      continue;
    }

    if (!currentSection) {
      const fallbackId = createUniqueSlug(
        title === "About" ? "Profile" : title,
        `section-${fallbackIndex}`,
        usedSectionIds,
      );
      currentSection = {
        id: fallbackId,
        title: title === "About" ? "Profile" : title,
        blocks: [],
      };
      fallbackIndex += 1;
      sections.push(currentSection);
    }

    currentSection.blocks.push(block);
  }

  return {
    title,
    sections,
    isEmpty: sections.length === 0,
  };
}
