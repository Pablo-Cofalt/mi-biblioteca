# Props shared by the public catalog and the admin book list.
module BookListing
  extend ActiveSupport::Concern

  private
    def search_params
      params.permit(:q, :author_id, :category_id, :publisher_id, :direction, :page)
    end

    def book_listing_props(search)
      {
        books: search.books.map { |book| book_props(book) },
        filters: search.filters,
        pagination: search.pagination,
        **catalog_options
      }
    end

    def book_props(book)
      {
        id: book.id,
        title: book.title,
        location: book.location,
        authors: book.authors.map(&:name),
        categories: book.categories.map(&:name),
        publishers: book.publishers.map(&:name)
      }
    end

    def catalog_options
      {
        authors: options_for(Author),
        categories: options_for(Category),
        publishers: options_for(Publisher)
      }
    end

    def options_for(model)
      model.kept.alphabetical.pluck(:id, :name).map { |id, name| { id:, name: } }
    end
end
