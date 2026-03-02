import Section from "@/shared/components/layout/section/section";
import Shell from "@/shared/components/layout/shell";

export const metadata = {
  title: "Contact Support",
  description: "Get in touch with us to discuss your project, ask a question, or simply to say hello.",
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
