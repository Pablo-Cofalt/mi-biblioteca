require "test_helper"

class BooksControllerTest < ActionDispatch::IntegrationTest
  setup do
    @quiroga = Author.create!(name: "Horacio Quiroga")
    @walsh = Author.create!(name: "María Elena Walsh")
    @cuentos = Category.create!(name: "Cuentos")
    @poesia = Category.create!(name: "Poesía")
    @colihue = Publisher.create!(name: "Colihue")
    @alfaguara = Publisher.create!(name: "Alfaguara")

    Book.create!(title: "Cuentos de la selva", location: "Estante 1", authors: [ @quiroga ],
                 categories: [ @cuentos ], publishers: [ @colihue ])
    Book.create!(title: "Tutú Marambá", authors: [ @walsh ], categories: [ @poesia ], publishers: [ @alfaguara ])
    Book.create!(title: "Ánimas y otros cuentos", authors: [ @quiroga, @walsh ],
                 categories: [ @cuentos ], publishers: [ @colihue, @alfaguara ])
  end

  test "lists all books alphabetically without logging in" do
    get root_path

    assert_response :success
    assert_inertia_component "books/index"
    assert_equal [ "Ánimas y otros cuentos", "Cuentos de la selva", "Tutú Marambá" ], titles
    assert_equal({ page: 1, total_pages: 1, total_count: 3, per_page: 20 }, inertia.props[:pagination].to_h.symbolize_keys)
  end

  test "shares no user when logged out" do
    get root_path

    assert_nil inertia.props[:auth][:user]
  end

  test "shares the logged-in user" do
    sign_in_as users(:admin)

    get root_path

    assert_equal "admin@example.com", inertia.props[:auth][:user][:email_address]
  end

  test "includes each book's details" do
    get root_path

    book = inertia.props[:books].first
    assert_equal [ "Horacio Quiroga", "María Elena Walsh" ], book[:authors]
    assert_equal [ "Colihue", "Alfaguara" ], book[:publishers]
    assert_equal [ "Cuentos" ], book[:categories]
  end

  test "includes the filter options alphabetically" do
    get root_path

    assert_equal [ "Alfaguara", "Colihue" ], inertia.props[:publishers].pluck(:name)
    assert_equal [ "Cuentos", "Poesía" ], inertia.props[:categories].pluck(:name)
    assert_equal [ "Horacio Quiroga", "María Elena Walsh" ], inertia.props[:authors].pluck(:name)
  end

  test "sorts from Z to A" do
    get root_path(direction: "desc")

    assert_equal [ "Tutú Marambá", "Cuentos de la selva", "Ánimas y otros cuentos" ], titles
    assert_equal "desc", inertia.props[:filters][:direction]
  end

  test "searches titles ignoring case and accents" do
    get root_path(q: "TUTU")

    assert_equal [ "Tutú Marambá" ], titles
  end

  test "searches by author" do
    get root_path(q: "walsh")

    assert_equal [ "Ánimas y otros cuentos", "Tutú Marambá" ], titles
  end

  test "treats LIKE wildcards in the search as plain text" do
    get root_path(q: "%")

    assert_empty titles
  end

  test "filters by publisher, category and author" do
    get root_path(publisher_id: @alfaguara.id)
    assert_equal [ "Ánimas y otros cuentos", "Tutú Marambá" ], titles

    get root_path(category_id: @cuentos.id)
    assert_equal [ "Ánimas y otros cuentos", "Cuentos de la selva" ], titles

    get root_path(author_id: @quiroga.id, category_id: @cuentos.id, publisher_id: @alfaguara.id)
    assert_equal [ "Ánimas y otros cuentos" ], titles
  end

  test "paginates 20 books per page" do
    22.times { |i| Book.create!(title: format("Libro %02d", i + 1)) }

    get root_path(page: 2)

    assert_equal 5, titles.size
    assert_equal({ page: 2, total_pages: 2, total_count: 25, per_page: 20 }, inertia.props[:pagination].to_h.symbolize_keys)
  end

  test "ignores invalid params" do
    get root_path(page: "999", direction: "sideways", author_id: "abc")

    assert_response :success
    assert_equal 3, titles.size
    assert_equal "asc", inertia.props[:filters][:direction]
    assert_nil inertia.props[:filters][:author_id]
    assert_equal 1, inertia.props[:pagination][:page]
  end

  private
    def titles
      inertia.props[:books].pluck(:title)
    end
end
