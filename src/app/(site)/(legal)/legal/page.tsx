import { LegalPolicyHub } from "@/module/legal/legal.policy-hub";
import { LegalSidebar } from "@/module/legal/legal.sidebar";
import Section from "@/shared/components/layout/section/section";
import { buildPageMetadata } from "@/shared/seo/metadata-builders";

const pageHeading = {
  title: "Legal",
  description: "Policies, terms, and compliance information.",
};

export const metadata = buildPageMetadata({
  title: pageHeading.title,
  description: pageHeading.description,
  canonicalPath: "/legal",
  ogType: "website",
});

export default function Page() {
  return (
    <Section {...pageHeading}>
      <div className="grid h-full w-full grid-cols-12 gap-4">
        <div className="col-span-2 h-full w-full">
          <LegalSidebar activeSection={"legal"} />
        </div>
        <div className="col-span-10 h-full w-full">
          <LegalPolicyHub />
        </div>
      </div>
    </Section>
  );
}
