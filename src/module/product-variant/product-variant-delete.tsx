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

export default function ProductVariantDelete({ variantId, productSlug }: { variantId: string; productSlug: string }) {
  const router = useRouter();
  const [toastId, setToastId] = useState<string | number>("");

  const deleteVariant = apiClient.productVariant.delete.useMutation({
    onSuccess: async ({ status, message }) => {
      if (status === STATUS.SUCCESS) {
        toast.success(message, { id: toastId });
        setToastId("");
        router.push(PATH.STUDIO.PRODUCTS.VIEW(productSlug) as Route);
      } else {
        toast.error(message, { id: toastId });
        setToastId("");
      }
    },
    onError: ({ message }) => {
      toast.error(message || "An error occurred while deleting the variant", { id: toastId });
      setToastId("");
    },
  });

  const handleDelete = () => {
    const id = toast.loading("Deleting variant...");
    setToastId(id);
    deleteVariant.mutate({ params: { id: variantId } });
  };

  return (
    <AlertDialog>
      <Tooltip>
        <TooltipTrigger asChild>
          <AlertDialogTrigger asChild>
            <Button
              disabled={deleteVariant.isPending}
              variant="destructive"
              size="icon"
              className="hover:bg-destructive/90"
            >
              {deleteVariant.isPending ? <Loader className="h-4 w-4 animate-spin" /> : <Trash className="h-4 w-4" />}
            </Button>
          </AlertDialogTrigger>
        </TooltipTrigger>
        <TooltipContent>
          <p>Delete Variant</p>
        </TooltipContent>
      </Tooltip>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete this variant?</AlertDialogTitle>
          <AlertDialogDescription>
            This will soft-delete the variant. You can still keep inventory records for auditing.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={deleteVariant.isPending}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {deleteVariant.isPending ? "Deleting..." : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
