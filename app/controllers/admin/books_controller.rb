class Admin::BooksController < Admin::BaseController
  include BookListing

  before_action :set_book, only: %i[edit update destroy]
  before_action :set_discarded_book, only: %i[restore purge]

  def index
    render inertia: {
      **book_listing_props(BookSearch.new(search_params)),
      trash_count: Book.discarded.count
    }
  end

  def new
    render inertia: { book: empty_book, **catalog_options }
  end

  def create
    book = Book.new

    if save_book(book)
      redirect_to admin_books_path, notice: "Se agregó “#{book.title}”."
    else
      redirect_to new_admin_book_path, inertia: { errors: book.errors.to_hash }
    end
  end

  def edit
    render inertia: { book: book_props(@book), **catalog_options }
  end

  def update
    if save_book(@book)
      redirect_to admin_books_path, notice: "Se guardaron los cambios de “#{@book.title}”."
    else
      redirect_to edit_admin_book_path(@book), inertia: { errors: @book.errors.to_hash }
    end
  end

  def destroy
    @book.discard!
    flash[:notice] = "“#{@book.title}” se movió a la papelera."
    flash.inertia[:undo] = restore_admin_book_path(@book)
    redirect_back_or_to admin_books_path, status: :see_other
  end

  def trash
    pagination = Pagination.new(Book.discarded.order(discarded_at: :desc, id: :desc), page: params[:page])

    render inertia: {
      books: pagination.records.includes(:authors, :categories, :publishers).map do |book|
        book_props(book).merge(discarded_at: book.discarded_at)
      end,
      pagination: pagination.as_json
    }
  end

  def restore
    @book.undiscard!
    redirect_back_or_to admin_books_path, notice: "Se restauró “#{@book.title}”.", status: :see_other
  end

  def purge
    @book.destroy!
    redirect_to trash_admin_books_path, notice: "“#{@book.title}” se eliminó definitivamente.", status: :see_other
  end

  private
    def set_book
      @book = Book.kept.find(params[:id])
    end

    def set_discarded_book
      @book = Book.discarded.find(params[:id])
    end

    # Runs in a transaction so lists created for an invalid book are rolled back.
    def save_book(book)
      Book.transaction do
        book.assign_attributes(book_params)
        book.save || raise(ActiveRecord::Rollback)
      end
    end

    def book_params
      permitted = params.expect(book: [ :title, :location, authors: [], categories: [], publishers: [] ])
      {
        title: permitted[:title],
        location: permitted[:location],
        author_names: permitted.fetch(:authors, []),
        category_names: permitted.fetch(:categories, []),
        publisher_names: permitted.fetch(:publishers, [])
      }
    end

    def empty_book
      { id: nil, title: "", location: "", authors: [], categories: [], publishers: [] }
    end
end
