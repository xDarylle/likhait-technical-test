class AddEmojiCategories < ActiveRecord::Migration[7.2]
  def change
    add_column :categories, :emoji, :string, charset: "utf8mb4", collation: "utf8mb4_unicode_ci"
  end
end
