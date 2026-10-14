class Admin::DashboardController < Admin::BaseController
  def index
    render inertia: {
      counts: {
        books: Book.count,
        authors: Author.count,
        publishers: Publisher.count,
        categories: Category.count
      }
    }
  end
end
