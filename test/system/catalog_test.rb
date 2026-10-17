require "application_system_test_case"

class CatalogTest < ApplicationSystemTestCase
  setup do
    walsh = Author.create!(name: "María Elena Walsh")
    quiroga = Author.create!(name: "Horacio Quiroga")
    poesia = Category.create!(name: "Poesía")
    cuentos = Category.create!(name: "Cuentos")

    Book.create!(title: "Tutú Marambá", authors: [ walsh ], categories: [ poesia ], location: "Estante 2")
    Book.create!(title: "El Reino del Revés", authors: [ walsh ], categories: [ poesia ])
    Book.create!(title: "Cuentos de la selva", authors: [ quiroga ], categories: [ cuentos ])
    Book.create!(title: "Libro borrado", discarded_at: Time.current)
  end

  test "browsing, searching and filtering the catalog" do
    visit root_path

    assert_text "3 libros"
    assert_no_text "Libro borrado"
    assert_equal [ "Cuentos de la selva", "El Reino del Revés", "Tutú Marambá" ], titles

    fill_in "Buscar por título o autor", with: "TUTU"
    assert_text "1 libro"
    assert_equal [ "Tutú Marambá" ], titles
    assert_current_path "/?q=TUTU"

    click_on "Limpiar filtros"
    assert_text "3 libros"
    assert_field "Buscar por título o autor", with: ""

    find("button[aria-label='Categoría']").click
    find("[role=option]", text: "Poesía").click
    assert_text "2 libros"
    assert_equal [ "El Reino del Revés", "Tutú Marambá" ], titles

    click_on "Título"
    assert_current_path(/direction=desc/)
    assert_equal [ "Tutú Marambá", "El Reino del Revés" ], titles

    go_back
    assert_no_current_path(/direction=desc/)
    assert_equal [ "El Reino del Revés", "Tutú Marambá" ], titles
  end

  test "paging through more than 20 books" do
    20.times { |i| Book.create!(title: format("Zeta %02d", i + 1)) }

    visit root_path

    assert_text "Página 1 de 2"
    click_on "Siguiente"
    assert_text "Página 2 de 2"
    assert_equal [ "Zeta 18", "Zeta 19", "Zeta 20" ], titles
  end

  private
    def titles
      all("tbody tr td:first-child").map(&:text)
    end
end
