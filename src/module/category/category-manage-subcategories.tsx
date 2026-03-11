"use client";

import { Loader, Plus, Trash, X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { apiClient } from "@/core/api/api.client";
import type { SubcategoryBase } from "@/module/subcategory/subcategory.schema";
import { FormSection } from "@/shared/components/form/form.helper";
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
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { Label } from "@/shared/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select";
import { Separator } from "@/shared/components/ui/separator";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/shared/components/ui/tooltip";
import { STATUS } from "@/shared/config/api.config";

interface ManageSubcategoriesProps {
  categorySlug: string;
  currentSubcategories: SubcategoryBase[];
}

export function ManageSubcategories({ categorySlug, currentSubcategories }: ManageSubcategoriesProps) {
  const [selectedSubcategoryId, setSelectedSubcategoryId] = useState<string>("");
  const [toastId, setToastId] = useState<string | number>("");

  // Fetch available subcategories (not in current category)
  const { data: availableData, refetch: refetchAvailable } = apiClient.subcategory.getAvailable.useQuery({
    query: { excludeCategorySlug: categorySlug },
  });

  // Get current subcategories (fresh data after mutations)
  const { data: currentData, refetch: refetchCurrent } = apiClient.category.getCategoryWithSubCategories.useQuery({
    params: { slug: categorySlug },
  });

  const availableSubcategories = availableData?.data ?? [];
  const currentSubs = currentData?.data?.subcategories ?? currentSubcategories;

  // Transfer mutation (add subcategory to this category)
  const transferMutation = apiClient.subcategory.transfer.useMutation({
    onSuccess: async ({ status, message }) => {
      if (status === STATUS.SUCCESS) {
        toast.success(message, { id: toastId });
        setToastId("");
        setSelectedSubcategoryId("");
        await Promise.all([refetchAvailable(), refetchCurrent()]);
      } else if (status === STATUS.FAILED || status === STATUS.ERROR) {
        toast.error(message, { id: toastId });
        setToastId("");
      }
    },
    onError: ({ message }) => {
      toast.error(message || "An error occurred while adding the subcategory", { id: toastId });
      setToastId("");
    },
  });

  // Delete mutation (remove subcategory by soft-deleting)
  const deleteMutation = apiClient.subcategory.delete.useMutation({
    onSuccess: async ({ status, message }) => {
      if (status === STATUS.SUCCESS) {
        toast.success("Subcategory removed successfully", { id: toastId });
        setToastId("");
        await Promise.all([refetchAvailable(), refetchCurrent()]);
      } else if (status === STATUS.FAILED || status === STATUS.ERROR) {
        toast.error(message, { id: toastId });
        setToastId("");
      }
    },
    onError: ({ message }) => {
      toast.error(message || "An error occurred while removing the subcategory", { id: toastId });
      setToastId("");
    },
  });

  const handleAdd = () => {
    if (!selectedSubcategoryId) return;

    setToastId("");
    const id = toast.loading("Adding subcategory...");
    setToastId(id);

    transferMutation.mutate({
      params: { id: selectedSubcategoryId },
      body: { categorySlug },
    });
  };

  const handleRemove = (subcategoryId: string) => {
    setToastId("");
    const id = toast.loading("Removing subcategory...");
    setToastId(id);

    deleteMutation.mutate({
      params: { id: subcategoryId },
    });
  };

  return (
    <FormSection title="Manage Subcategories" description="Add or remove subcategories from this category">
      <div className="space-y-4">
        {/* Add Subcategory Section */}
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end">
          <div className="flex-1">
            <Label className="mb-1.5 block">Add Subcategory</Label>
            <Select
              value={selectedSubcategoryId}
              onValueChange={setSelectedSubcategoryId}
              disabled={availableSubcategories.length === 0 || transferMutation.isPending}
            >
              <SelectTrigger className="w-full">
                <SelectValue
                  placeholder={
                    availableSubcategories.length === 0
                      ? "No available subcategories"
                      : "Select a subcategory to add..."
                  }
                />
              </SelectTrigger>
              <SelectContent>
                {availableSubcategories.map((subcategory) => (
                  <SelectItem key={subcategory.id} value={subcategory.id}>
                    <div className="flex items-center gap-2">
                      <span>{subcategory.title}</span>
                      <span className="text-muted-foreground text-xs">({subcategory.categorySlug})</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                onClick={handleAdd}
                disabled={!selectedSubcategoryId || transferMutation.isPending}
                className="shrink-0"
              >
                {transferMutation.isPending ? (
                  <Loader className="h-4 w-4 animate-spin" />
                ) : (
                  <Plus className="h-4 w-4" />
                )}
                Add
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Add selected subcategory to this category</p>
            </TooltipContent>
          </Tooltip>
        </div>

        <Separator className="my-4" />

        {/* Current Subcategories List */}
        <div>
          <Label className="mb-2 block">Current Subcategories ({currentSubs.length})</Label>
          {currentSubs.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {currentSubs.map((subcategory) => (
                <Badge key={subcategory.id} variant="secondary" className="flex items-center gap-1 px-2 py-1 text-sm">
                  <span className="max-w-[200px] truncate">{subcategory.title}</span>
                  <AlertDialog>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-5 w-5 ml-1 hover:bg-destructive/10 hover:text-destructive"
                            disabled={deleteMutation.isPending}
                          >
                            {deleteMutation.isPending ? (
                              <Loader className="h-3 w-3 animate-spin" />
                            ) : (
                              <X className="h-3 w-3" />
                            )}
                          </Button>
                        </AlertDialogTrigger>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Remove subcategory</p>
                      </TooltipContent>
                    </Tooltip>

                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Remove this subcategory?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This will soft-delete &quot;{subcategory.title}&quot;. You can restore it later from deleted
                          items.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleRemove(subcategory.id)}
                          disabled={deleteMutation.isPending}
                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                          {deleteMutation.isPending ? "Removing..." : "Remove"}
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </Badge>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground text-sm">No subcategories in this category</p>
          )}
        </div>
      </div>
    </FormSection>
  );
}
