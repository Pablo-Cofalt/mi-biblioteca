class Book < ApplicationRecord
  has_many :book_authors, -> { order(:id) }, dependent: :destroy
  has_many :authors, through: :book_authors
  has_many :book_categories, dependent: :destroy
  has_many :categories, -> { order(:name) }, through: :book_categories
  has_many :book_publishers, -> { order(:id) }, dependent: :destroy
  has_many :publishers, through: :book_publishers

  normalizes :title, with: ->(title) { title.squish }
  normalizes :location, with: ->(location) { location.squish.presence }

  validates :title, presence: true, length: { maximum: 255 }
  validates :location, length: { maximum: 255 }

  scope :alphabetical, ->(direction = :asc) { order(title: direction, id: :asc) }

  # Matches the title or any author's name, ignoring case and accents.
  scope :matching, ->(text) {
    pattern = "%#{sanitize_sql_like(text)}%"
    by_author = BookAuthor.joins(:author).where("unaccent(authors.name) ILIKE unaccent(?)", pattern)

    where("unaccent(books.title) ILIKE unaccent(?)", pattern).or(where(id: by_author.select(:book_id)))
  }
  scope :by_author, ->(author_id) { where(id: BookAuthor.where(author_id:).select(:book_id)) }
  scope :by_category, ->(category_id) { where(id: BookCategory.where(category_id:).select(:book_id)) }
  scope :by_publisher, ->(publisher_id) { where(id: BookPublisher.where(publisher_id:).select(:book_id)) }
end
