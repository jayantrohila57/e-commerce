import { LegalSidebar } from "@/module/legal/legal.sidebar";
import { LegalContent } from "@/module/legal/legal.content";
import Section from "@/shared/components/layout/section/section";
import Shell from "@/shared/components/layout/shell";
import { TableOfContents } from "@/module/legal/legal.toc";
import { getMetadata } from "@/module/legal/policy-content";

export async function generateMetadata({ params }: PageProps<"/legal/[slug]">) {
  const { slug } = await params;
  return getMetadata(slug);
}

export default async function Page({ params }: PageProps<"/legal/[slug]">) {
  const { slug } = await params;
  return (
    <Shell>
      <Section className="bg-muted p-4" {...getMetadata(slug)}>
        <div className="grid h-full w-full grid-cols-12 gap-4">
          <div className="col-span-2 h-full w-full">
            <LegalSidebar activeSection={slug} />
          </div>
          <div className="col-span-8 h-full w-full">
            <LegalContent activeSection={slug} />
          </div>
          <div className="col-span-2">
            <TableOfContents activeSection={slug} />
          </div>
        </div>
      </Section>
    </Shell>
  );
}
