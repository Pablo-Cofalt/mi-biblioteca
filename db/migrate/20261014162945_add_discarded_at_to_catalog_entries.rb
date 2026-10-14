class AddDiscardedAtToCatalogEntries < ActiveRecord::Migration[8.1]
  def change
    %i[authors categories publishers].each do |table|
      add_column table, :discarded_at, :datetime
      add_index table, :discarded_at
    end
  end
end
