import GoBackButton from "../../common/go-back";
import { Separator } from "../../ui/separator";
import { Breadcrumbs } from "../breadcrumb/breadcrumbs";

export const SubNavHeader = () => {
  return (
    <div className="flex flex-row items-center justify-start gap-2 py-4">
      <GoBackButton />
      <Separator orientation="vertical" className="mr-2 data-[orientation=vertical]:h-4" />
      <Breadcrumbs className="text-md" />
    </div>
  );
};
