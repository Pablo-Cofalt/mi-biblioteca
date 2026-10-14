class Admin::PublishersController < Admin::CatalogEntriesController
  private
    def model = Publisher
    def labels = { singular: "editorial", plural: "editoriales", title: "Editoriales", new: "Nueva editorial" }
end
