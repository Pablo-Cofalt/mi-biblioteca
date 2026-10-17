require "application_system_test_case"

class Admin::CatalogListsTest < ApplicationSystemTestCase
  setup do
    cuentos = Category.create!(name: "Cuentos")
    cuento = Category.create!(name: "Cuento")
    Book.create!(title: "Bestiario", categories: [ cuento ])
    Book.create!(title: "Ficciones", categories: [ cuentos ])
    sign_in_as_admin
    click_on "Categorías"
  end

  test "adding, renaming and deleting a category" do
    fill_in "Nueva categoría", with: "Teatro"
    click_on "Agregar"
    assert_text "Se agregó “Teatro”."

    click_on "Renombrar “Teatro”"
    within("[role=dialog]") do
      fill_in "Nombre", with: "Obras de teatro"
      click_on "Guardar"
    end
    assert_text "“Teatro” ahora se llama “Obras de teatro”."

    click_on "Mover “Obras de teatro” a la papelera"
    assert_text "“Obras de teatro” se movió a la papelera."
    click_on "Deshacer"
    assert_selector "tbody", text: "Obras de teatro"
  end

  test "a category with books cannot be deleted, but can be merged" do
    assert_selector "button[aria-label='Mover “Cuento” a la papelera'][disabled]"

    click_on "Unificar “Cuento” con otro"
    within("[role=dialog]") do
      find("button[aria-label='Elegir categoría']").click
    end
    find("[role=option]", text: "Cuentos").click
    within("[role=dialog]") do
      assert_text "1 libro pasa a “Cuentos”."
      click_on "Unificar"
    end

    assert_text "Se unificó “Cuento” con “Cuentos”."
    within(find("tbody tr", text: "Cuentos")) { assert_link "2" }
  end
end
