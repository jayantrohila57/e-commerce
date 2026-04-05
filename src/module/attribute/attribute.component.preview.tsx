import { format } from "date-fns";
import { Calendar, Clock, Hash, Tag, Type, Variable } from "lucide-react";
import { FormSection } from "@/shared/components/form/form.helper";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Separator } from "@/shared/components/ui/separator";
import { Table, TableBody, TableCell, TableRow } from "@/shared/components/ui/table";
import type { AttributeSelect } from "./attribute.schema";

type AttributePreviewCardProps = {
  data: AttributeSelect | null;
};

const formatValue = (key: string, value: unknown) => {
  if (value === null || value === undefined) return "N/A";

  if (["createdAt", "updatedAt", "deletedAt"].includes(key) && value) {
    return format(new Date(String(value)), "PPPpp");
  }

  if (typeof value === "boolean") return value ? "Yes" : "No";

  return String(value);
};

export function AttributePreviewCard({ data }: AttributePreviewCardProps) {
  if (!data) return null;

  const filteredEntries = Object.entries(data).filter(([key]) => !["deletedAt"].includes(key));

  return (
    <FormSection title="Attribute Details" description="Attributes define reusable properties for your products.">
      <Card className="bg-secondary p-3 shadow-none">
        <CardHeader className="p-0 pb-3">
          <CardTitle className="text-lg font-semibold">{data.title}</CardTitle>
          <CardDescription className="mt-1 text-xs">
            <span className="font-mono text-[11px]">/{data.slug}</span>
          </CardDescription>
        </CardHeader>
        <Separator className="my-2" />
        <CardContent className="p-0">
          <Table>
            <TableBody>
              {filteredEntries.map(([key, value]) => {
                const formatted = formatValue(key, value);
                return (
                  <TableRow key={key}>
                    <TableCell className="text-muted-foreground w-40 text-xs font-medium">
                      <div className="flex items-center gap-2">
                        {key === "id" && <Hash className="h-3.5 w-3.5 opacity-70" />}
                        {key === "slug" && <Tag className="h-3.5 w-3.5 opacity-70" />}
                        {key === "type" && <Type className="h-3.5 w-3.5 opacity-70" />}
                        {key === "value" && <Variable className="h-3.5 w-3.5 opacity-70" />}
                        {key === "createdAt" && <Calendar className="h-3.5 w-3.5 opacity-70" />}
                        {key === "updatedAt" && <Clock className="h-3.5 w-3.5 opacity-70" />}
                        <span className="capitalize">{key.replace(/([A-Z])/g, " $1").trim()}</span>
                      </div>
                    </TableCell>
                    <TableCell className="font-mono text-xs">{formatted}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </FormSection>
  );
}
