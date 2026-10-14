class BooksController < InertiaController
  include BookListing

  allow_unauthenticated_access

  def index
    render inertia: book_listing_props(BookSearch.new(search_params))
  end
end
