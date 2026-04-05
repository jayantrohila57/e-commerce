import Section from "@/shared/components/layout/section/section";
import Shell from "@/shared/components/layout/shell";
import { site } from "@/shared/config/site";

export const metadata = {
  title: "Contact Support",
  description: `Get in touch with ${site.name} for returns and exchanges support.`,
};

export default function Page() {
  return (
    <Shell>
      <Shell.Section>
        <Section {...metadata}>
          <h1>{metadata.title}</h1>
          <p>{metadata.description}</p>
        </Section>
      </Shell.Section>
    </Shell>
  );
}
