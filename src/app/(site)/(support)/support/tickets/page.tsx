import Section from "@/shared/components/layout/section/section";
import Shell from "@/shared/components/layout/shell";

export const metadata = {
  title: "Support Tickets",
  description: "View and manage your support tickets.",
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
