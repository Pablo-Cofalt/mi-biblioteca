class Book < ApplicationRecord
  include Discard::Model

  # A restored book brings back the lists it uses, if they were in the trash.
  after_undiscard { [ authors, categories, publishers ].each { |entries| entries.discarded.each(&:undiscard!) } }

  has_many :book_authors, -> { order(:id) }, dependent: :destroy
  has_many :authors, through: :book_authors
  has_many :book_categories, dependent: :destroy
  has_many :categories, -> { order(:name) }, through: :book_categories
  has_many :book_publishers, -> { order(:id) }, dependent: :destroy
  has_many :publishers, through: :book_publishers

  normalizes :title, with: ->(title) { title.squish }
  normalizes :location, with: ->(location) { location.squish.presence }

  # Leading signs like "¡", "¿" or quotes don't count for alphabetical order.
  LEADING_SIGNS = /\A[[:punct:][:space:]¡¿«»“”‘’]+/

  before_validation { self.sort_title = title.to_s.sub(LEADING_SIGNS, "").presence || title }

  validates :title, presence: true, length: { maximum: 255 }
  validates :location, length: { maximum: 255 }

  # Assign lists by name, creating the ones that don't exist yet.
  def author_names=(names)
    self.authors = Author.for_names(names)
  end

  def category_names=(names)
    self.categories = Category.for_names(names)
  end

  def publisher_names=(names)
    self.publishers = Publisher.for_names(names)
  end

  scope :alphabetical, ->(direction = :asc) { order(sort_title: direction, title: direction, id: :asc) }

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
