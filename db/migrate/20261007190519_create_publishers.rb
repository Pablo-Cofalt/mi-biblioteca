class CreatePublishers < ActiveRecord::Migration[8.1]
  def change
    create_table :publishers do |t|
      t.string :name, null: false, collation: "es-AR-x-icu"

      t.timestamps
    end
    add_index :publishers, "lower(name)", unique: true
  end
end
