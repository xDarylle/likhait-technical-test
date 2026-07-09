import React from "react";
import { Category } from "../types";
import {
  createCategory,
  deleteCategory,
  fetchCategories,
  updateCategory,
} from "../services/api/category.api";
import { Button, Modal } from "../vibes";
import { COLORS } from "../constants/colors";
import { getRandomEmoji } from "../constants/categoryEmojis";

const addEmojiButtonStyle: React.CSSProperties = {
  outline: "none",
  border: `1px solid ${COLORS.border}`,
  borderRadius: "0.375rem",
  background: "transparent",
  padding: "0.3rem",
};

const emojiStyle: React.CSSProperties = {
  fontSize: "1.3rem",
};

const categoryEmojiButtonStyle: React.CSSProperties = {
  outline: "none",
  border: "none",
  background: "transparent",
  padding: "0.5rem",
};

const categoryInputStyle: React.CSSProperties = {
  border: "none",
  background: "transparent",
  width: "100%",
  fontSize: "1rem",
  color: COLORS.text.primary,
  padding: "0.5rem 0.75rem",
  outline: "none",
};

const containerStyle: React.CSSProperties = {
  maxHeight: "400px",
  overflowY: "auto",
  paddingRight: "1rem",
  scrollbarGutter: "stable",
};

const searchContainerStyle: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: "1rem",
  width: "100%",
  gap: "0.5rem",
};

const inputStyle: React.CSSProperties = {
  padding: "0.5rem 0.75rem",
  fontSize: "1rem",
  borderRadius: "0.375rem",
  outline: "none",
  transition: "border-color 0.2s",
  border: `1px solid ${COLORS.border}`,
  backgroundColor: COLORS.background.main,
  color: COLORS.text.primary,
  flex: 1,
};

const listStyle: React.CSSProperties = {
  listStyleType: "none",
  boxSizing: "border-box",
  padding: 0,
};

const listItemStyle: React.CSSProperties = {
  border: `1px solid ${COLORS.border}`,
  width: "100%",
  boxSizing: "border-box",
  borderRadius: "0.375rem",
  marginBottom: "0.5rem",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
};

const actionsStyle: React.CSSProperties = {
  display: "flex",
  gap: "0.5rem",
  padding: "0.5rem",
};

const emptyStateStyle: React.CSSProperties = {
  textAlign: "center",
  color: COLORS.text.secondary,
  fontSize: "0.9rem",
};

const ManageCategory = (props: { onCategoryUpdated: () => void }) => {
  const [categories, setCategories] = React.useState<Category[]>([]);
  const [searchableCategories, setSearchableCategories] = React.useState<
    Category[]
  >([]);
  const [editing, setEditing] = React.useState<Category | null>(null);
  const [searchTerm, setSearchTerm] = React.useState("");
  const [randomEmoji, setRandomEmoji] =
    React.useState<string>(getRandomEmoji());

  const [isDeleting, setIsDeleting] = React.useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = React.useState(false);
  const [deletingCategory, setDeletingCategory] =
    React.useState<Category | null>(null);
  const inputRefs = React.useRef<Record<number, HTMLInputElement | null>>({});

  const canAddCategory =
    searchTerm.trim() !== "" &&
    !categories.some(
      (category) =>
        category.name.toLowerCase() === searchTerm.trim().toLowerCase(),
    );

  const loadCategories = async () => {
    try {
      const data = await fetchCategories();
      setCategories(data);
      setSearchableCategories(data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  React.useEffect(() => {
    loadCategories();
  }, []);

  React.useEffect(() => {
    if (editing) {
      inputRefs.current[editing.id]?.focus();
    }
  }, [editing]);

  const handleAddCategory = async () => {
    const newCategoryName = searchTerm.trim();
    if (!newCategoryName) return;

    try {
      const newCategory = await createCategory({
        name: newCategoryName,
        emoji: randomEmoji,
      });
      setCategories((prev) => [...prev, newCategory]);
      setSearchableCategories((prev) => [...prev, newCategory]);
    } catch (error) {
      console.error("Failed to create category:", error);
      alert("Failed to create category");
    }
  };

  const handleSave = async (category: Category) => {
    try {
      await updateCategory(category);
      setEditing(null);
      setCategories((prev) =>
        prev.map((cat) => (cat.id === category.id ? category : cat)),
      );
      setSearchableCategories((prev) =>
        prev.map((cat) => (cat.id === category.id ? category : cat)),
      );
      props.onCategoryUpdated();
    } catch (error) {
      console.error("Failed to update category:", error);
      alert("Failed to update category");
    }
  };

  // This ensures that the delete operation takes at least 300ms, providing a consistent user experience.
  const handleDelete = async (categoryId: number) => {
    const MIN_LOADING_TIME = 300;
    const startTime = Date.now();

    setIsDeleting(true);

    try {
      await deleteCategory(categoryId);

      setSearchableCategories((prev) =>
        prev.filter((category) => category.id !== categoryId),
      );

      setCategories((prev) =>
        prev.filter((category) => category.id !== categoryId),
      );
      props.onCategoryUpdated();
    } catch (error) {
      console.error("Failed to delete category:", error);
      alert("Failed to delete category");
    } finally {
      const elapsed = Date.now() - startTime;
      const remaining = Math.max(0, MIN_LOADING_TIME - elapsed);

      await new Promise((resolve) => setTimeout(resolve, remaining));
      setIsDeleteModalOpen(false);
      setDeletingCategory(null);
      setIsDeleting(false);
    }
  };

  const handleRandomizeEmoji = (categoryId: number) => {
    const randomEmoji = getRandomEmoji();
    setSearchableCategories((prevCategories) =>
      prevCategories.map((category) =>
        category.id === categoryId
          ? { ...category, emoji: randomEmoji }
          : category,
      ),
    );
    setCategories((prevCategories) =>
      prevCategories.map((category) =>
        category.id === categoryId
          ? { ...category, emoji: randomEmoji }
          : category,
      ),
    );
  };

  return (
    <div style={containerStyle}>
      <div style={searchContainerStyle}>
        <input
          style={inputStyle}
          value={searchTerm}
          placeholder="Search categories or add new..."
          onChange={(e) => {
            setSearchTerm(e.target.value);
            const searchTerm = e.target.value.toLowerCase();

            if (searchTerm) {
              setSearchableCategories((prevCategories) =>
                prevCategories.filter((category) =>
                  category.name.toLowerCase().includes(searchTerm),
                ),
              );
            } else {
              setSearchableCategories(categories);
            }
          }}
        />
        <button
          style={{
            ...addEmojiButtonStyle,
            display: canAddCategory ? "block" : "none",
          }}
          onClick={() => setRandomEmoji(getRandomEmoji())}
        >
          <span style={emojiStyle}>{randomEmoji}</span>
        </button>
        <Button
          size="medium"
          onClick={handleAddCategory}
          disabled={!canAddCategory}
        >
          +
        </Button>
      </div>

      <ul style={listStyle}>
        {searchableCategories.map((category) => (
          <li
            key={category.id}
            style={{
              ...listItemStyle,
              outline:
                editing?.id === category.id
                  ? `2px solid ${COLORS.primary}`
                  : "none",
            }}
          >
            <button
              style={{
                ...categoryEmojiButtonStyle,
                cursor: editing?.id === category.id ? "pointer" : "default",
              }}
              disabled={editing?.id !== category.id}
              onClick={() => handleRandomizeEmoji(category.id)}
            >
              <span style={emojiStyle}>{category.emoji}</span>
            </button>
            <input
              ref={(el) => {
                if (el) {
                  inputRefs.current[category.id] = el;
                }
              }}
              style={categoryInputStyle}
              value={category.name}
              disabled={editing?.id !== category.id}
              onChange={(e) => {
                if (editing?.id === category.id) {
                  setSearchableCategories((prevCategories) =>
                    prevCategories.map((cat) =>
                      cat.id === category.id
                        ? { ...cat, name: e.target.value }
                        : cat,
                    ),
                  );
                }
              }}
            />

            <div style={actionsStyle}>
              {editing?.id === category.id ? (
                <>
                  <Button
                    variant="secondary"
                    size="small"
                    onClick={() => setEditing(null)}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="success"
                    size="small"
                    onClick={() => handleSave(category)}
                  >
                    Save
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    variant="secondary"
                    size="small"
                    onClick={() => setEditing(category)}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="danger"
                    size="small"
                    onClick={() => {
                      setDeletingCategory(category);
                      setIsDeleteModalOpen(true);
                    }}
                  >
                    Delete
                  </Button>
                </>
              )}
            </div>
          </li>
        ))}
      </ul>

      {searchableCategories.length === 0 && (
        <div style={emptyStateStyle}>
          <p>No categories found</p>
          <p>
            Add{" "}
            <b>
              {randomEmoji} {searchTerm}
            </b>{" "}
            as a new category using the "+" button.
          </p>
        </div>
      )}

      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
        }}
        title="Delete Category"
      >
        <div style={{ padding: "1rem 0" }}>
          <p style={{ marginBottom: "1.5rem", color: COLORS.text.primary }}>
            Are you sure you want to delete <b>{deletingCategory?.name}</b>?
          </p>
          <p style={{ marginBottom: "1.5rem", color: COLORS.text.primary }}>
            This will also delete all expenses associated with this category.
          </p>
          <div
            style={{
              display: "flex",
              gap: "0.5rem",
              justifyContent: "flex-end",
            }}
          >
            <Button
              variant="secondary"
              onClick={() => {
                setIsDeleteModalOpen(false);
                setDeletingCategory(null);
              }}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={() => {
                handleDelete(deletingCategory!.id);
              }}
              disabled={isDeleting}
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ManageCategory;
