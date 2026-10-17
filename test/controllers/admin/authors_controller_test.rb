require "test_helper"

class Admin::AuthorsControllerTest < ActionDispatch::IntegrationTest
  setup do
    @cortazar = Author.create!(name: "Julio Cortázar")
    @duplicate = Author.create!(name: "J. Cortázar")
    @unused = Author.create!(name: "Sin libros")
    @trashed = Author.create!(name: "Autor borrado", discarded_at: 1.day.ago)
    @rayuela = Book.create!(title: "Rayuela", authors: [ @cortazar ])
    @bestiario = Book.create!(title: "Bestiario", authors: [ @duplicate ])
  end

  test "every action requires logging in" do
    get admin_authors_path
    assert_redirected_to new_session_path

    post admin_authors_path, params: { entry: { name: "Nuevo" } }
    assert_redirected_to new_session_path

    delete admin_author_path(@unused)
    assert_redirected_to new_session_path
    assert @unused.reload.kept?

    post merge_admin_author_path(@duplicate), params: { target_id: @cortazar.id }
    assert_redirected_to new_session_path
  end

  test "lists authors not in the trash, with their book counts" do
    Book.create!(title: "Borrado", authors: [ @cortazar ], discarded_at: Time.current)
    sign_in

    get admin_authors_path

    assert_inertia_component "admin/catalog/index"
    assert_equal "autor", inertia.props[:list][:singular]
    assert_equal "author_id", inertia.props[:list][:book_filter]
    rows = inertia.props[:entries].map { |entry| [ entry[:name], entry[:books_count] ] }
    assert_equal [ [ "J. Cortázar", 1 ], [ "Julio Cortázar", 1 ], [ "Sin libros", 0 ] ], rows
    assert_equal 1, inertia.props[:trash_count]
  end

  test "searches by name ignoring accents" do
    sign_in

    get admin_authors_path(q: "cortazar")

    assert_equal [ "J. Cortázar", "Julio Cortázar" ], inertia.props[:entries].pluck(:name)
  end

  test "creates an author" do
    sign_in

    assert_difference -> { Author.count } do
      post admin_authors_path, params: { entry: { name: " Ema   Wolf " } }
    end

    assert_redirected_to admin_authors_path
    assert Author.exists?(name: "Ema Wolf")
  end

  test "rejects a duplicate name" do
    sign_in

    assert_no_difference -> { Author.count } do
      post admin_authors_path, params: { entry: { name: "julio cortázar" } }
    end

    follow_redirect!
    assert_equal [ "ya existe" ], inertia.props[:errors][:name]
  end

  test "creating a name that is in the trash restores it" do
    sign_in

    assert_no_difference -> { Author.count } do
      post admin_authors_path, params: { entry: { name: "AUTOR BORRADO" } }
    end

    assert @trashed.reload.kept?
    assert_equal "“Autor borrado” estaba en la papelera y se restauró.", flash[:notice]
  end

  test "renames an author" do
    sign_in

    patch admin_author_path(@cortazar), params: { entry: { name: "Julio Florencio Cortázar" } }

    assert_equal "Julio Florencio Cortázar", @cortazar.reload.name
    assert_equal [ "Julio Florencio Cortázar" ], @rayuela.reload.authors.map(&:name)
  end

  test "rejects renaming to an existing name" do
    sign_in

    patch admin_author_path(@duplicate), params: { entry: { name: "Julio Cortázar" } }

    assert_equal "J. Cortázar", @duplicate.reload.name
  end

  test "moves an author without books to the trash, offering undo" do
    sign_in

    delete admin_author_path(@unused)

    assert @unused.reload.discarded?
    assert_equal restore_admin_author_path(@unused), flash[:inertia]["undo"]
  end

  test "refuses to delete an author with books" do
    sign_in

    delete admin_author_path(@cortazar)

    assert @cortazar.reload.kept?
    assert_match "tiene libros", flash[:alert]
  end

  test "allows deleting an author whose books are all in the trash" do
    @rayuela.discard!
    sign_in

    delete admin_author_path(@cortazar)

    assert @cortazar.reload.discarded?
  end

  test "merges a duplicate into another author" do
    sign_in

    post merge_admin_author_path(@duplicate), params: { target_id: @cortazar.id }

    assert @duplicate.reload.discarded?
    assert_equal [ "Julio Cortázar" ], @bestiario.reload.authors.map(&:name)
    assert_equal "Se unificó “J. Cortázar” con “Julio Cortázar”.", flash[:notice]
  end

  test "cannot merge into an author in the trash or into itself" do
    sign_in

    post merge_admin_author_path(@duplicate), params: { target_id: @trashed.id }
    assert_response :not_found

    post merge_admin_author_path(@duplicate), params: { target_id: @duplicate.id }
    assert_equal "No se puede unificar consigo mismo", flash[:alert]
    assert @duplicate.reload.kept?
  end

  test "lists the trash" do
    sign_in

    get trash_admin_authors_path

    assert_inertia_component "admin/catalog/trash"
    assert_equal [ "Autor borrado" ], inertia.props[:entries].pluck(:name)
  end

  test "restores an author from the trash" do
    sign_in

    patch restore_admin_author_path(@trashed)

    assert @trashed.reload.kept?
  end

  test "purges an author without books" do
    sign_in

    delete purge_admin_author_path(@trashed)

    assert_redirected_to trash_admin_authors_path
    assert_not Author.exists?(@trashed.id)
  end

  test "refuses to purge an author with books in the trash" do
    @rayuela.discard!
    @cortazar.discard!
    sign_in

    delete purge_admin_author_path(@cortazar)

    assert Author.exists?(@cortazar.id)
    assert_match "tiene libros en la papelera", flash[:alert]
  end

  private
    def sign_in
      sign_in_as users(:admin)
    end
end
