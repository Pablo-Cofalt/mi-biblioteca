# Filters, sorts and paginates the book list from request params.
class BookSearch
  PER_PAGE = 20
  DIRECTIONS = %w[asc desc].freeze

  attr_reader :query, :author_id, :category_id, :publisher_id, :direction

  def initialize(params = {}, scope: Book.kept)
    @base_scope = scope
    @query = params[:q].to_s.squish.presence
    @author_id = to_id(params[:author_id])
    @category_id = to_id(params[:category_id])
    @publisher_id = to_id(params[:publisher_id])
    @direction = DIRECTIONS.include?(params[:direction]) ? params[:direction] : "asc"
    @pagination = Pagination.new(scope_with_filters, page: params[:page], per_page: PER_PAGE)
  end

  def books
    @pagination.records.alphabetical(direction).includes(:authors, :categories, :publishers)
  end

  def pagination
    @pagination.as_json
  end

  def filters
    { q: query, author_id:, category_id:, publisher_id:, direction: }
  end

  private
    def scope_with_filters
      books = @base_scope
      books = books.matching(query) if query
      books = books.by_author(author_id) if author_id
      books = books.by_category(category_id) if category_id
      books = books.by_publisher(publisher_id) if publisher_id
      books
    end

    def to_id(value)
      id = Integer(value, exception: false) if value.is_a?(String) || value.is_a?(Integer)
      id if id&.positive?
    end
end
