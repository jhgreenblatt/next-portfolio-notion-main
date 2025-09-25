import Image from "next/image";
import { fetchCaseStudyBySlug } from "@/lib/notion";
import NotionRenderer from "@/components/NotionRenderer";

type Params = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Params) {
  const { slug } = await params;
  const data = await fetchCaseStudyBySlug(slug);
  return { title: data?.title || "Case Study" };
}

export default async function CasePage({ params }: Params) {
  const { slug } = await params;
  const data = await fetchCaseStudyBySlug(slug);
  if (!data) return <div className="mx-auto max-w-5xl px-4 py-16">Not found</div>;

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      {/* Title and Summary Section */}
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold">{data.title}</h1>
        {(data.role || data.year) ? (
          <div className="mt-2 text-sm text-gray-600">{[data.role, data.year].filter(Boolean).join(" · ")}</div>
        ) : null}
        {data.summary ? (
          <p className="mt-4 text-lg text-gray-700 leading-relaxed max-w-3xl">{data.summary}</p>
        ) : null}
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


