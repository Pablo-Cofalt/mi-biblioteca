require "test_helper"

class UserTest < ActiveSupport::TestCase
  test "downcases and strips email_address" do
    user = User.new(email_address: " DOWNCASED@EXAMPLE.COM ")
    assert_equal("downcased@example.com", user.email_address)
  end

  test "requires a valid, unique email" do
    assert_not User.new(email_address: "", password: "password123").valid?
    assert_not User.new(email_address: "no-es-un-email", password: "password123").valid?

    duplicate = User.new(email_address: "ADMIN@example.com", password: "password123")
    assert_not duplicate.valid?
    assert_includes duplicate.errors[:email_address], "ya existe"
  end

  test "requires a password of at least 8 characters" do
    user = User.new(email_address: "nuevo@example.com", password: "corta")

    assert_not user.valid?
    assert_includes user.errors[:password], "es demasiado corto (mínimo 8 caracteres)"
  end
end
