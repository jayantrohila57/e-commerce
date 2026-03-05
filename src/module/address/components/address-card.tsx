"use client";

import { Loader2, MapPin, Pencil, Star, Trash2 } from "lucide-react";
import type { Route } from "next";
import Link from "next/link";
import type { Address } from "@/module/address/address.schema";
import { useAddress } from "@/module/address/use-address";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/shared/components/ui/tooltip";
import { PATH } from "@/shared/config/routes";

interface AddressCardProps {
  address: Address;
}

export function AddressCard({ address }: AddressCardProps) {
  const { deleteAddress, setDefaultAddress, isDeleting, isSettingDefault } = useAddress();

  const handleDelete = () => {
    if (!isDeleting) {
      deleteAddress(address.id);
    }
  };

  const handleSetDefault = () => {
    if (!isSettingDefault && !address.isDefault) {
      setDefaultAddress(address.id);
    }
  };

  const typeLabel = address.type === "shipping" ? "Shipping address" : "Billing address";

  return (
    <Card className="border border-border/80 bg-background/60">
      <CardHeader className="flex flex-row items-center justify-between gap-2 pb-2">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted">
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="flex flex-col">
            <CardTitle className="text-sm font-semibold">{typeLabel}</CardTitle>
            <span className="text-xs text-muted-foreground truncate max-w-[220px]">
              {address.city}, {address.state}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {address.isDefault && (
            <Badge variant="secondary" className="flex items-center gap-1 text-[10px] px-2 py-0.5">
              <Star className="h-3 w-3 fill-yellow-400 text-yellow-500" />
              Default
            </Badge>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-1 text-xs text-muted-foreground">
        <p className="font-medium text-foreground">
          {address.line1}
          {address.line2 ? `, ${address.line2}` : ""}
        </p>
        <p>
          {address.city}, {address.state}
        </p>
        <p>
          {address.postalCode}, {address.country}
        </p>
      </CardContent>

      <CardFooter className="flex items-center justify-between gap-2 pt-3">
        <div className="flex items-center gap-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="h-7 px-2 text-xs"
                asChild
                disabled={isDeleting || isSettingDefault}
              >
                <Link href={PATH.ACCOUNT.ADDRESS_EDIT(address.id) as Route}>
                  <Pencil className="mr-1 h-3 w-3" />
                  Edit
                </Link>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Edit this address</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 text-destructive hover:text-destructive hover:bg-destructive/10"
                onClick={handleDelete}
                disabled={isDeleting}
              >
                {isDeleting ? <Loader2 className="h-3 w-3 animate-spin" /> : <Trash2 className="h-3 w-3" />}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Delete this address</p>
            </TooltipContent>
          </Tooltip>
        </div>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant={address.isDefault ? "outline" : "default"}
              size="sm"
              className="h-7 px-2 text-xs"
              onClick={handleSetDefault}
              disabled={isSettingDefault || address.isDefault}
            >
              {isSettingDefault ? <Loader2 className="mr-1 h-3 w-3 animate-spin" /> : <Star className="mr-1 h-3 w-3" />}
              {address.isDefault ? "Default" : "Set as default"}
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Use this as your default address</p>
          </TooltipContent>
        </Tooltip>
      </CardFooter>
    </Card>
  );
}
