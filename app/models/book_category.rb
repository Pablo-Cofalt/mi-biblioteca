class BookCategory < ApplicationRecord
  belongs_to :book
  belongs_to :category

  validates :category_id, uniqueness: { scope: :book_id }
end
