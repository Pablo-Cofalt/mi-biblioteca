class CreateBookPublishers < ActiveRecord::Migration[8.1]
  def change
    create_table :book_publishers do |t|
      t.references :book, null: false, index: false, foreign_key: { on_delete: :cascade }
      t.references :publisher, null: false, foreign_key: true

      t.timestamps
    end
    add_index :book_publishers, [ :book_id, :publisher_id ], unique: true
  end
end
