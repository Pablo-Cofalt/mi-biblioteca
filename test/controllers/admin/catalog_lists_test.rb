require "test_helper"

# Publishers and categories share Admin::CatalogEntriesController with
# authors (tested in depth in AuthorsControllerTest).
class Admin::CatalogListsTest < ActionDispatch::IntegrationTest
  setup { sign_in_as users(:admin) }

  test "publishers" do
    Publisher.create!(name: "Colihue")

    get admin_publishers_path

    assert_inertia_component "admin/catalog/index"
    assert_equal "Editoriales", inertia.props[:list][:title]
    assert_equal "/admin/editoriales", inertia.props[:list][:path]
    assert_equal [ "Colihue" ], inertia.props[:entries].pluck(:name)

    post admin_publishers_path, params: { entry: { name: "Losada" } }
    assert Publisher.exists?(name: "Losada")
  end

  test "categories" do
    Category.create!(name: "Poesía")

    get admin_categories_path

    assert_equal "Categorías", inertia.props[:list][:title]
    assert_equal "category_id", inertia.props[:list][:book_filter]
    assert_equal [ "Poesía" ], inertia.props[:entries].pluck(:name)

    delete admin_category_path(Category.find_by!(name: "Poesía"))
    assert Category.find_by!(name: "Poesía").discarded?
  end
end
