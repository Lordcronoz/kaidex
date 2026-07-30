import * as React from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

/**
 * AppDrawer — opinionated wrapper around shadcn Sheet (Radix).
 * Radix handles focus trap, ESC-to-close, and scroll lock consistently.
 */

type DrawerSide = "right" | "left" | "top" | "bottom";
type DrawerSize = "sm" | "md" | "lg" | "xl" | "full";

const widthMap: Record<DrawerSize, string> = {
  sm: "sm:max-w-sm",
  md: "sm:max-w-md",
  lg: "sm:max-w-lg",
  xl: "sm:max-w-2xl",
  full: "sm:max-w-full",
};

export interface AppDrawerProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  side?: DrawerSide;
  size?: DrawerSize;
  title?: React.ReactNode;
  description?: React.ReactNode;
  trigger?: React.ReactNode;
  footer?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
}

export function AppDrawer({
  open,
  onOpenChange,
  side = "right",
  size = "md",
  title,
  description,
  trigger,
  footer,
  children,
  className,
}: AppDrawerProps) {
  const horizontal = side === "left" || side === "right";
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      {trigger && <SheetTrigger asChild>{trigger}</SheetTrigger>}
      <SheetContent
        side={side}
        className={cn(
          "flex w-full flex-col gap-0 p-0",
          horizontal && widthMap[size],
          className,
        )}
      >
        {(title || description) && (
          <SheetHeader className="border-b border-border/70 px-5 py-4">
            {title && <SheetTitle>{title}</SheetTitle>}
            {description && <SheetDescription>{description}</SheetDescription>}
          </SheetHeader>
        )}
        <div className="flex-1 overflow-y-auto px-5 py-4">{children}</div>
        {footer && (
          <SheetFooter className="border-t border-border/70 px-5 py-3">
            {footer}
          </SheetFooter>
        )}
      </SheetContent>
    </Sheet>
  );
}

export { SheetTrigger as DrawerTrigger };