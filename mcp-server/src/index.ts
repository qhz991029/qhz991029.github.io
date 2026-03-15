#!/usr/bin/env node

// TermHub MCP Server
// AI-powered academic portfolio management via Model Context Protocol

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import fs from "node:fs";
import path from "node:path";
import { execSync, spawn, type ChildProcess } from "node:child_process";
import yaml from "js-yaml";

// ── Config ──────────────────────────────────────────────────────────

const PROJECT_ROOT = process.env.TERMHUB_ROOT || path.resolve(process.cwd(), "..");
const CONTENT_DIR = path.join(PROJECT_ROOT, "content");
const PUBLIC_DIR = path.join(PROJECT_ROOT, "public");
const TYPES_FILE = path.join(PROJECT_ROOT, "src", "types", "index.ts");

let devServerProcess: ChildProcess | null = null;

// ── Helpers ─────────────────────────────────────────────────────────

function ensureDir(dir: string) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

function readJson(filePath: string): unknown {
  const content = fs.readFileSync(filePath, "utf-8");
  return JSON.parse(content);
}

function writeJson(filePath: string, data: unknown) {
  ensureDir(path.dirname(filePath));
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2) + "\n", "utf-8");
}

function readMarkdownFile(filePath: string): { frontmatter: Record<string, unknown>; body: string } {
  const content = fs.readFileSync(filePath, "utf-8");
  const fmMatch = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (fmMatch) {
    const frontmatter = yaml.load(fmMatch[1]) as Record<string, unknown>;
    return { frontmatter, body: fmMatch[2].trim() };
  }
  return { frontmatter: {}, body: content.trim() };
}

function writeMarkdownFile(filePath: string, frontmatter: Record<string, unknown>, body: string) {
  ensureDir(path.dirname(filePath));
  const fmYaml = yaml.dump(frontmatter, { lineWidth: -1, quotingType: '"', forceQuotes: false });
  const content = `---\n${fmYaml}---\n\n${body}\n`;
  fs.writeFileSync(filePath, content, "utf-8");
}

function listContentFiles(): { json: string[]; markdown: Record<string, string[]> } {
  const result: { json: string[]; markdown: Record<string, string[]> } = {
    json: [],
    markdown: {},
  };

  if (!fs.existsSync(CONTENT_DIR)) return result;

  const entries = fs.readdirSync(CONTENT_DIR, { withFileTypes: true });
  for (const entry of entries) {
    if (entry.isFile() && entry.name.endsWith(".json")) {
      result.json.push(entry.name);
    }
    if (entry.isFile() && entry.name.endsWith(".md")) {
      if (!result.markdown["."]) result.markdown["."] = [];
      result.markdown["."].push(entry.name);
    }
    if (entry.isDirectory()) {
      const subDir = path.join(CONTENT_DIR, entry.name);
      const subEntries = fs.readdirSync(subDir);
      const mdFiles = subEntries.filter((f) => f.endsWith(".md"));
      if (mdFiles.length > 0) {
        result.markdown[entry.name] = mdFiles;
      }
    }
  }
  return result;
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

// ── Schemas for tool inputs ─────────────────────────────────────────

const ContentTypeEnum = z.enum([
  "site", "experience", "news", "awards", "research", "logos",
]);

const MarkdownCategoryEnum = z.enum([
  "projects", "publications", "articles", "about",
]);

const ProjectCategoryEnum = z.enum([
  "robotics", "nlp", "web-app", "data", "tooling", "healthcare",
]);

const VenueTypeEnum = z.enum(["conference", "workshop", "demo", "preprint"]);
const PublicationStatusEnum = z.enum(["accepted", "published", "preprint"]);

// ── MCP Server ──────────────────────────────────────────────────────

const server = new McpServer({
  name: "termhub",
  version: "1.0.0",
});

// ── Tool: get_schema ────────────────────────────────────────────────

server.tool(
  "get_schema",
  "Get TermHub TypeScript type definitions and content file schemas. " +
    "Call this first to understand the data structures before creating content.",
  {},
  async () => {
    let typesContent = "";
    if (fs.existsSync(TYPES_FILE)) {
      typesContent = fs.readFileSync(TYPES_FILE, "utf-8");
    }

    const siteJson = fs.existsSync(path.join(CONTENT_DIR, "site.json"))
      ? JSON.stringify(readJson(path.join(CONTENT_DIR, "site.json")), null, 2)
      : "{}";

    return {
      content: [
        {
          type: "text" as const,
          text: `# TermHub Data Schema

## TypeScript Interfaces (src/types/index.ts)
\`\`\`typescript
${typesContent}
\`\`\`

## Site Config Structure (content/site.json)
\`\`\`json
${siteJson}
\`\`\`

## Content File Layout
- \`content/site.json\` — Profile, social links, features, terminal config
- \`content/experience.json\` — Education, timeline entries, reviewing
- \`content/news.json\` — News items array
- \`content/awards.json\` — Awards array
- \`content/research.json\` — Current research labs
- \`content/logos.json\` — Institution logo filename map
- \`content/about.md\` — About page (YAML frontmatter + markdown body)
- \`content/projects/*.md\` — Project entries (YAML frontmatter + markdown body)
- \`content/publications/*.md\` — Publication entries (YAML frontmatter + markdown body)
- \`content/articles/*.md\` — Article entries (YAML frontmatter + markdown body)

## Markdown Frontmatter Examples

### Publication (\`content/publications/example.md\`)
\`\`\`yaml
---
id: unique-id-2025
title: "Paper Title"
authors: [Author One, Author Two]
venue: ConferenceName
venueType: conference  # conference | workshop | demo | preprint
year: 2025
status: published      # accepted | published | preprint
isFirstAuthor: true
links:
  paper: https://...
  arxiv: https://...
  code: https://...
emoji: "📄"
---
Abstract text here.
\`\`\`

### Project (\`content/projects/example.md\`)
\`\`\`yaml
---
title: Project Name
category: nlp           # robotics | nlp | web-app | data | tooling | healthcare
date: 2025-01-15
tags: [Python, PyTorch]
link: https://...
isOpenSource: true
badge: "🏆 Award"
---
Project description paragraph.

## Highlights
- First highlight
- Second highlight
\`\`\`
`,
        },
      ],
    };
  }
);

// ── Tool: list_content ──────────────────────────────────────────────

server.tool(
  "list_content",
  "List all content files in the TermHub content directory",
  {},
  async () => {
    const files = listContentFiles();
    return {
      content: [
        {
          type: "text" as const,
          text: JSON.stringify(files, null, 2),
        },
      ],
    };
  }
);

// ── Tool: read_content ──────────────────────────────────────────────

server.tool(
  "read_content",
  "Read a content file from TermHub. For JSON files, returns parsed JSON. " +
    "For Markdown files, returns frontmatter + body separately.",
  {
    file_path: z
      .string()
      .describe(
        "Relative path within content/ directory, e.g. 'site.json', 'projects/my-project.md', 'about.md'"
      ),
  },
  async ({ file_path }) => {
    const fullPath = path.join(CONTENT_DIR, file_path);
    if (!fs.existsSync(fullPath)) {
      return {
        content: [{ type: "text" as const, text: `Error: File not found: content/${file_path}` }],
        isError: true,
      };
    }

    if (file_path.endsWith(".json")) {
      const data = readJson(fullPath);
      return {
        content: [{ type: "text" as const, text: JSON.stringify(data, null, 2) }],
      };
    }

    if (file_path.endsWith(".md")) {
      const { frontmatter, body } = readMarkdownFile(fullPath);
      return {
        content: [
          {
            type: "text" as const,
            text: JSON.stringify({ frontmatter, body }, null, 2),
          },
        ],
      };
    }

    const raw = fs.readFileSync(fullPath, "utf-8");
    return { content: [{ type: "text" as const, text: raw }] };
  }
);

// ── Tool: write_json_content ────────────────────────────────────────

server.tool(
  "write_json_content",
  "Write or update a JSON content file (site.json, experience.json, news.json, awards.json, research.json, logos.json)",
  {
    file_name: ContentTypeEnum.describe("Which JSON content file to write"),
    data: z.string().describe("JSON string of the data to write"),
  },
  async ({ file_name, data }) => {
    try {
      const parsed = JSON.parse(data);
      const filePath = path.join(CONTENT_DIR, `${file_name}.json`);
      writeJson(filePath, parsed);
      return {
        content: [
          {
            type: "text" as const,
            text: `Successfully wrote content/${file_name}.json`,
          },
        ],
      };
    } catch (e) {
      return {
        content: [
          {
            type: "text" as const,
            text: `Error writing ${file_name}.json: ${e instanceof Error ? e.message : String(e)}`,
          },
        ],
        isError: true,
      };
    }
  }
);

// ── Tool: write_markdown_content ────────────────────────────────────

server.tool(
  "write_markdown_content",
  "Write or update a Markdown content file with YAML frontmatter. " +
    "For projects/publications/articles, specify the category and a slug for the filename. " +
    "For about.md, use category='about'.",
  {
    category: MarkdownCategoryEnum.describe("Content category folder"),
    slug: z
      .string()
      .optional()
      .describe("Filename slug (without .md). Auto-generated from title if omitted. Ignored for 'about'."),
    frontmatter: z.string().describe("JSON string of YAML frontmatter fields"),
    body: z.string().describe("Markdown body content"),
  },
  async ({ category, slug, frontmatter, body }) => {
    try {
      const fm = JSON.parse(frontmatter) as Record<string, unknown>;

      let filePath: string;
      if (category === "about") {
        filePath = path.join(CONTENT_DIR, "about.md");
      } else {
        const fileName = slug || slugify(String(fm.title || "untitled"));
        filePath = path.join(CONTENT_DIR, category, `${fileName}.md`);
      }

      writeMarkdownFile(filePath, fm, body);

      const relPath = path.relative(PROJECT_ROOT, filePath);
      return {
        content: [
          { type: "text" as const, text: `Successfully wrote ${relPath}` },
        ],
      };
    } catch (e) {
      return {
        content: [
          {
            type: "text" as const,
            text: `Error: ${e instanceof Error ? e.message : String(e)}`,
          },
        ],
        isError: true,
      };
    }
  }
);

// ── Tool: delete_content ────────────────────────────────────────────

server.tool(
  "delete_content",
  "Delete a content file from TermHub",
  {
    file_path: z
      .string()
      .describe("Relative path within content/ directory, e.g. 'projects/old-project.md'"),
  },
  async ({ file_path }) => {
    const fullPath = path.join(CONTENT_DIR, file_path);
    if (!fs.existsSync(fullPath)) {
      return {
        content: [{ type: "text" as const, text: `File not found: content/${file_path}` }],
        isError: true,
      };
    }
    fs.unlinkSync(fullPath);
    return {
      content: [{ type: "text" as const, text: `Deleted content/${file_path}` }],
    };
  }
);

// ── Tool: update_site_config ────────────────────────────────────────

server.tool(
  "update_site_config",
  "Update specific fields in site.json without overwriting the entire file. " +
    "Accepts a partial JSON object that will be deep-merged with existing config.",
  {
    updates: z.string().describe("JSON string of fields to merge into site.json"),
  },
  async ({ updates }) => {
    try {
      const siteJsonPath = path.join(CONTENT_DIR, "site.json");
      const existing = fs.existsSync(siteJsonPath)
        ? (readJson(siteJsonPath) as Record<string, unknown>)
        : {};
      const patch = JSON.parse(updates) as Record<string, unknown>;

      // Deep merge
      function deepMerge(target: Record<string, unknown>, source: Record<string, unknown>): Record<string, unknown> {
        const result = { ...target };
        for (const key of Object.keys(source)) {
          if (
            source[key] &&
            typeof source[key] === "object" &&
            !Array.isArray(source[key]) &&
            target[key] &&
            typeof target[key] === "object" &&
            !Array.isArray(target[key])
          ) {
            result[key] = deepMerge(
              target[key] as Record<string, unknown>,
              source[key] as Record<string, unknown>
            );
          } else {
            result[key] = source[key];
          }
        }
        return result;
      }

      const merged = deepMerge(existing, patch);
      writeJson(siteJsonPath, merged);

      return {
        content: [
          {
            type: "text" as const,
            text: `Successfully updated site.json. Updated fields: ${Object.keys(patch).join(", ")}`,
          },
        ],
      };
    } catch (e) {
      return {
        content: [
          {
            type: "text" as const,
            text: `Error: ${e instanceof Error ? e.message : String(e)}`,
          },
        ],
        isError: true,
      };
    }
  }
);

// ── Tool: add_publication ───────────────────────────────────────────

server.tool(
  "add_publication",
  "Add a single publication entry as a Markdown file in content/publications/",
  {
    id: z.string().describe("Unique publication ID, e.g. 'acl2025-my-paper'"),
    title: z.string().describe("Paper title"),
    authors: z.array(z.string()).describe("List of author names"),
    venue: z.string().describe("Publication venue name"),
    venue_type: VenueTypeEnum.describe("Type of venue"),
    year: z.number().describe("Publication year"),
    status: PublicationStatusEnum.describe("Publication status"),
    abstract: z.string().optional().describe("Paper abstract"),
    is_first_author: z.boolean().optional().describe("Whether you are first author"),
    links: z
      .object({
        paper: z.string().optional(),
        arxiv: z.string().optional(),
        code: z.string().optional(),
        demo: z.string().optional(),
        dataset: z.string().optional(),
        projectPage: z.string().optional(),
      })
      .optional()
      .describe("Related links"),
    emoji: z.string().optional().describe("Display emoji"),
    keywords: z.array(z.string()).optional().describe("Keywords"),
  },
  async (params) => {
    const frontmatter: Record<string, unknown> = {
      id: params.id,
      title: params.title,
      authors: params.authors,
      venue: params.venue,
      venueType: params.venue_type,
      year: params.year,
      status: params.status,
    };

    if (params.is_first_author) frontmatter.isFirstAuthor = true;
    if (params.emoji) frontmatter.emoji = params.emoji;
    if (params.keywords) frontmatter.keywords = params.keywords;
    if (params.links) {
      const links: Record<string, string> = {};
      for (const [k, v] of Object.entries(params.links)) {
        if (v) links[k] = v;
      }
      if (Object.keys(links).length > 0) frontmatter.links = links;
    }

    const body = params.abstract || "";
    const slug = slugify(params.id);
    const filePath = path.join(CONTENT_DIR, "publications", `${slug}.md`);

    writeMarkdownFile(filePath, frontmatter, body);

    return {
      content: [
        {
          type: "text" as const,
          text: `Added publication: content/publications/${slug}.md`,
        },
      ],
    };
  }
);

// ── Tool: add_project ───────────────────────────────────────────────

server.tool(
  "add_project",
  "Add a single project entry as a Markdown file in content/projects/",
  {
    title: z.string().describe("Project title"),
    category: ProjectCategoryEnum.describe("Project category"),
    summary: z.string().describe("Short project description"),
    tags: z.array(z.string()).describe("Technology tags"),
    date: z.string().optional().describe("Project date (YYYY-MM-DD)"),
    link: z.string().optional().describe("Project URL"),
    is_open_source: z.boolean().optional().describe("Whether the project is open source"),
    badge: z.string().optional().describe("Display badge text"),
    highlights: z.array(z.string()).optional().describe("Key highlights as bullet points"),
    slug: z.string().optional().describe("Filename slug (auto-generated from title if omitted)"),
  },
  async (params) => {
    const frontmatter: Record<string, unknown> = {
      title: params.title,
      category: params.category,
      tags: params.tags,
    };

    if (params.date) frontmatter.date = params.date;
    if (params.link) frontmatter.link = params.link;
    if (params.is_open_source) frontmatter.isOpenSource = true;
    if (params.badge) frontmatter.badge = params.badge;

    let body = params.summary + "\n";
    if (params.highlights && params.highlights.length > 0) {
      body += "\n## Highlights\n\n";
      for (const h of params.highlights) {
        body += `- ${h}\n`;
      }
    }

    const fileName = params.slug || slugify(params.title);
    const filePath = path.join(CONTENT_DIR, "projects", `${fileName}.md`);

    writeMarkdownFile(filePath, frontmatter, body);

    return {
      content: [
        {
          type: "text" as const,
          text: `Added project: content/projects/${fileName}.md`,
        },
      ],
    };
  }
);

// ── Tool: add_experience ────────────────────────────────────────────

server.tool(
  "add_experience",
  "Add a timeline entry to experience.json",
  {
    title: z.string().describe("Job/position title"),
    company: z.string().describe("Company or organization name"),
    company_url: z.string().optional().describe("Company website URL"),
    location: z.string().optional().describe("Location"),
    start: z.string().describe("Start date (YYYY-MM-DD)"),
    end: z.string().optional().describe("End date (YYYY-MM-DD), omit for current positions"),
    category: z.enum(["research", "industry", "academic", "leadership"]).describe("Experience category"),
    role_type: z.enum(["research", "mle", "sde", "teaching", "leadership"]).optional().describe("Role type"),
    summary: z.string().optional().describe("Brief summary"),
    highlights: z.array(z.string()).describe("Key achievements"),
    is_current: z.boolean().optional().describe("Whether this is a current position"),
  },
  async (params) => {
    const expPath = path.join(CONTENT_DIR, "experience.json");
    const existing = fs.existsSync(expPath)
      ? (readJson(expPath) as Record<string, unknown>)
      : { education: { courses: [] }, reviewing: [], timeline: [] };

    const timeline = (existing.timeline as unknown[]) || [];

    const entry: Record<string, unknown> = {
      title: params.title,
      company: params.company,
      start: params.start,
      category: params.category,
      highlights: params.highlights,
    };

    if (params.company_url) entry.companyUrl = params.company_url;
    if (params.location) entry.location = params.location;
    if (params.end) entry.end = params.end;
    if (params.role_type) entry.roleType = params.role_type;
    if (params.summary) entry.summary = params.summary;
    if (params.is_current) entry.isCurrent = true;

    timeline.push(entry);
    existing.timeline = timeline;
    writeJson(expPath, existing);

    return {
      content: [
        {
          type: "text" as const,
          text: `Added experience entry: ${params.title} at ${params.company}`,
        },
      ],
    };
  }
);

// ── Tool: add_education ─────────────────────────────────────────────

server.tool(
  "add_education",
  "Add an education entry to experience.json",
  {
    course: z.string().describe("Degree or course name, e.g. 'M.S. Computer Science'"),
    institution: z.string().describe("Institution name"),
    year: z.string().describe("Year range, e.g. '2022-2024'"),
  },
  async (params) => {
    const expPath = path.join(CONTENT_DIR, "experience.json");
    const existing = fs.existsSync(expPath)
      ? (readJson(expPath) as Record<string, unknown>)
      : { education: { courses: [] }, reviewing: [], timeline: [] };

    const education = (existing.education as Record<string, unknown>) || { courses: [] };
    const courses = (education.courses as unknown[]) || [];
    courses.push({
      course: params.course,
      institution: params.institution,
      year: params.year,
    });
    education.courses = courses;
    existing.education = education;
    writeJson(expPath, existing);

    return {
      content: [
        {
          type: "text" as const,
          text: `Added education: ${params.course} at ${params.institution}`,
        },
      ],
    };
  }
);

// ── Tool: add_news ──────────────────────────────────────────────────

server.tool(
  "add_news",
  "Add a news item to news.json",
  {
    type: z.string().describe("News type: publication, talk, release, award, etc."),
    badge: z.string().describe("Badge label displayed on the news item"),
    icon: z.string().describe("React icon component name, e.g. 'FaFileAlt', 'FaRocket'"),
    icon_color: z.string().describe("Chakra UI color, e.g. 'blue.400', 'green.400'"),
    title: z.string().describe("News headline"),
    description: z.string().describe("News description"),
    date: z.string().optional().describe("Display date, e.g. 'Mar 2025'"),
    sort_date: z.string().optional().describe("Sort date in YYYY-MM-DD format"),
    links: z
      .array(
        z.object({
          text: z.string(),
          url: z.string(),
          icon: z.string().optional(),
        })
      )
      .optional()
      .describe("Related links"),
  },
  async (params) => {
    const newsPath = path.join(CONTENT_DIR, "news.json");
    const existing = fs.existsSync(newsPath) ? (readJson(newsPath) as unknown[]) : [];

    const item: Record<string, unknown> = {
      type: params.type,
      badge: params.badge,
      icon: params.icon,
      iconColor: params.icon_color,
      title: params.title,
      description: params.description,
    };

    if (params.date) item.date = params.date;
    if (params.sort_date) item.sortDate = params.sort_date;
    if (params.links) item.links = params.links;
    else item.links = [];

    existing.unshift(item); // Add to top (newest first)
    writeJson(newsPath, existing);

    return {
      content: [
        { type: "text" as const, text: `Added news item: ${params.title}` },
      ],
    };
  }
);

// ── Tool: add_award ─────────────────────────────────────────────────

server.tool(
  "add_award",
  "Add an award/honor to awards.json",
  {
    title: z.string().describe("Award title"),
    org: z.string().optional().describe("Awarding organization"),
    date: z.string().describe("Date, e.g. 'Dec 2025'"),
    kind: z
      .enum(["grant", "hackathon", "travel", "scholarship", "honor", "employment", "competition", "innovation", "other"])
      .optional()
      .describe("Award type"),
    link: z.string().optional().describe("Link URL"),
  },
  async (params) => {
    const awardsPath = path.join(CONTENT_DIR, "awards.json");
    const existing = fs.existsSync(awardsPath) ? (readJson(awardsPath) as unknown[]) : [];

    const item: Record<string, unknown> = {
      title: params.title,
      date: params.date,
    };
    if (params.org) item.org = params.org;
    if (params.kind) item.kind = params.kind;
    if (params.link) item.link = params.link;

    existing.unshift(item);
    writeJson(awardsPath, existing);

    return {
      content: [
        { type: "text" as const, text: `Added award: ${params.title}` },
      ],
    };
  }
);

// ── Tool: parse_pdf ─────────────────────────────────────────────────

server.tool(
  "parse_pdf",
  "Parse a PDF file (e.g. resume/CV) and extract its text content. " +
    "Returns plain text that can then be used with other tools to populate the portfolio.",
  {
    file_path: z.string().describe("Absolute path to the PDF file"),
  },
  async ({ file_path }) => {
    try {
      if (!fs.existsSync(file_path)) {
        return {
          content: [{ type: "text" as const, text: `Error: File not found: ${file_path}` }],
          isError: true,
        };
      }

      const pdfParse = (await import("pdf-parse")).default;
      const buffer = fs.readFileSync(file_path);
      const data = await pdfParse(buffer);

      return {
        content: [
          {
            type: "text" as const,
            text: `# PDF Content (${data.numpages} pages)\n\n${data.text}`,
          },
        ],
      };
    } catch (e) {
      return {
        content: [
          {
            type: "text" as const,
            text: `Error parsing PDF: ${e instanceof Error ? e.message : String(e)}`,
          },
        ],
        isError: true,
      };
    }
  }
);

// ── Tool: generate_from_resume ──────────────────────────────────────

server.tool(
  "generate_from_resume",
  "All-in-one tool: Takes resume/CV text content and generates a structured extraction " +
    "with instructions for populating all TermHub content files. Returns a JSON blueprint " +
    "that maps resume sections to TermHub tools. The AI should then call individual tools " +
    "to actually write the files.",
  {
    resume_text: z.string().describe("Plain text content of the resume/CV"),
    owner_name: z.string().describe("Full name of the portfolio owner"),
    nickname: z.string().optional().describe("Preferred display name / nickname"),
    email: z.string().optional().describe("Contact email"),
    academic_email: z.string().optional().describe("Academic email (.edu)"),
    github: z.string().optional().describe("GitHub profile URL"),
    linkedin: z.string().optional().describe("LinkedIn profile URL"),
    google_scholar: z.string().optional().describe("Google Scholar URL"),
    avatar_path: z.string().optional().describe("Path to avatar image file"),
  },
  async (params) => {
    // Copy avatar if provided
    let avatarFileName = "";
    if (params.avatar_path && fs.existsSync(params.avatar_path)) {
      const ext = path.extname(params.avatar_path);
      avatarFileName = `avatar${ext}`;
      ensureDir(path.join(PUBLIC_DIR, "img"));
      fs.copyFileSync(params.avatar_path, path.join(PUBLIC_DIR, "img", avatarFileName));
    }

    // Build the extraction blueprint
    const blueprint = {
      instructions:
        "Below is a structured blueprint extracted from the resume. " +
        "Use the individual TermHub MCP tools (update_site_config, add_publication, " +
        "add_project, add_experience, add_education, write_markdown_content, etc.) " +
        "to populate each section. The resume text is included for reference.",

      site_config: {
        tool: "update_site_config",
        suggested_data: {
          name: {
            full: params.owner_name,
            first: params.owner_name.split(" ")[0],
            nickname: params.nickname || params.owner_name.split(" ")[0],
            last: params.owner_name.split(" ").slice(1).join(" "),
            display: params.nickname || params.owner_name,
            authorVariants: [params.owner_name],
          },
          title: `Hi, I'm ${params.nickname || params.owner_name.split(" ")[0]}`,
          avatar: avatarFileName || "avatar.jpg",
          terminal: {
            username: slugify(params.nickname || params.owner_name.split(" ")[0]),
          },
          contact: {
            email: params.email || "",
            academicEmail: params.academic_email || "",
          },
          social: {
            github: params.github || "",
            linkedin: params.linkedin || "",
            googleScholar: params.google_scholar || "",
          },
        },
      },

      sections_to_extract: [
        {
          section: "Education",
          tool: "add_education",
          hint: "Extract degree, institution, year range for each education entry",
        },
        {
          section: "Experience / Work History",
          tool: "add_experience",
          hint: "Extract title, company, dates, highlights for each position. " +
            "Set category: research|industry|academic|leadership, roleType: research|mle|sde|teaching|leadership",
        },
        {
          section: "Publications",
          tool: "add_publication",
          hint: "Extract title, authors, venue, year, status, links for each paper. " +
            "Generate a unique ID like 'venue2025-short-title'",
        },
        {
          section: "Projects",
          tool: "add_project",
          hint: "Extract title, summary, tags, category, highlights for each project. " +
            "Map to categories: robotics|nlp|web-app|data|tooling|healthcare",
        },
        {
          section: "Awards & Honors",
          tool: "add_award",
          hint: "Extract title, org, date, kind for each award",
        },
        {
          section: "Research Interests",
          tool: "write_json_content (file_name: 'research')",
          hint: "Extract current research labs/groups with advisor, focus, link",
        },
        {
          section: "About / Bio",
          tool: "write_markdown_content (category: 'about')",
          hint: "Generate a narrative journey description and timeline phases from the resume",
        },
      ],

      resume_text: params.resume_text,
    };

    return {
      content: [
        {
          type: "text" as const,
          text: JSON.stringify(blueprint, null, 2),
        },
      ],
    };
  }
);

// ── Tool: manage_assets ─────────────────────────────────────────────

server.tool(
  "manage_assets",
  "Copy images or other assets to the public directory for use in the portfolio",
  {
    action: z.enum(["copy", "list"]).describe("Action to perform"),
    source_path: z
      .string()
      .optional()
      .describe("Absolute path to source file (for 'copy' action)"),
    destination: z
      .enum(["img", "logos", "project-images", "publication-images", "files"])
      .optional()
      .describe("Destination subdirectory in public/"),
    filename: z
      .string()
      .optional()
      .describe("Target filename (defaults to source filename)"),
  },
  async ({ action, source_path, destination, filename }) => {
    if (action === "list") {
      const result: Record<string, string[]> = {};
      const dirs = ["img", "logos", "project-images", "publication-images", "files"];
      for (const dir of dirs) {
        const dirPath = path.join(PUBLIC_DIR, dir);
        if (fs.existsSync(dirPath)) {
          result[dir] = fs.readdirSync(dirPath);
        }
      }
      return {
        content: [
          { type: "text" as const, text: JSON.stringify(result, null, 2) },
        ],
      };
    }

    if (!source_path || !destination) {
      return {
        content: [
          {
            type: "text" as const,
            text: "Error: source_path and destination required for 'copy' action",
          },
        ],
        isError: true,
      };
    }

    if (!fs.existsSync(source_path)) {
      return {
        content: [
          { type: "text" as const, text: `Error: Source file not found: ${source_path}` },
        ],
        isError: true,
      };
    }

    const destDir = path.join(PUBLIC_DIR, destination);
    ensureDir(destDir);
    const targetName = filename || path.basename(source_path);
    const destPath = path.join(destDir, targetName);
    fs.copyFileSync(source_path, destPath);

    return {
      content: [
        {
          type: "text" as const,
          text: `Copied to public/${destination}/${targetName}`,
        },
      ],
    };
  }
);

// ── Tool: preview_site ──────────────────────────────────────────────

server.tool(
  "preview_site",
  "Build or start the TermHub dev server for preview",
  {
    action: z
      .enum(["dev", "build", "stop"])
      .describe("'dev' starts dev server, 'build' creates production build, 'stop' stops dev server"),
  },
  async ({ action }) => {
    try {
      if (action === "stop") {
        if (devServerProcess) {
          devServerProcess.kill();
          devServerProcess = null;
          return {
            content: [{ type: "text" as const, text: "Dev server stopped." }],
          };
        }
        return {
          content: [{ type: "text" as const, text: "No dev server running." }],
        };
      }

      if (action === "build") {
        const output = execSync("npm run build", {
          cwd: PROJECT_ROOT,
          encoding: "utf-8",
          timeout: 120000,
        });
        return {
          content: [
            {
              type: "text" as const,
              text: `Build completed successfully.\n\n${output.slice(-500)}`,
            },
          ],
        };
      }

      // action === "dev"
      if (devServerProcess) {
        return {
          content: [
            { type: "text" as const, text: "Dev server is already running." },
          ],
        };
      }

      devServerProcess = spawn("npm", ["run", "dev"], {
        cwd: PROJECT_ROOT,
        stdio: ["ignore", "pipe", "pipe"],
      });

      // Wait for the server to output the URL
      const url = await new Promise<string>((resolve, reject) => {
        const timeout = setTimeout(() => reject(new Error("Dev server start timeout")), 15000);
        devServerProcess!.stdout?.on("data", (data: Buffer) => {
          const text = data.toString();
          const urlMatch = text.match(/(https?:\/\/localhost:\d+)/);
          if (urlMatch) {
            clearTimeout(timeout);
            resolve(urlMatch[1]);
          }
        });
        devServerProcess!.on("error", (err) => {
          clearTimeout(timeout);
          reject(err);
        });
      });

      return {
        content: [
          {
            type: "text" as const,
            text: `Dev server started at ${url}`,
          },
        ],
      };
    } catch (e) {
      return {
        content: [
          {
            type: "text" as const,
            text: `Error: ${e instanceof Error ? e.message : String(e)}`,
          },
        ],
        isError: true,
      };
    }
  }
);

// ── Tool: get_site_status ───────────────────────────────────────────

server.tool(
  "get_site_status",
  "Get an overview of the current TermHub portfolio content — what's configured, " +
    "how many publications/projects/etc exist, and what's missing.",
  {},
  async () => {
    const status: Record<string, unknown> = {};

    // Site config
    const siteJsonPath = path.join(CONTENT_DIR, "site.json");
    if (fs.existsSync(siteJsonPath)) {
      const site = readJson(siteJsonPath) as Record<string, unknown>;
      const name = site.name as Record<string, string> | undefined;
      status.profile = {
        name: name?.display || "(not set)",
        avatar: site.avatar || "(not set)",
        features: site.features || {},
      };
    } else {
      status.profile = "(site.json not found)";
    }

    // Count content
    const files = listContentFiles();

    status.content_counts = {
      publications: files.markdown["publications"]?.length || 0,
      projects: files.markdown["projects"]?.length || 0,
      articles: files.markdown["articles"]?.length || 0,
      has_about: files.markdown["."]?.includes("about.md") || false,
    };

    // JSON data counts
    const newsPath = path.join(CONTENT_DIR, "news.json");
    const awardsPath = path.join(CONTENT_DIR, "awards.json");
    const expPath = path.join(CONTENT_DIR, "experience.json");

    if (fs.existsSync(newsPath)) {
      const news = readJson(newsPath) as unknown[];
      status.content_counts = {
        ...(status.content_counts as Record<string, unknown>),
        news: news.length,
      };
    }

    if (fs.existsSync(awardsPath)) {
      const awards = readJson(awardsPath) as unknown[];
      status.content_counts = {
        ...(status.content_counts as Record<string, unknown>),
        awards: awards.length,
      };
    }

    if (fs.existsSync(expPath)) {
      const exp = readJson(expPath) as Record<string, unknown>;
      const timeline = (exp.timeline as unknown[]) || [];
      const edu = (exp.education as Record<string, unknown>) || {};
      const courses = (edu.courses as unknown[]) || [];
      status.content_counts = {
        ...(status.content_counts as Record<string, unknown>),
        experience_entries: timeline.length,
        education_entries: courses.length,
      };
    }

    // Assets
    const imgDir = path.join(PUBLIC_DIR, "img");
    const logosDir = path.join(PUBLIC_DIR, "logos");
    status.assets = {
      images: fs.existsSync(imgDir) ? fs.readdirSync(imgDir).length : 0,
      logos: fs.existsSync(logosDir) ? fs.readdirSync(logosDir).length : 0,
    };

    // Dev server
    status.dev_server_running = devServerProcess !== null;

    return {
      content: [
        { type: "text" as const, text: JSON.stringify(status, null, 2) },
      ],
    };
  }
);

// ── Tool: reset_content ─────────────────────────────────────────────

server.tool(
  "reset_content",
  "Reset all content to empty/default state. WARNING: This deletes all existing content! " +
    "Useful when starting fresh from a resume import.",
  {
    confirm: z
      .literal("yes-delete-all-content")
      .describe("Must be exactly 'yes-delete-all-content' to confirm"),
  },
  async ({ confirm }) => {
    if (confirm !== "yes-delete-all-content") {
      return {
        content: [
          { type: "text" as const, text: "Reset cancelled. Confirmation string did not match." },
        ],
      };
    }

    // Clear markdown directories
    for (const dir of ["projects", "publications", "articles"]) {
      const dirPath = path.join(CONTENT_DIR, dir);
      if (fs.existsSync(dirPath)) {
        for (const file of fs.readdirSync(dirPath)) {
          if (file.endsWith(".md")) {
            fs.unlinkSync(path.join(dirPath, file));
          }
        }
      }
    }

    // Reset JSON files to empty defaults
    writeJson(path.join(CONTENT_DIR, "news.json"), []);
    writeJson(path.join(CONTENT_DIR, "awards.json"), []);
    writeJson(path.join(CONTENT_DIR, "experience.json"), {
      education: { courses: [] },
      reviewing: [],
      timeline: [],
    });
    writeJson(path.join(CONTENT_DIR, "research.json"), { currentResearch: [] });
    writeJson(path.join(CONTENT_DIR, "logos.json"), {});

    // Reset about.md
    writeMarkdownFile(
      path.join(CONTENT_DIR, "about.md"),
      {
        journeyPhases: [],
        version: { current: "v1.0.0", history: [] },
      },
      ""
    );

    // Reset site.json to minimal
    const siteJsonPath = path.join(CONTENT_DIR, "site.json");
    const existing = fs.existsSync(siteJsonPath)
      ? (readJson(siteJsonPath) as Record<string, unknown>)
      : {};
    // Keep features config but reset personal data
    writeJson(siteJsonPath, {
      _comment: "Your basic info. Edit the values below, then run: npm run dev",
      name: { full: "", first: "", nickname: "", last: "", display: "", authorVariants: [] },
      title: "",
      avatar: "avatar.jpg",
      terminal: { username: "user", rotatingSubtitles: [], skills: [], timezone: "America/New_York" },
      contact: { email: "", academicEmail: "", location: "" },
      social: { github: "", linkedin: "", googleScholar: "" },
      pets: [],
      features: existing.features || {
        publications: true,
        projects: true,
        articles: true,
        experience: true,
        news: true,
        pets: false,
        guide: true,
      },
      heroSocialIcons: [],
      selectedPublicationIds: [],
    });

    return {
      content: [
        {
          type: "text" as const,
          text: "All content has been reset to defaults. Ready for fresh content generation.",
        },
      ],
    };
  }
);

// ── Resources ───────────────────────────────────────────────────────

server.resource(
  "site-config",
  "termhub://config/site",
  async () => {
    const siteJsonPath = path.join(CONTENT_DIR, "site.json");
    if (!fs.existsSync(siteJsonPath)) {
      return { contents: [{ uri: "termhub://config/site", text: "{}", mimeType: "application/json" }] };
    }
    return {
      contents: [
        {
          uri: "termhub://config/site",
          text: fs.readFileSync(siteJsonPath, "utf-8"),
          mimeType: "application/json",
        },
      ],
    };
  }
);

server.resource(
  "schema",
  "termhub://schema/types",
  async () => {
    const content = fs.existsSync(TYPES_FILE) ? fs.readFileSync(TYPES_FILE, "utf-8") : "";
    return {
      contents: [
        {
          uri: "termhub://schema/types",
          text: content,
          mimeType: "text/typescript",
        },
      ],
    };
  }
);

// ── Start Server ────────────────────────────────────────────────────

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("TermHub MCP Server running on stdio");
}

main().catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});
