import Section from "@/shared/components/layout/section/section";
import Shell from "@/shared/components/layout/shell";

export default function Page() {
  return (
    <Shell>
      <Shell.Section>
        <Section title="Support" description="Get help with any issues or questions you may have.">
          <h1>{"Support Page"}</h1>
        </Section>
      </Shell.Section>
    </Shell>
  );
}
