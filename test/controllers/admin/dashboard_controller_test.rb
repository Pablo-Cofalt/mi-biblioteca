require "test_helper"

class Admin::DashboardControllerTest < ActionDispatch::IntegrationTest
  test "requires logging in" do
    get admin_root_path

    assert_redirected_to new_session_path
  end

  test "shows the panel to a logged-in admin" do
    sign_in_as users(:admin)
    Book.create!(title: "Rayuela")

    get admin_root_path

    assert_response :success
    assert_inertia_component "admin/dashboard/index"
    assert_equal 1, inertia.props[:counts][:books]
    assert_equal "admin@example.com", inertia.props[:auth][:user][:email_address]
  end
end
