/* eslint-disable @typescript-eslint/no-explicit-any */
import { Client } from "@notionhq/client";

const notion = new Client({ 
  auth: process.env.NOTION_API_TOKEN 
});

// Notion client initialized

// Notion API types
interface NotionPage {
  id: string;
  properties: {
    title?: {
      title: Array<{ plain_text: string }>;
    };
    slug?: {
      rich_text: Array<{ plain_text: string }>;
    };
    summary?: {
      rich_text: Array<{ plain_text: string }>;
    };
    coverImage?: {
      url: string;
    };
    role?: {
      rich_text: Array<{ plain_text: string }>;
    };
    year?: {
      number: number;
    };
  };
  cover?: {
    external?: { url: string };
    file?: { url: string };
  };
  parent?: {
    database_id: string;
  };
}


export type CaseStudy = {
  id: string;
  title: string;
  slug: string;
  summary?: string;
  coverImage?: string;
  role?: string;
  year?: string;
};

export type CaseStudyDetail = CaseStudy & {
  blocks: Array<{ type: string; text?: string }>;
};

const databaseId = process.env.NOTION_DATABASE_ID as string;

export async function fetchCaseStudies(): Promise<CaseStudy[]> {
  if (!databaseId) return [];

  try {
    // Try using the search method instead of databases.query
    const res = await notion.search({
      filter: {
        property: "object",
        value: "page"
      },
      query: databaseId
    });
    
    // Filter results to only include pages from our database
    const databasePages = res.results?.filter((page: any) => 
      page.parent?.database_id === databaseId
    ) || [];
    
    return databasePages.map((page: any) => {
      const props = (page as any).properties || {};
      const title = props.title?.title?.[0]?.plain_text || "Untitled";
      const slug = props.slug?.rich_text?.[0]?.plain_text || page.id;
      const summary = props.summary?.rich_text?.[0]?.plain_text || "";
      const coverImage = props.coverImage?.url || (page as any).cover?.external?.url || (page as any).cover?.file?.url;
      const role = props.role?.rich_text?.[0]?.plain_text || "";
      const year = props.year?.number?.toString() || "";
      return { id: page.id, title, slug, summary, coverImage, role, year } as CaseStudy;
    });
  } catch (error) {
    console.error("Error fetching case studies:", error);
    return [];
  }
}

export async function fetchCaseStudyBySlug(slug: string): Promise<CaseStudyDetail | null> {
  if (!databaseId) return null;

  try {
    // Use the same search approach that works for fetchCaseStudies
    const res = await notion.search({
      filter: {
        property: "object",
        value: "page"
      }
    });
    
    // Filter results to only include pages from our database
    const databasePages = res.results?.filter((page: any) => 
      page.parent?.database_id === databaseId
    ) || [];
    
    // Find the page with matching slug
    const page = databasePages.find((page: any) => 
      page.properties?.slug?.rich_text?.[0]?.plain_text === slug
    );
    
    if (!page) return null;

    const props = (page as any).properties || {};
    const title = props.title?.title?.[0]?.plain_text || "Untitled";
    const summary = props.summary?.rich_text?.[0]?.plain_text || "";
    const coverImage = props.coverImage?.url || (page as any).cover?.external?.url || (page as any).cover?.file?.url;
    const role = props.role?.rich_text?.[0]?.plain_text || "";
    const year = props.year?.number?.toString() || "";

    // Fetch the page content blocks
    const blocks: Array<{ type: string; text?: string }> = [];
    try {
      const children = await notion.blocks.children.list({ block_id: page.id });
      for (const child of children.results as any[]) {
        const type = child.type as string;
        const rich = child[type]?.rich_text?.[0]?.plain_text;
        blocks.push({ type, text: rich });
      }
    } catch (blockError) {
      console.error("Error fetching blocks:", blockError);
      // Add a fallback block with the summary
      blocks.push({ type: "paragraph", text: summary });
    }

    return {
      id: page.id,
      title,
      slug,
      summary,
      coverImage,
      role,
      year,
      blocks,
    } as CaseStudyDetail;
  } catch (error) {
    console.error("Error fetching case study by slug:", error);
    return null;
  }
}

// Optional: simple home content fetcher by page ID
export async function fetchHomeContent(pageId?: string) {
  if (!pageId) return { title: "Sophie — Product Designer", subtitle: "Selected work and experiments" };
  const page = await notion.pages.retrieve({ page_id: pageId });
  const titleProp = (page as any).properties?.title?.title?.[0]?.plain_text;
  const subtitleProp = (page as any).properties?.subtitle?.rich_text?.[0]?.plain_text;
  return {
    title: titleProp || "Sophie — Product Designer",
    subtitle: subtitleProp || "Selected work and experiments",
  };
}


