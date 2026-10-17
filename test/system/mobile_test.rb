require "application_system_test_case"

class MobileTest < ApplicationSystemTestCase
  setup do
    page.current_window.resize_to(390, 844)
    Book.create!(title: "Bestiario", authors: [ Author.create!(name: "Julio Cortázar") ], location: "Estante 3")
    Book.create!(title: "Ficciones")
  end

  teardown { page.current_window.resize_to(1280, 900) }

  test "the catalog shows books as cards, without sideways scrolling" do
    visit root_path

    within("ul[aria-label='Libros']") do
      assert_text "Bestiario"
      assert_text "Julio Cortázar"
      assert_text "Ubicación: Estante 3"
    end
    assert_no_selector "table"
    assert_not horizontal_scroll?

    click_on "Título: A-Z"
    assert_button "Título: Z-A"
    assert_equal [ "Ficciones", "Bestiario" ], all("ul[aria-label='Libros'] li p.font-medium").map(&:text)
  end

  test "admin actions are reachable on a phone" do
    sign_in_as_admin
    visit admin_books_path

    click_on "Mover “Bestiario” a la papelera"
    assert_text "“Bestiario” se movió a la papelera."
    assert_not horizontal_scroll?
  end

  private
    def horizontal_scroll?
      page.evaluate_script("document.documentElement.scrollWidth > window.innerWidth")
    end
end
