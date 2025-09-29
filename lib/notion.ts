/* eslint-disable @typescript-eslint/no-explicit-any */
import { Client } from "@notionhq/client";

const notion = new Client({ 
  auth: process.env.NOTION_API_TOKEN 
});

// Notion client initialized


export type CaseStudy = {
  id: string;
  title: string;
  slug: string;
  summary?: string;
  coverImage?: string;
  role?: string;
  year?: string;
  tags?: string[];
  articleType?: string;
  status?: string;
  publishedDate?: string;
  sortOrder?: number;
  externalLink?: string;
  seoTitle?: string;
  seoDescription?: string;
  ogImageUrl?: string;
};

export type CaseStudyDetail = CaseStudy & {
  blocks: Array<{ type: string; text?: string }>;
};

const databaseId = process.env.NOTION_DATABASE_ID as string;

export async function fetchCaseStudies(): Promise<CaseStudy[]> {
  if (!databaseId) return [];

  try {
    // Search for all pages, then filter by database_id
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
    
    return databasePages.map((page: any) => {
      const props = (page as any).properties || {};
      const title = props.title?.title?.[0]?.plain_text || "Untitled";
      const slug = props.slug?.rich_text?.[0]?.plain_text || page.id;
      const summary = props.summary?.rich_text?.[0]?.plain_text || "";
      const coverImage = props.coverImage?.url || (page as any).cover?.external?.url || (page as any).cover?.file?.url;
      const role = props.role?.rich_text?.[0]?.plain_text || "";
      const year = props.year?.number?.toString() || "";
      
      // New properties
      const tags = props.Tags?.multi_select?.map((tag: any) => tag.name) || [];
      const articleType = props.ArticleType?.select?.name || "";
      const status = props.Status?.status?.name || "";
      const publishedDate = props["Published Date"]?.date?.start || "";
      const sortOrder = props["Sort Order"]?.number || 0;
      const externalLink = props["External Link"]?.url || "";
      const seoTitle = props["SEO Title"]?.rich_text?.[0]?.plain_text || "";
      const seoDescription = props["SEO Description"]?.rich_text?.[0]?.plain_text || "";
      const ogImageUrl = props["OG Image URL"]?.rich_text?.[0]?.plain_text || "";
      
      return { 
        id: page.id, 
        title, 
        slug, 
        summary, 
        coverImage, 
        role, 
        year,
        tags,
        articleType,
        status,
        publishedDate,
        sortOrder,
        externalLink,
        seoTitle,
        seoDescription,
        ogImageUrl
      } as CaseStudy;
    });
  } catch (error) {
    console.error("Error fetching case studies:", error);
    return [];
  }
}

export async function fetchCaseStudyBySlug(slug: string): Promise<CaseStudyDetail | null> {
  if (!databaseId) return null;

  try {
    // Search for all pages, then filter by database_id
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
    const page = databasePages.find((p: any) => 
      p.properties?.slug?.rich_text?.[0]?.plain_text === slug
    );
    
    if (!page) return null;

    const props = (page as any).properties || {};
    const title = props.title?.title?.[0]?.plain_text || "Untitled";
    const summary = props.summary?.rich_text?.[0]?.plain_text || "";
    const coverImage = props.coverImage?.url || (page as any).cover?.external?.url || (page as any).cover?.file?.url;
    const role = props.role?.rich_text?.[0]?.plain_text || "";
    const year = props.year?.number?.toString() || "";
    
    // New properties
    const tags = props.Tags?.multi_select?.map((tag: any) => tag.name) || [];
    const articleType = props.ArticleType?.select?.name || "";
    const status = props.Status?.status?.name || "";
    const publishedDate = props["Published Date"]?.date?.start || "";
    const sortOrder = props["Sort Order"]?.number || 0;
    const externalLink = props["External Link"]?.url || "";
    const seoTitle = props["SEO Title"]?.rich_text?.[0]?.plain_text || "";
    const seoDescription = props["SEO Description"]?.rich_text?.[0]?.plain_text || "";
    const ogImageUrl = props["OG Image URL"]?.rich_text?.[0]?.plain_text || "";

    // Fetch the page content blocks with full rich text support
    const blocks: Array<{ 
      type: string; 
      text?: string; 
      richText?: any;
      url?: string;
      caption?: string;
    }> = [];
    
    try {
      const children = await notion.blocks.children.list({ block_id: page.id });
      for (const child of children.results as any[]) {
        const type = child.type as string;
        const blockData = child[type];
        
        // Extract rich text with full formatting
        const richText = blockData?.rich_text || null;
        const plainText = richText?.map((text: any) => text.plain_text).join('') || '';
        
        // Handle different block types
        const block: any = { 
          type, 
          text: plainText,
          richText: richText 
        };
        
        // Handle images
        if (type === 'image') {
          block.url = blockData?.file?.url || blockData?.external?.url;
          block.caption = blockData?.caption?.[0]?.plain_text;
        }
        
        blocks.push(block);
      }
    } catch (blockError) {
      console.error("Error fetching blocks:", blockError);
      // Add a fallback block with the summary
      blocks.push({ type: "paragraph", text: summary });
    }

    return {
      id: page.id,
      title,
      slug: slug,
      summary,
      coverImage,
      role,
      year,
      tags,
      articleType,
      status,
      publishedDate,
      sortOrder,
      externalLink,
      seoTitle,
      seoDescription,
      ogImageUrl,
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


