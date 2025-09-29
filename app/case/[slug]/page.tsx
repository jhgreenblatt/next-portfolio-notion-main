import Image from "next/image";
import { fetchCaseStudyBySlug } from "@/lib/notion";
import NotionRenderer from "@/components/NotionRenderer";

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
        <div className="flex items-center gap-4 flex-wrap">
          {/* Company Logo and Name */}
          <div className="flex items-center gap-3">
            {data.companyLogo && (
              <div className="w-8 h-6 bg-gray-800 rounded flex items-center justify-center">
                <Image 
                  src={data.companyLogo} 
                  alt={data.companyName || "Company logo"} 
                  width={24} 
                  height={16}
                  className="object-contain"
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
          
          {/* Tags */}
          {data.tags && data.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {data.tags.slice(0, 3).map((tag, index) => (
                <span 
                  key={index}
                  className="text-sm border border-gray-300 rounded-full px-3 py-1"
                >
                  {tag}
                </span>
              ))}
              {data.tags.length > 3 && (
                <span className="text-sm border border-gray-300 rounded-full px-3 py-1">
                  ...
                </span>
              )}
            </div>
          )}
        </div>
        
        {/* Summary */}
        {data.summary && (
          <p className="mt-6 text-lg text-gray-700 leading-relaxed max-w-4xl">{data.summary}</p>
        )}
        
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


