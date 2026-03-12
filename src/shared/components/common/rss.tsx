import { RssIcon } from "lucide-react";
import type { Route } from "next";
import Link from "next/link";
import { Tooltip, TooltipContent, TooltipProvider } from "@/shared/components/ui/tooltip";
import { PATH } from "@/shared/config/routes";
import { Button } from "../ui/button";

function RSS() {
  return (
    <TooltipProvider>
      <Tooltip>
        <Link href={PATH.FEEDS.RSS as Route}>
          <Button variant={"ghost"} size={"icon"}>
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
