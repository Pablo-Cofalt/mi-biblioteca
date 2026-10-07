class CreateBookAuthors < ActiveRecord::Migration[8.1]
  def change
    create_table :book_authors do |t|
      t.references :book, null: false, index: false, foreign_key: { on_delete: :cascade }
      t.references :author, null: false, foreign_key: true

      t.timestamps
    end
    add_index :book_authors, [ :book_id, :author_id ], unique: true
  end
end
