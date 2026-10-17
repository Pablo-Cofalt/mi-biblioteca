class Admin::DashboardController < Admin::BaseController
  def index
    render inertia: {
      counts: {
        books: Book.kept.count,
        trash: Book.discarded.count,
        authors: Author.kept.count,
        publishers: Publisher.kept.count,
        categories: Category.kept.count
      }
    }
  end
end
