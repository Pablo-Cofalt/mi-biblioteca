require "application_system_test_case"

class SessionsTest < ApplicationSystemTestCase
  test "logging in and out" do
    visit root_path
    click_on "Ingresar"

    fill_in "Email", with: "admin@example.com"
    fill_in "Contraseña", with: "incorrecta"
    click_on "Ingresar"
    assert_text "Email o contraseña incorrectos."
    assert_field "Contraseña", with: ""

    fill_in "Contraseña", with: "password123"
    click_on "Ingresar"
    assert_text "Panel de administración"
    assert_text "admin@example.com"

    click_on "Salir"
    assert_text "Cerraste sesión."
    assert_link "Ingresar"
  end

  test "the admin panel asks for login and comes back after it" do
    visit admin_books_path

    assert_current_path new_session_path
    fill_in "Email", with: "admin@example.com"
    fill_in "Contraseña", with: "password123"
    click_on "Ingresar"

    assert_current_path admin_books_path
  end
end
