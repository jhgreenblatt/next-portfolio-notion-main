import Hero from "@/components/Hero";
import CaseStudiesGrid from "@/components/CaseStudiesGrid";
import { fetchCaseStudies, fetchHomeContent } from "@/lib/notion";

export default async function Home() {
  const [home, cases] = await Promise.all([
    fetchHomeContent(process.env.NOTION_HOME_PAGE_ID),
    fetchCaseStudies(),
  ]);

  return (
    <div>
      <Hero title={home.title} subtitle={home.subtitle} />
      <section className="mx-auto max-w-5xl px-4 pb-16">
        <CaseStudiesGrid cases={cases} />
      </section>
    </div>
  );
}


