# Shared behavior for the name-only lists books are classified by
# (publishers, authors, categories).
module CatalogEntry
  extend ActiveSupport::Concern

  included do
    normalizes :name, with: ->(name) { name.squish }

    validates :name, presence: true, length: { maximum: 255 },
                     uniqueness: { case_sensitive: false }

    scope :alphabetical, -> { order(:name) }
  end

  class_methods do
    # Finds each name ignoring case, creating the missing ones.
    def for_names(names)
      Array(names).map { |name| name.to_s.squish }.compact_blank.uniq(&:downcase).map do |name|
        find_by("lower(name) = lower(?)", name) || create!(name:)
      end
    end
  end
end
