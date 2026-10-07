class Category < ApplicationRecord
  include CatalogEntry

  has_many :book_categories, dependent: :restrict_with_error
  has_many :books, through: :book_categories
end
