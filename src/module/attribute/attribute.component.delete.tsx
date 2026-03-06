"use client";

import { Loader, Trash } from "lucide-react";
import type { Route } from "next";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { apiClient } from "@/core/api/api.client";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/shared/components/ui/alert-dialog";
import { Button } from "@/shared/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/shared/components/ui/tooltip";
import { STATUS } from "@/shared/config/api.config";
import { PATH } from "@/shared/config/routes";

export default function AttributeDelete({ attributeId }: { attributeId: string }) {
  const router = useRouter();
  const [toastId, setToastId] = useState<string | number>("");

  const deleteAttribute = apiClient.attribute.delete.useMutation({
    onSuccess: async ({ status, message }) => {
      if (status === STATUS.SUCCESS) {
        toast.success(message, { id: toastId });
        setToastId("");
        router.push(PATH.STUDIO.ATTRIBUTES.ROOT as Route);
      } else {
        toast.error(message, { id: toastId });
        setToastId("");
      }
    },
    onError: ({ message }) => {
      toast.error(message || "An error occurred while deleting the attribute", { id: toastId });
      setToastId("");
    },
  });

  const handleDelete = () => {
    const id = toast.loading("Deleting attribute...");
    setToastId(id);
    deleteAttribute.mutate({ params: { id: attributeId } });
  };

  return (
    <AlertDialog>
      <Tooltip>
        <TooltipTrigger asChild>
          <AlertDialogTrigger asChild>
            <Button
              disabled={deleteAttribute.isPending}
              variant="destructive"
              size="icon"
              className="hover:bg-destructive/90"
            >
              {deleteAttribute.isPending ? <Loader className="h-4 w-4 animate-spin" /> : <Trash className="h-4 w-4" />}
            </Button>
          </AlertDialogTrigger>
        </TooltipTrigger>
        <TooltipContent>
          <p>Delete Attribute</p>
        </TooltipContent>
      </Tooltip>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete this attribute?</AlertDialogTitle>
          <AlertDialogDescription>
            This will hide the attribute from listings. Existing records may still reference it.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={deleteAttribute.isPending}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {deleteAttribute.isPending ? "Deleting..." : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
