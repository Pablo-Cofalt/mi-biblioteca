class BooksController < InertiaController
  def index
    search = BookSearch.new(params.permit(:q, :author_id, :category_id, :publisher_id, :direction, :page))

    render inertia: {
      books: search.books.map { |book| book_props(book) },
      filters: search.filters,
      pagination: {
        page: search.page,
        total_pages: search.total_pages,
        total_count: search.total_count,
        per_page: BookSearch::PER_PAGE
      },
      authors: options_for(Author),
      categories: options_for(Category),
      publishers: options_for(Publisher)
    }
  end

  private
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

    def options_for(model)
      model.alphabetical.pluck(:id, :name).map { |id, name| { id:, name: } }
    end
end
