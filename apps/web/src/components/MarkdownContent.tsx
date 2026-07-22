import { Fragment, type ReactNode } from "react";
import { MathText } from "./MathText";

function inline(value: string) {
  const parts = value.split(/(`[^`]+`|\*\*[^*]+\*\*|\*[^*]+\*|\[[^\]]+\]\(https?:\/\/[^)\s]+\))/g).filter(Boolean);
  return parts.map((part, index) => {
    const link = /^\[([^\]]+)\]\((https?:\/\/[^)\s]+)\)$/.exec(part);
    if (link) {
      return <a key={`${part}-${index}`} href={link[2]} target="_blank" rel="noreferrer">{link[1]}</a>;
    }
    if (part.startsWith("**") && part.endsWith("**")) {
      return <strong key={`${part}-${index}`}><MathText>{part.slice(2, -2)}</MathText></strong>;
    }
    if (part.startsWith("*") && part.endsWith("*")) {
      return <em key={`${part}-${index}`}><MathText>{part.slice(1, -1)}</MathText></em>;
    }
    if (part.startsWith("`") && part.endsWith("`")) {
      return <code key={`${part}-${index}`}>{part.slice(1, -1)}</code>;
    }
    return <Fragment key={`${part}-${index}`}><MathText>{part}</MathText></Fragment>;
  });
}

interface MarkdownBlock {
  kind: "paragraph" | "heading" | "quote" | "unordered" | "ordered" | "table" | "image" | "video";
  level?: number;
  lines: string[];
  url?: string;
}

function parseBlocks(markdown: string) {
  const blocks: MarkdownBlock[] = [];
  const lines = markdown.replace(/\r\n/g, "\n").split("\n");
  let paragraph: string[] = [];

  const flushParagraph = () => {
    if (!paragraph.length) return;
    blocks.push({ kind: "paragraph", lines: [...paragraph] });
    paragraph = [];
  };

  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (!line) {
      flushParagraph();
      continue;
    }
    const image = /^!\[([^\]]*)\]\((https?:\/\/[^)\s]+)\)$/.exec(line);
    if (image) {
      flushParagraph();
      blocks.push({ kind: "image", lines: [image[1] || "Illustration du cours"], url: image[2] });
      continue;
    }
    const video = /^@\[video\]\((https?:\/\/[^)\s]+)\)$/.exec(line);
    if (video) {
      flushParagraph();
      blocks.push({ kind: "video", lines: [], url: video[1] });
      continue;
    }
    if (line.startsWith("|") && line.endsWith("|")) {
      flushParagraph();
      const previous = blocks.at(-1);
      if (previous?.kind === "table") previous.lines.push(line);
      else blocks.push({ kind: "table", lines: [line] });
      continue;
    }
    const heading = /^(#{1,3})\s+(.+)$/.exec(line);
    if (heading) {
      flushParagraph();
      blocks.push({ kind: "heading", level: heading[1].length, lines: [heading[2]] });
      continue;
    }
    if (line.startsWith("> ")) {
      flushParagraph();
      blocks.push({ kind: "quote", lines: [line.slice(2)] });
      continue;
    }
    if (/^[-*]\s+/.test(line)) {
      flushParagraph();
      const previous = blocks.at(-1);
      const value = line.replace(/^[-*]\s+/, "");
      if (previous?.kind === "unordered") previous.lines.push(value);
      else blocks.push({ kind: "unordered", lines: [value] });
      continue;
    }
    if (/^\d+[.)]\s+/.test(line)) {
      flushParagraph();
      const previous = blocks.at(-1);
      const value = line.replace(/^\d+[.)]\s+/, "");
      if (previous?.kind === "ordered") previous.lines.push(value);
      else blocks.push({ kind: "ordered", lines: [value] });
      continue;
    }
    paragraph.push(line);
  }
  flushParagraph();
  return blocks;
}

export function MarkdownContent({
  markdown,
  emptyState,
  preserveLineBreaks = false,
}: {
  markdown: string;
  emptyState?: ReactNode;
  preserveLineBreaks?: boolean;
}) {
  const blocks = parseBlocks(markdown);
  if (!blocks.length) return <>{emptyState ?? null}</>;
  return (
    <div className="lesson-rich-content">
      {blocks.map((block, blockIndex) => {
        const key = `${block.kind}-${blockIndex}`;
        if (block.kind === "heading") {
          if (block.level === 1) return <h2 key={key}>{inline(block.lines[0])}</h2>;
          if (block.level === 2) return <h3 key={key}>{inline(block.lines[0])}</h3>;
          return <h4 key={key}>{inline(block.lines[0])}</h4>;
        }
        if (block.kind === "quote") return <blockquote key={key}>{inline(block.lines[0])}</blockquote>;
        if (block.kind === "image") return <figure key={key}><img src={block.url} alt={block.lines[0]} loading="lazy" /><figcaption>{inline(block.lines[0])}</figcaption></figure>;
        if (block.kind === "video") return <video key={key} src={block.url} controls preload="metadata">Cette vidéo ne peut pas être lue par ton navigateur.</video>;
        if (block.kind === "table") {
          const rows = block.lines
            .map((line) => line.slice(1, -1).split("|").map((cell) => cell.trim()))
            .filter((cells) => !cells.every((cell) => /^:?-{3,}:?$/.test(cell)));
          const [headings, ...bodyRows] = rows;
          return <div className="lesson-table-scroll" key={key}><table><thead><tr>{headings.map((cell, index) => <th key={`${cell}-${index}`}>{inline(cell)}</th>)}</tr></thead><tbody>{bodyRows.map((cells, rowIndex) => <tr key={`row-${rowIndex}`}>{cells.map((cell, cellIndex) => <td key={`${cell}-${cellIndex}`}>{inline(cell)}</td>)}</tr>)}</tbody></table></div>;
        }
        if (block.kind === "unordered") return <ul key={key}>{block.lines.map((line, index) => <li key={`${line}-${index}`}>{inline(line)}</li>)}</ul>;
        if (block.kind === "ordered") return <ol key={key}>{block.lines.map((line, index) => <li key={`${line}-${index}`}>{inline(line)}</li>)}</ol>;
        if (!preserveLineBreaks) return <p key={key}>{inline(block.lines.join(" "))}</p>;
        return (
          <p key={key}>
            {block.lines.map((line, lineIndex) => (
              <Fragment key={`${line}-${lineIndex}`}>
                {inline(line)}
                {lineIndex < block.lines.length - 1 ? <br /> : null}
              </Fragment>
            ))}
          </p>
        );
      })}
    </div>
  );
}
