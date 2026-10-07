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
end
