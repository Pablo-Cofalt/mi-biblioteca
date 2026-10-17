class Admin::AuthorsController < Admin::CatalogEntriesController
  private
    def model = Author
    def labels = { singular: "autor", plural: "autores", title: "Autores", new: "Nuevo autor" }
end
