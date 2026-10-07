class CreateBooks < ActiveRecord::Migration[8.1]
  def change
    create_table :books do |t|
      t.string :title, null: false, collation: "es-AR-x-icu"
      t.string :location

      t.timestamps
    end
    add_index :books, :title
  end
end
