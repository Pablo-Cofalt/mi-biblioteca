class Book < ApplicationRecord
  has_many :book_authors, dependent: :destroy
  has_many :authors, through: :book_authors
  has_many :book_categories, dependent: :destroy
  has_many :categories, through: :book_categories
  has_many :book_publishers, dependent: :destroy
  has_many :publishers, through: :book_publishers

  normalizes :title, with: ->(title) { title.squish }
  normalizes :location, with: ->(location) { location.squish.presence }

  validates :title, presence: true, length: { maximum: 255 }
  validates :location, length: { maximum: 255 }

  scope :alphabetical, -> { order(:title) }
end
