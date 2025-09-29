import Image from "next/image";
import { fetchCaseStudyBySlug } from "@/lib/notion";
import NotionRenderer from "@/components/NotionRenderer";
import TagsWithOverflow from "@/components/TagsWithOverflow";

type Params = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Params) {
  const { slug } = await params;
  const data = await fetchCaseStudyBySlug(slug);
  return { 
    title: data?.seoTitle || data?.title || "Case Study",
    description: data?.seoDescription || data?.summary || "A case study from my portfolio"
  };
}

export default async function CasePage({ params }: Params) {
  const { slug } = await params;
  const data = await fetchCaseStudyBySlug(slug);
  if (!data) return <div className="mx-auto max-w-5xl px-4 py-16">Not found</div>;

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      {/* Hero Section */}
      <div className="mb-12">
        {/* Year */}
        {data.year && (
          <div className="text-sm text-gray-600 mb-2">{data.year}</div>
        )}
        
        {/* Article Title */}
        <h1 className="text-3xl md:text-5xl font-bold mb-6 leading-tight">{data.title}</h1>
        
        {/* Company Info and Tags Row */}
        <div className="flex items-center justify-between flex-wrap gap-4">
          {/* Left side: Company Logo, Name, and Role */}
          <div className="flex items-center gap-4 flex-wrap">
            {/* Company Logo and Name */}
            <div className="flex items-center gap-3">
              {data.companyLogo && (
                <div className="h-6 flex items-center">
                  <Image 
                    src={data.companyLogo} 
                    alt={data.companyName || "Company logo"} 
                    width={0}
                    height={24}
                    className="h-6 w-auto object-contain"
                    unoptimized={true}
                  />
                </div>
              )}
              {data.companyName && (
                <span className="text-base font-medium">{data.companyName}</span>
              )}
            </div>
            
            {/* Role */}
            {data.role && (
              <span className="text-base text-gray-600">{data.role}</span>
            )}
          </div>
          
          {/* Right side: Tags with max width */}
          {data.tags && data.tags.length > 0 && (
            <div className="max-w-xs">
              <TagsWithOverflow tags={data.tags} maxVisible={2} />
            </div>
          )}
        </div>
        
        {/* External Link */}
        {data.externalLink && (
          <div className="mt-6">
            <a 
              href={data.externalLink} 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800"
            >
              View Live Project →
            </a>
          </div>
        )}
      </div>

      {/* Cover Image Section */}
      {data.coverImage ? (
        <div className="relative aspect-[16/9] mb-8 rounded-lg overflow-hidden border border-gray-200/70">
          <Image src={data.coverImage} alt={data.title} fill className="object-cover" />
        </div>
      ) : null}

      {/* Content Section */}
      <div className="mt-8">
        <NotionRenderer blocks={data.blocks} />
      </div>
    </div>
  );
}


