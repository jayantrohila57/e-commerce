import { SubNavHeader } from "@/shared/components/layout/section/section.header";
import Shell from "@/shared/components/layout/shell";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <Shell>
      <Shell.Section>
        <SubNavHeader />
      </Shell.Section>
      <Shell.Section>{children}</Shell.Section>
    </Shell>
  );
}
