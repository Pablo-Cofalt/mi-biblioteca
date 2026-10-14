require "test_helper"

class CatalogEntryTest < ActiveSupport::TestCase
  [ Author, Category, Publisher ].each do |model|
    test "#{model.name} requires a name" do
      record = model.new(name: " ")

      assert_not record.valid?
      assert_includes record.errors[:name], "no puede estar en blanco"
    end

    test "#{model.name} squishes the name" do
      assert_equal "María Elena Walsh", model.new(name: "  María   Elena Walsh ").name
    end

    test "#{model.name} names are unique regardless of case" do
      model.create!(name: "Planeta")
      duplicate = model.new(name: "planeta")

      assert_not duplicate.valid?
      assert_includes duplicate.errors[:name], "ya existe"
    end

    test "#{model.name} cannot be destroyed while it has books" do
      record = model.create!(name: "En uso")
      Book.create!(title: "Un libro", model.model_name.plural => [ record ])

      assert_not record.destroy
      assert_includes record.errors[:base], "No se puede eliminar el registro porque existen libros dependientes"
    end

    test "#{model.name}.for_names finds or creates, ignoring blanks and repeats" do
      existing = model.create!(name: "Planeta")

      records = model.for_names([ "PLANETA", "", "Nuevo", "nuevo " ])

      assert_equal [ existing, model.find_by!(name: "Nuevo") ], records
      assert_equal 2, model.count
    end

    test "#{model.name}.for_names restores names that are in the trash" do
      trashed = model.create!(name: "En la papelera", discarded_at: Time.current)

      assert_equal [ trashed ], model.for_names([ "en la papelera" ])
      assert trashed.reload.kept?
    end

    test "#{model.name} counts only books that are not in the trash" do
      entry = model.create!(name: "Con libros")
      association = model.model_name.plural
      Book.create!(title: "Activo", association => [ entry ])
      Book.create!(title: "Borrado", association => [ entry ], discarded_at: Time.current)

      assert_equal({ entry.id => 1 }, model.kept_book_counts)
      assert entry.kept_books?
    end

    test "#{model.name} merges into another, moving books without duplicates" do
      association = model.model_name.plural
      source = model.create!(name: "Duplicado")
      target = model.create!(name: "Original")
      only_source = Book.create!(title: "Solo en el duplicado", association => [ source ])
      both = Book.create!(title: "En los dos", association => [ source, target ])

      source.merge_into!(target)

      assert source.reload.discarded?
      assert_empty source.books
      assert_equal [ target ], only_source.reload.public_send(association)
      assert_equal [ target ], both.reload.public_send(association)
    end

    test "#{model.name} cannot merge into itself" do
      entry = model.create!(name: "Único")

      assert_raises(ArgumentError) { entry.merge_into!(entry) }
      assert entry.reload.kept?
    end

    test "#{model.name} sorts alphabetically in Spanish" do
      %w[Zeta Ángel beta].each { |name| model.create!(name:) }

      assert_equal %w[Ángel beta Zeta], model.alphabetical.pluck(:name)
    end
  end
end
