require "test_helper"

Capybara.enable_aria_label = true

class ApplicationSystemTestCase < ActionDispatch::SystemTestCase
  driven_by :selenium, using: :headless_chrome, screen_size: [ 1280, 900 ]

  private
    def sign_in_as_admin(user = users(:admin), password: "password123")
      visit new_session_path
      fill_in "Email", with: user.email_address
      fill_in "Contraseña", with: password
      click_on "Ingresar"
      assert_text "Panel de administración"
    end
end
