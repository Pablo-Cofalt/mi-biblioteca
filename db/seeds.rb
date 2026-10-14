# This file should ensure the existence of records required to run the application in every environment (production,
# development, test). The code here should be idempotent so that it can be executed at any point in every environment.
# The data can then be loaded with the bin/rails db:seed command (or created alongside the database with db:setup).

if Rails.env.development?
  load Rails.root.join("db/seeds/development.rb")
elsif ENV["ADMIN_EMAIL"].present? && ENV["ADMIN_PASSWORD"].present?
  # Only creates the admin: an existing password is never overwritten.
  User.find_or_create_by!(email_address: ENV["ADMIN_EMAIL"]) do |user|
    user.password = ENV["ADMIN_PASSWORD"]
  end
end
