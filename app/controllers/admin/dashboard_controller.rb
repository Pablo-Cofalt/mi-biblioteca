class Admin::DashboardController < Admin::BaseController
  def index
    render inertia: {
      counts: {
        books: Book.kept.count,
        trash: Book.discarded.count,
        authors: Author.count,
        publishers: Publisher.count,
        categories: Category.count
      }
    }
  end
end
