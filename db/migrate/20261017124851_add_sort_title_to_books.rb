class AddSortTitleToBooks < ActiveRecord::Migration[8.1]
  def up
    add_column :books, :sort_title, :string, collation: "es-AR-x-icu"
    execute <<~SQL
      UPDATE books SET sort_title = regexp_replace(title, '^[[:punct:][:space:]¡¿«»“”‘’]+', '')
    SQL
    change_column_null :books, :sort_title, false
    remove_index :books, :title
    add_index :books, :sort_title
  end

  def down
    remove_index :books, :sort_title
    add_index :books, :title
    remove_column :books, :sort_title
  end
end
