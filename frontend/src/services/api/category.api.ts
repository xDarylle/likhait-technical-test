/**
 * API service for communicating with the backend
 */

import { Category } from "../../types";

type InsertCategory = Omit<Category, "id" | "created_at" | "updated_at">;
type UpdateCategory = { id: number } & Omit<
  Category,
  "created_at" | "updated_at"
>;

const API_BASE_URL = "http://localhost:3000/api";

/**
 * Fetch all categories
 */
export async function fetchCategories(): Promise<Category[]> {
  const response = await fetch(`${API_BASE_URL}/categories`);
  if (!response.ok) {
    throw new Error("Failed to fetch categories");
  }
  return response.json();
}

export async function createCategory(
  category: InsertCategory,
): Promise<Category> {
  const response = await fetch(`${API_BASE_URL}/categories`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(category),
  });

  if (!response.ok) {
    throw new Error("Failed to create category");
  }
  return response.json();
}

export async function updateCategory({
  id,
  ...category
}: UpdateCategory): Promise<Category> {
  const response = await fetch(`${API_BASE_URL}/categories/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(category),
  });

  if (!response.ok) {
    throw new Error("Failed to update category");
  }
  return response.json();
}

export async function deleteCategory(id: number): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/categories/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error("Failed to delete category");
  }
}
