# Filters, sorts and paginates the public book list from request params.
class BookSearch
  PER_PAGE = 20
  DIRECTIONS = %w[asc desc].freeze

  attr_reader :query, :author_id, :category_id, :publisher_id, :direction

  def initialize(params = {})
    @query = params[:q].to_s.squish.presence
    @author_id = to_id(params[:author_id])
    @category_id = to_id(params[:category_id])
    @publisher_id = to_id(params[:publisher_id])
    @direction = DIRECTIONS.include?(params[:direction]) ? params[:direction] : "asc"
    @requested_page = params[:page].to_i
  end

  def books
    scope
      .alphabetical(direction)
      .includes(:authors, :categories, :publishers)
      .limit(PER_PAGE)
      .offset((page - 1) * PER_PAGE)
  end

  def total_count
    @total_count ||= scope.count
  end

  def total_pages
    [ (total_count.to_f / PER_PAGE).ceil, 1 ].max
  end

  def page
    @requested_page.clamp(1, total_pages)
  end

  def filters
    { q: query, author_id:, category_id:, publisher_id:, direction: }
  end

  private
    def scope
      @scope ||= begin
        books = Book.all
        books = books.matching(query) if query
        books = books.by_author(author_id) if author_id
        books = books.by_category(category_id) if category_id
        books = books.by_publisher(publisher_id) if publisher_id
        books
      end
    end

    def to_id(value)
      id = Integer(value, exception: false) if value.is_a?(String) || value.is_a?(Integer)
      id if id&.positive?
    end
end
