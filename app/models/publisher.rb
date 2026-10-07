class Publisher < ApplicationRecord
  include CatalogEntry

  has_many :book_publishers, dependent: :restrict_with_error
  has_many :books, through: :book_publishers
end
