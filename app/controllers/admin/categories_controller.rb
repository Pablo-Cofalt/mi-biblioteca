class Admin::CategoriesController < Admin::CatalogEntriesController
  private
    def model = Category
    def labels = { singular: "categoría", plural: "categorías", title: "Categorías", new: "Nueva categoría" }
end
