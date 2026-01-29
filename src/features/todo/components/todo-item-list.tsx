"use client";

import { Inbox, MoreVerticalIcon, PencilIcon, TrashIcon } from "lucide-react";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item";
import type { Todo } from "../../../../generated/prisma/client";
import { deleteTodo, toggleTodoComplete } from "../server/actions";
import { EditTodoDialog } from "./edit-todo-dialog";
import { TodoDetailsDialog } from "./todo-details-dialog";

export const TodoItemList = ({ todos }: { todos: Todo[] }) => {
  if (todos.length === 0) {
    return (
      <div className='glass-card flex h-full w-full min-w-sm max-w-lg items-center justify-center rounded-2xl'>
        <div className='space-y-4 p-8 text-center'>
          <div className='flex justify-center'>
            <div className='rounded-2xl bg-primary/10 p-5'>
              <Inbox className='size-10 text-primary' />
            </div>
          </div>
          <div className='space-y-2'>
            <h3
              className='text-xl font-semibold'
              style={{ fontFamily: "var(--font-outfit)" }}>
              No todos yet
            </h3>
            <p className='max-w-xs text-sm text-muted-foreground'>
              Create your first todo to get started on your productivity
              journey.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className='stagger-children flex h-96 w-full min-w-sm max-w-lg flex-col gap-3 overflow-y-auto pr-2'>
      {todos.map((todo) => (
        <TodoItem key={todo.id} todo={todo} />
      ))}
    </div>
  );
};

export const TodoItem = ({ todo }: { todo: Todo }) => {
  const [isChecked, setIsChecked] = useState(todo.completed);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    startTransition(async () => {
      const result = await deleteTodo(todo.id);
      if (result?.success) {
        toast.success(result.message);
      } else {
        toast.error(result?.message || "Failed to delete todo");
      }
    });
  };

  const handleToggleComplete = (checked: boolean) => {
    startTransition(async () => {
      const result = await toggleTodoComplete(todo.id, checked);
      if (result?.success) {
        toast.success(result.message);
        setIsChecked(!isChecked);
      } else {
        toast.error(result?.message || "Failed to update todo");
      }
    });
  };

  const handleItemClick = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    if (
      target.closest("button") ||
      target.closest('[role="checkbox"]') ||
      target.closest('[role="menu"]')
    ) {
      return;
    }
    setIsDetailsDialogOpen(true);
  };

  return (
    <>
      <EditTodoDialog
        todo={todo}
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
      />
      <TodoDetailsDialog
        todo={todo}
        open={isDetailsDialogOpen}
        onOpenChange={setIsDetailsDialogOpen}
      />
      <div className='w-full'>
        <Item
          variant='outline'
          className={`hover-lift w-full cursor-pointer border-border/50 bg-card/50 backdrop-blur-sm transition-all duration-200 hover:border-primary/30 hover:bg-card/80 ${
            isChecked ? "opacity-60" : ""
          }`}
          onClick={handleItemClick}>
          <ItemMedia>
            <Checkbox
              checked={isChecked}
              onCheckedChange={handleToggleComplete}
              disabled={isPending}
              className='border-2 data-[state=checked]:border-primary data-[state=checked]:bg-primary'
            />
          </ItemMedia>
          <ItemContent>
            <ItemTitle
              className={`transition-all duration-200 ${isChecked ? "text-muted-foreground line-through" : ""}`}>
              {todo.title}
            </ItemTitle>
            {todo.description && (
              <ItemDescription
                className={`line-clamp-1 ${isChecked ? "opacity-50" : ""}`}>
                {todo.description}
              </ItemDescription>
            )}
          </ItemContent>
          <ItemActions>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant='ghost'
                  size='icon'
                  disabled={isPending}
                  className='size-8 text-muted-foreground hover:text-foreground'>
                  <MoreVerticalIcon className='size-4' />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align='end' className='w-40'>
                <DropdownMenuItem onClick={() => setIsEditDialogOpen(true)}>
                  <PencilIcon className='size-4' />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleDelete} variant='destructive'>
                  <TrashIcon className='size-4' />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </ItemActions>
        </Item>
      </div>
    </>
  );
};
