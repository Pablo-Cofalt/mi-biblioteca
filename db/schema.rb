# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema[8.1].define(version: 2026_10_07_190525) do
  # These are extensions that must be enabled in order to support this database
  enable_extension "pg_catalog.plpgsql"

  create_table "authors", force: :cascade do |t|
    t.string "name", null: false, collation: "es-AR-x-icu"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index "lower((name)::text)", name: "index_authors_on_lower_name", unique: true
  end

  create_table "book_authors", force: :cascade do |t|
    t.bigint "book_id", null: false
    t.bigint "author_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["author_id"], name: "index_book_authors_on_author_id"
    t.index ["book_id", "author_id"], name: "index_book_authors_on_book_id_and_author_id", unique: true
  end

  create_table "book_categories", force: :cascade do |t|
    t.bigint "book_id", null: false
    t.bigint "category_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["book_id", "category_id"], name: "index_book_categories_on_book_id_and_category_id", unique: true
    t.index ["category_id"], name: "index_book_categories_on_category_id"
  end

  create_table "book_publishers", force: :cascade do |t|
    t.bigint "book_id", null: false
    t.bigint "publisher_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["book_id", "publisher_id"], name: "index_book_publishers_on_book_id_and_publisher_id", unique: true
    t.index ["publisher_id"], name: "index_book_publishers_on_publisher_id"
  end

  create_table "books", force: :cascade do |t|
    t.string "title", null: false, collation: "es-AR-x-icu"
    t.string "location"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["title"], name: "index_books_on_title"
  end

  create_table "categories", force: :cascade do |t|
    t.string "name", null: false, collation: "es-AR-x-icu"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index "lower((name)::text)", name: "index_categories_on_lower_name", unique: true
  end

  create_table "publishers", force: :cascade do |t|
    t.string "name", null: false, collation: "es-AR-x-icu"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index "lower((name)::text)", name: "index_publishers_on_lower_name", unique: true
  end

  add_foreign_key "book_authors", "authors"
  add_foreign_key "book_authors", "books", on_delete: :cascade
  add_foreign_key "book_categories", "books", on_delete: :cascade
  add_foreign_key "book_categories", "categories"
  add_foreign_key "book_publishers", "books", on_delete: :cascade
  add_foreign_key "book_publishers", "publishers"
end
