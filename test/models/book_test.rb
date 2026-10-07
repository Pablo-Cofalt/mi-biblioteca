require "test_helper"

class BookTest < ActiveSupport::TestCase
  test "requires a title" do
    book = Book.new(title: "   ")

    assert_not book.valid?
    assert_includes book.errors[:title], "no puede estar en blanco"
  end

  test "only the title is required" do
    assert Book.new(title: "Rayuela").valid?
  end

  test "squishes title and blanks out an empty location" do
    book = Book.new(title: "  Cuentos   de la selva ", location: "  ")

    assert_equal "Cuentos de la selva", book.title
    assert_nil book.location
  end

  test "can have several authors, categories and publishers" do
    book = Book.create!(
      title: "Antología",
      authors: [ Author.create!(name: "Autor Uno"), Author.create!(name: "Autor Dos") ],
      categories: [ Category.create!(name: "Cuentos"), Category.create!(name: "Poesía") ],
      publishers: [ Publisher.create!(name: "Editorial A"), Publisher.create!(name: "Editorial B") ]
    )

    assert_equal 2, book.reload.authors.count
    assert_equal 2, book.categories.count
    assert_equal 2, book.publishers.count
  end

  test "destroying a book keeps its authors" do
    author = Author.create!(name: "Horacio Quiroga")
    book = Book.create!(title: "Cuentos de la selva", authors: [ author ])

    assert_difference -> { BookAuthor.count }, -1 do
      book.destroy!
    end
    assert Author.exists?(author.id)
  end

  test "sorts titles alphabetically in Spanish, ignoring accents and case" do
    %w[zorro Árbol abeja Ñandú nube].each { |title| Book.create!(title:) }

    assert_equal %w[abeja Árbol nube Ñandú zorro], Book.alphabetical.pluck(:title)
  end
end
