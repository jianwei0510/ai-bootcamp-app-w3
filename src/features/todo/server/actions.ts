"use server";

import { revalidatePath } from "next/cache";
import superjson from "superjson";
import {
  CreateTodoSchema,
  UpdateTodoSchema,
} from "@/features/todo/utils/schemas";
import db from "@/lib/db";

type ActionState = {
  success: boolean;
  message: string;
  errors?: Record<string, string[]>;
} | null;

export const createTodo = async (data: string): Promise<ActionState> => {
  const formData = superjson.parse(data);

  const validatedData = CreateTodoSchema.safeParse(formData);

  if (!validatedData.success) {
    return {
      success: false,
      message: "ERROR: Invalid data, please check your input",
      errors: validatedData.error.flatten().fieldErrors,
    };
  }

  try {
    await db.todo.create({
      data: validatedData.data,
    });
    revalidatePath("/");

    return {
      success: true,
      message: "SUCCESS: Todo created successfully",
    };
  } catch (error) {
    return {
      success: false,
      message: "ERROR: Failed to create todo with error: " + error,
    };
  }
};

export const updateTodo = async (data: string): Promise<ActionState> => {
  const formData = superjson.parse(data);

  const validatedData = UpdateTodoSchema.safeParse(formData);

  if (!validatedData.success) {
    return {
      success: false,
      message: "ERROR: Invalid data, please check your input",
      errors: validatedData.error.flatten().fieldErrors,
    };
  }

  try {
    const { id, ...updateData } = validatedData.data;

    await db.todo.update({
      where: { id },
      data: updateData,
    });

    revalidatePath("/");

    return {
      success: true,
      message: "SUCCESS: Todo updated successfully",
    };
  } catch (error) {
    return {
      success: false,
      message: "ERROR: Failed to update todo with error: " + error,
    };
  }
};

export const deleteTodo = async (id: string): Promise<ActionState> => {
  try {
    await db.todo.delete({
      where: { id },
    });

    revalidatePath("/");

    return {
      success: true,
      message: "SUCCESS: Todo deleted successfully",
    };
  } catch (error) {
    return {
      success: false,
      message: "ERROR: Failed to delete todo with error: " + error,
    };
  }
};

export const toggleTodoComplete = async (
  id: string,
  completed: boolean
): Promise<ActionState> => {
  try {
    await db.todo.update({
      where: { id },
      data: { completed },
    });

    revalidatePath("/");

    return {
      success: true,
      message: `SUCCESS: Todo marked as ${
        completed ? "completed" : "incomplete"
      }`,
    };
  } catch (error) {
    return {
      success: false,
      message: "ERROR: Failed to update todo with error: " + error,
    };
  }
};
