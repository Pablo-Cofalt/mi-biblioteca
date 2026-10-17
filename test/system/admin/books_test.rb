require "application_system_test_case"

class Admin::BooksTest < ApplicationSystemTestCase
  setup do
    Category.create!(name: "Novela")
    Author.create!(name: "Julio Cortázar")
    sign_in_as_admin
  end

  test "creating and editing a book" do
    click_on "Nuevo libro"

    fill_in "Título", with: "Rayuela"
    add "Agregar autor", "julio"
    add "Agregar autor", "Autora Nueva", create: true
    add "Agregar categoría", "nove"
    fill_in "Ubicación", with: "Estante 3"
    click_on "Guardar"

    assert_text "Se agregó “Rayuela”."
    within(row("Rayuela")) do
      assert_text "Julio Cortázar, Autora Nueva"
      assert_text "Novela"
      assert_text "Estante 3"
    end

    within(row("Rayuela")) { click_on "Editar “Rayuela”" }
    fill_in "Título", with: "Rayuela (2da edición)"
    click_on "Quitar Autora Nueva"
    click_on "Guardar"

    assert_text "Se guardaron los cambios de “Rayuela (2da edición)”."
    within(row("Rayuela (2da edición)")) { assert_no_text "Autora Nueva" }
  end

  test "a book needs a title" do
    visit new_admin_book_path
    add "Agregar autor", "julio"
    page.execute_script("document.getElementById('title').removeAttribute('required')")
    click_on "Guardar"

    assert_text "no puede estar en blanco"
    assert_text "Julio Cortázar"
  end

  test "deleting, undoing, restoring and purging" do
    Book.create!(title: "Bestiario")
    visit admin_books_path

    click_on "Mover “Bestiario” a la papelera"
    assert_text "“Bestiario” se movió a la papelera."
    assert_no_selector "tbody", text: "Bestiario"

    click_on "Deshacer"
    assert_text "Se restauró “Bestiario”."
    assert_selector "tbody", text: "Bestiario"

    click_on "Mover “Bestiario” a la papelera"
    click_on "Papelera (1)"
    within(row("Bestiario")) { click_on "Restaurar" }
    assert_text "Se restauró “Bestiario”."

    visit admin_books_path
    click_on "Mover “Bestiario” a la papelera"
    visit trash_admin_books_path
    click_on "Eliminar “Bestiario” definitivamente"
    within("[role=alertdialog]") { click_on "Eliminar definitivamente" }
    assert_text "“Bestiario” se eliminó definitivamente."
    assert_text "La papelera está vacía."
  end

  private
    def row(title)
      find("tbody tr", text: title, match: :first)
    end

    def add(button, text, create: false)
      click_on button
      find("[cmdk-input]").set(text)
      option = create ? [ "[role=option]", { text: "Crear “#{text}”" } ] :
                        [ "[role=option]:not([data-value='__create__'])", { text: /#{text}/i, match: :first } ]
      # The list re-renders while it filters; retry if the option went stale.
      page.document.synchronize { find(option[0], **option[1]).click }
      find("body").send_keys(:escape)
    end
end
