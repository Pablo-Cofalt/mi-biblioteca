# Shared behavior for the name-only lists books are classified by
# (publishers, authors, categories).
module CatalogEntry
  extend ActiveSupport::Concern

  included do
    include Discard::Model

    normalizes :name, with: ->(name) { name.squish }

    validates :name, presence: true, length: { maximum: 255 },
                     uniqueness: { case_sensitive: false }

    scope :alphabetical, -> { order(:name, :id) }
    scope :matching, ->(text) { where("unaccent(#{table_name}.name) ILIKE unaccent(?)", "%#{sanitize_sql_like(text)}%") }
  end

  class_methods do
    # Finds each name ignoring case, creating the missing ones and
    # restoring the ones in the trash.
    def for_names(names)
      Array(names).map { |name| name.to_s.squish }.compact_blank.uniq(&:downcase).map do |name|
        entry = find_by_name(name) || create!(name:)
        entry.undiscard! if entry.discarded?
        entry
      end
    end

    def find_by_name(name)
      find_by("lower(name) = lower(?)", name.to_s.squish)
    end

    # The join model linking this list to books (e.g. BookAuthor) and its key.
    def book_links
      reflect_on_association(:books).through_reflection.klass
    end

    def book_link_key
      reflect_on_association(:books).through_reflection.foreign_key
    end

    # { entry_id => number of books not in the trash }
    def kept_book_counts
      book_links.joins(:book).merge(Book.kept).group(book_link_key).count
    end
  end

  def kept_books?
    books.kept.exists?
  end

  # Moves every book to `target` and sends this entry to the trash.
  def merge_into!(target)
    raise ArgumentError, "No se puede unificar consigo mismo" if target == self

    transaction do
      links = self.class.book_links
      key = self.class.book_link_key

      links.where(key => id).find_each do |link|
        if links.exists?(key => target.id, book_id: link.book_id)
          link.destroy!
        else
          link.update!(key => target.id)
        end
      end
      discard!
    end
  end
end
