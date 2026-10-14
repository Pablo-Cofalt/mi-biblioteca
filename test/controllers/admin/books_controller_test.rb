require "test_helper"

class Admin::BooksControllerTest < ActionDispatch::IntegrationTest
  setup do
    @cortazar = Author.create!(name: "Julio Cortázar")
    @book = Book.create!(title: "Rayuela", location: "Estante 3", authors: [ @cortazar ])
    @trashed = Book.create!(title: "Libro borrado", discarded_at: 1.day.ago)
  end

  test "every action requires logging in" do
    get admin_books_path
    assert_redirected_to new_session_path

    post admin_books_path, params: { book: { title: "Nuevo" } }
    assert_redirected_to new_session_path

    delete admin_book_path(@book)
    assert_redirected_to new_session_path

    get trash_admin_books_path
    assert_redirected_to new_session_path

    assert_no_changes -> { @book.reload.discarded_at } do
      delete admin_book_path(@book)
    end
  end

  test "lists books that are not in the trash" do
    sign_in

    get admin_books_path

    assert_inertia_component "admin/books/index"
    assert_equal [ "Rayuela" ], inertia.props[:books].pluck(:title)
    assert_equal 1, inertia.props[:trash_count]
  end

  test "shows the new book form" do
    sign_in

    get new_admin_book_path

    assert_inertia_component "admin/books/new"
    assert_equal [ "Julio Cortázar" ], inertia.props[:authors].pluck(:name)
  end

  test "creates a book, reusing and creating lists by name" do
    sign_in

    assert_difference -> { Book.count } => 1, -> { Author.count } => 1 do
      post admin_books_path, params: { book: {
        title: "  Bestiario ", location: "Estante 3",
        authors: [ "julio cortázar", "Autor Nuevo" ], categories: [ "Cuentos" ], publishers: [ "Sudamericana" ]
      } }
    end

    assert_redirected_to admin_books_path
    book = Book.find_by!(title: "Bestiario")
    assert_equal [ "Julio Cortázar", "Autor Nuevo" ], book.authors.map(&:name)
    assert_equal [ "Cuentos" ], book.categories.map(&:name)
    assert_equal [ "Sudamericana" ], book.publishers.map(&:name)
    assert_equal "Se agregó “Bestiario”.", flash[:notice]
  end

  test "rejects a book without title and creates nothing" do
    sign_in

    assert_no_difference [ "Book.count", "Author.count", "Category.count" ] do
      post admin_books_path, params: { book: { title: "", authors: [ "Autor Nuevo" ], categories: [ "Nueva" ] } }
    end

    assert_redirected_to new_admin_book_path
    follow_redirect!
    assert_equal [ "no puede estar en blanco" ], inertia.props[:errors][:title]
  end

  test "shows the edit form" do
    sign_in

    get edit_admin_book_path(@book)

    assert_inertia_component "admin/books/edit"
    assert_equal({ "id" => @book.id, "title" => "Rayuela", "location" => "Estante 3",
                   "authors" => [ "Julio Cortázar" ], "categories" => [], "publishers" => [] },
                 inertia.props[:book].to_h)
  end

  test "updates a book" do
    sign_in

    patch admin_book_path(@book), params: { book: {
      title: "Rayuela (edición nueva)", location: "", authors: [], categories: [ "Novela" ], publishers: []
    } }

    assert_redirected_to admin_books_path
    @book.reload
    assert_equal "Rayuela (edición nueva)", @book.title
    assert_nil @book.location
    assert_empty @book.authors
    assert_equal [ "Novela" ], @book.categories.map(&:name)
    assert Author.exists?(@cortazar.id)
  end

  test "rejects an invalid update and keeps the book as it was" do
    sign_in

    patch admin_book_path(@book), params: { book: { title: "", authors: [ "Otro" ] } }

    assert_redirected_to edit_admin_book_path(@book)
    assert_equal "Rayuela", @book.reload.title
    assert_equal [ "Julio Cortázar" ], @book.authors.map(&:name)
    assert_not Author.exists?(name: "Otro")
  end

  test "deleting moves the book to the trash and offers undo" do
    sign_in

    delete admin_book_path(@book)

    assert_redirected_to admin_books_path
    assert @book.reload.discarded?
    assert_equal "“Rayuela” se movió a la papelera.", flash[:notice]
    assert_equal restore_admin_book_path(@book), flash[:inertia]["undo"]
  end

  test "books in the trash cannot be edited" do
    sign_in

    get edit_admin_book_path(@trashed)

    assert_response :not_found
  end

  test "lists the trash, most recently deleted first" do
    @book.discard!
    sign_in

    get trash_admin_books_path

    assert_inertia_component "admin/books/trash"
    assert_equal [ "Rayuela", "Libro borrado" ], inertia.props[:books].pluck(:title)
    assert inertia.props[:books].first[:discarded_at]
  end

  test "restores a book from the trash" do
    sign_in

    patch restore_admin_book_path(@trashed)

    assert_redirected_to admin_books_path
    assert @trashed.reload.kept?
    assert_equal "Se restauró “Libro borrado”.", flash[:notice]
  end

  test "purges a book from the trash, keeping its authors" do
    @book.discard!
    sign_in

    delete purge_admin_book_path(@book)

    assert_redirected_to trash_admin_books_path
    assert_not Book.exists?(@book.id)
    assert Author.exists?(@cortazar.id)
  end

  test "only books in the trash can be purged" do
    sign_in

    delete purge_admin_book_path(@book)

    assert_response :not_found
    assert Book.exists?(@book.id)
  end

  private
    def sign_in
      sign_in_as users(:admin)
    end
end
