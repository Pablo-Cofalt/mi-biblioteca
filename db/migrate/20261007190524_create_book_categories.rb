class CreateBookCategories < ActiveRecord::Migration[8.1]
  def change
    create_table :book_categories do |t|
      t.references :book, null: false, index: false, foreign_key: { on_delete: :cascade }
      t.references :category, null: false, foreign_key: true

      t.timestamps
    end
    add_index :book_categories, [ :book_id, :category_id ], unique: true
  end
end
