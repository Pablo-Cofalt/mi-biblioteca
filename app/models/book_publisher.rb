class BookPublisher < ApplicationRecord
  belongs_to :book
  belongs_to :publisher

  validates :publisher_id, uniqueness: { scope: :book_id }
end
