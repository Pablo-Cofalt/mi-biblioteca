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

    test "#{model.name} sorts alphabetically in Spanish" do
      %w[Zeta Ángel beta].each { |name| model.create!(name:) }

      assert_equal %w[Ángel beta Zeta], model.alphabetical.pluck(:name)
    end
  end
end
