import { RssIcon } from "lucide-react";

import { Button } from "../ui/button";
import Link from "next/link";
import { PATH } from "@/shared/config/routes";
import type { Route } from "next";
import { TooltipProvider, Tooltip, TooltipContent } from "@/shared/components/ui/tooltip";

function RSS() {
  return (
    <TooltipProvider>
      <Tooltip>
        <Link href={PATH.FEEDS.RSS as Route}>
          <Button variant={"outline"} size={"icon"}>
            <RssIcon className="h-5 w-5" />
          </Button>
        </Link>
        <TooltipContent>
          <p>Subscribe to RSS</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

export default RSS;
