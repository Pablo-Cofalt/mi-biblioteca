class Author < ApplicationRecord
  include CatalogEntry

  has_many :book_authors, dependent: :restrict_with_error
  has_many :books, through: :book_authors
end
