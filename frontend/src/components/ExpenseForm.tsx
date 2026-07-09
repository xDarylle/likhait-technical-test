/**
 * Form component for adding/editing expenses
 */

import React from "react";
import { Category, ExpenseFormData } from "../types";
import { TextField, Button } from "../vibes";
import { useExpenseForm } from "../hooks/useExpenseForm";
import { fetchCategories } from "../services/api/category.api";
import { CustomSelectBox } from "../vibes/CustomSelectBox";

interface ExpenseFormProps {
  initialData?: Partial<ExpenseFormData>;
  onSubmit: (data: ExpenseFormData) => Promise<void>;
  onCancel?: () => void;
  submitLabel?: string;
}

export function ExpenseForm({
  initialData,
  onSubmit,
  onCancel,
  submitLabel = "Add Expense",
}: ExpenseFormProps) {
  const { formData, errors, isSubmitting, handleChange, handleSubmit } =
    useExpenseForm({
      initialData,
      onSubmit,
    });

  const [categoryOptions, setCategoryOptions] = React.useState<Category[]>([]);

  React.useEffect(() => {
    const loadCategories = async () => {
      try {
        const categories = await fetchCategories();
        setCategoryOptions(categories);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    loadCategories();
  }, []);

  const formStyle: React.CSSProperties = {
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
  };

  const buttonGroupStyle: React.CSSProperties = {
    display: "flex",
    flexDirection: "column",
    gap: "0.5rem",
    marginTop: "0.5rem",
  };

  return (
    <form onSubmit={handleSubmit} style={formStyle}>
      <TextField
        label="Amount"
        type="number"
        step="0.01"
        placeholder="0.00"
        value={formData.amount}
        onChange={(e) => handleChange("amount", e.target.value)}
        error={errors.amount}
        fullWidth
        required
      />

      <TextField
        label="Description"
        type="text"
        placeholder="Enter description"
        value={formData.description}
        onChange={(e) => handleChange("description", e.target.value)}
        error={errors.description}
        fullWidth
        required
      />

      <CustomSelectBox
        label="Category"
        value={formData.category_id || ""}
        options={categoryOptions}
        onChange={(e) => handleChange("category_id", e.target.value)}
        error={errors.category_id}
        fullWidth
        getOptionRenderer={(option: Category) => `${option.emoji} ${option.name}`}
        getOptionValue={(option: Category) => option.id}
        required
      />

      <TextField
        label="Date"
        type="date"
        value={formData.date}
        onChange={(e) => handleChange("date", e.target.value)}
        error={errors.date}
        fullWidth
        required
      />

      <div style={buttonGroupStyle}>
        <Button type="submit" variant="primary" disabled={isSubmitting}>
          {isSubmitting ? "Submitting..." : submitLabel}
        </Button>
        {onCancel && (
          <Button
            type="button"
            variant="secondary"
            onClick={onCancel}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
        )}
      </div>
    </form>
  );
}
