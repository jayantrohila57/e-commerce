import Section from "@/shared/components/layout/section/section";
import Shell from "@/shared/components/layout/shell";

export default function Page() {
  return (
    <Shell>
      <Shell.Section>
        <Section
          title="Help Center"
          description="Get answers to your questions, troubleshoot issues, and find resources to help you make the most of your digital presence."
        >
          <h1>{"Page"}</h1>
        </Section>
      </Shell.Section>
    </Shell>
  );
}
