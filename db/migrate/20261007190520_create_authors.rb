class CreateAuthors < ActiveRecord::Migration[8.1]
  def change
    create_table :authors do |t|
      t.string :name, null: false, collation: "es-AR-x-icu"

      t.timestamps
    end
    add_index :authors, "lower(name)", unique: true
  end
end
