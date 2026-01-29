"use client";

import {
  CalendarIcon,
  CheckCircle2Icon,
  CircleDashedIcon,
  ClockIcon,
  HashIcon,
} from "lucide-react";
import type { Todo } from "../../../../generated/prisma/client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";

interface TodoDetailsDialogProps {
  todo: Todo;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const TodoDetailsDialog = ({
  todo,
  open,
  onOpenChange,
}: TodoDetailsDialogProps) => {
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='glass-card max-w-2xl border-border/50'>
        <DialogHeader>
          <DialogTitle
            className='flex items-center gap-3 text-xl'
            style={{ fontFamily: "var(--font-outfit)" }}>
            {todo.completed ? (
              <div className='flex size-8 items-center justify-center rounded-full bg-green-500/10'>
                <CheckCircle2Icon className='size-5 text-green-500' />
              </div>
            ) : (
              <div className='flex size-8 items-center justify-center rounded-full bg-amber-500/10'>
                <CircleDashedIcon className='size-5 text-amber-500' />
              </div>
            )}
            {todo.title}
          </DialogTitle>
        </DialogHeader>

        <div className='mt-4 space-y-6'>
          {/* Status Badge */}
          <div className='flex items-center gap-3'>
            <span className='text-sm font-medium text-muted-foreground'>
              Status
            </span>
            <span
              className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ${
                todo.completed
                  ? "bg-green-500/10 text-green-600 dark:text-green-400"
                  : "bg-amber-500/10 text-amber-600 dark:text-amber-400"
              }`}>
              {todo.completed ? (
                <>
                  <CheckCircle2Icon className='size-3' />
                  Completed
                </>
              ) : (
                <>
                  <CircleDashedIcon className='size-3' />
                  In Progress
                </>
              )}
            </span>
          </div>

          <Separator className='bg-border/50' />

          {/* Description */}
          <div className='space-y-2'>
            <h3 className='text-sm font-medium text-muted-foreground'>
              Description
            </h3>
            {todo.description ? (
              <p className='whitespace-pre-wrap text-sm leading-relaxed'>
                {todo.description}
              </p>
            ) : (
              <p className='text-sm italic text-muted-foreground/70'>
                No description provided
              </p>
            )}
          </div>

          <Separator className='bg-border/50' />

          {/* Timestamps */}
          <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
            <div className='flex items-start gap-3 rounded-xl bg-muted/30 p-4'>
              <div className='flex size-9 items-center justify-center rounded-lg bg-primary/10'>
                <CalendarIcon className='size-4 text-primary' />
              </div>
              <div>
                <p className='text-xs font-medium text-muted-foreground'>
                  Created
                </p>
                <p className='text-sm font-medium'>{formatDate(todo.createdAt)}</p>
              </div>
            </div>

            <div className='flex items-start gap-3 rounded-xl bg-muted/30 p-4'>
              <div className='flex size-9 items-center justify-center rounded-lg bg-primary/10'>
                <ClockIcon className='size-4 text-primary' />
              </div>
              <div>
                <p className='text-xs font-medium text-muted-foreground'>
                  Last Updated
                </p>
                <p className='text-sm font-medium'>{formatDate(todo.updatedAt)}</p>
              </div>
            </div>
          </div>

          <Separator className='bg-border/50' />

          {/* Todo ID */}
          <div className='flex items-start gap-3 rounded-xl bg-muted/30 p-4'>
            <div className='flex size-9 items-center justify-center rounded-lg bg-primary/10'>
              <HashIcon className='size-4 text-primary' />
            </div>
            <div className='min-w-0 flex-1'>
              <p className='text-xs font-medium text-muted-foreground'>
                Todo ID
              </p>
              <p className='truncate font-mono text-xs text-muted-foreground'>
                {todo.id}
              </p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
