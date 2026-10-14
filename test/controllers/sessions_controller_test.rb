require "test_helper"

class SessionsControllerTest < ActionDispatch::IntegrationTest
  setup { @user = users(:admin) }

  test "shows the login page" do
    get new_session_path

    assert_response :success
    assert_inertia_component "sessions/new"
  end

  test "redirects to the admin panel when already logged in" do
    sign_in_as @user

    get new_session_path

    assert_redirected_to admin_root_path
  end

  test "logs in with valid credentials" do
    post session_path, params: { email_address: "ADMIN@example.com ", password: "password123" }

    assert_redirected_to admin_root_url
    assert cookies[:session_id]
  end

  test "returns to the requested page after logging in" do
    get admin_root_path
    assert_redirected_to new_session_path

    post session_path, params: { email_address: @user.email_address, password: "password123" }

    assert_redirected_to admin_root_url
  end

  test "rejects invalid credentials" do
    post session_path, params: { email_address: @user.email_address, password: "incorrecta" }

    assert_redirected_to new_session_path
    assert_nil cookies[:session_id]

    follow_redirect!
    assert_equal [ "Email o contraseña incorrectos." ], inertia.props[:errors][:email_address]
  end

  test "logs out" do
    sign_in_as @user

    assert_difference -> { @user.sessions.count }, -1 do
      delete session_path
    end

    assert_redirected_to root_path
    assert_empty cookies[:session_id]
    assert_equal "Cerraste sesión.", flash[:notice]
  end

  test "logging out requires a session" do
    delete session_path

    assert_redirected_to new_session_path
  end
end
