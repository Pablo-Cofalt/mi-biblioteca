# Page-based slicing of a relation.
class Pagination
  attr_reader :per_page

  def initialize(scope, page:, per_page: 20)
    @scope = scope
    @requested_page = page.to_i
    @per_page = per_page
  end

  def records
    @scope.limit(per_page).offset((page - 1) * per_page)
  end

  def total_count
    @total_count ||= @scope.count
  end

  def total_pages
    [ (total_count.to_f / per_page).ceil, 1 ].max
  end

  def page
    @requested_page.clamp(1, total_pages)
  end

  def as_json(*)
    { page:, total_pages:, total_count:, per_page: }
  end
end
