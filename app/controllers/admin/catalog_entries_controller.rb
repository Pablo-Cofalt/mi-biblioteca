# Admin screens for the lists books are classified by. Subclasses only
# say which model they manage and how to name it in Spanish.
class Admin::CatalogEntriesController < Admin::BaseController
  before_action :set_entry, only: %i[update destroy merge]
  before_action :set_discarded_entry, only: %i[restore purge]

  def index
    entries = model.kept.alphabetical
    entries = entries.matching(params[:q].squish) if params[:q].present?
    pagination = Pagination.new(entries, page: params[:page])
    counts = model.kept_book_counts

    render inertia: "admin/catalog/index", props: {
      list: list_props,
      entries: pagination.records.map { |entry| entry_props(entry, counts) },
      filters: { q: params[:q].presence },
      pagination: pagination.as_json,
      trash_count: model.discarded.count,
      all_entries: model.kept.alphabetical.pluck(:id, :name).map { |id, name| { id:, name: } }
    }
  end

  def create
    name = params.expect(entry: [ :name ])[:name]

    if (existing = model.find_by_name(name))&.discarded?
      existing.undiscard!
      redirect_to list_path, notice: "“#{existing.name}” estaba en la papelera y se restauró."
    else
      entry = model.new(name:)
      if entry.save
        redirect_to list_path, notice: "Se agregó “#{entry.name}”."
      else
        redirect_to list_path, inertia: { errors: entry.errors.to_hash }
      end
    end
  end

  def update
    old_name = @entry.name

    if @entry.update(params.expect(entry: [ :name ]))
      redirect_back_or_to list_path, notice: "“#{old_name}” ahora se llama “#{@entry.name}”."
    else
      redirect_back_or_to list_path, inertia: { errors: @entry.errors.to_hash }
    end
  end

  def destroy
    if @entry.kept_books?
      redirect_back_or_to list_path, status: :see_other,
        alert: "No se puede borrar “#{@entry.name}” porque tiene libros. Podés unificarlo con otro."
    else
      @entry.discard!
      flash[:notice] = "“#{@entry.name}” se movió a la papelera."
      flash.inertia[:undo] = url_for(action: :restore, id: @entry, only_path: true)
      redirect_back_or_to list_path, status: :see_other
    end
  end

  def merge
    target = model.kept.find(params.expect(:target_id))
    @entry.merge_into!(target)

    redirect_back_or_to list_path, status: :see_other, notice: "Se unificó “#{@entry.name}” con “#{target.name}”."
  rescue ArgumentError => error
    redirect_back_or_to list_path, status: :see_other, alert: error.message
  end

  def trash
    pagination = Pagination.new(model.discarded.order(discarded_at: :desc, id: :desc), page: params[:page])
    counts = model.book_links.where(model.book_link_key => pagination.records.select(:id))
                  .group(model.book_link_key).count

    render inertia: "admin/catalog/trash", props: {
      list: list_props,
      entries: pagination.records.map do |entry|
        { id: entry.id, name: entry.name, books_count: counts.fetch(entry.id, 0), discarded_at: entry.discarded_at }
      end,
      pagination: pagination.as_json
    }
  end

  def restore
    @entry.undiscard!
    redirect_back_or_to list_path, status: :see_other, notice: "Se restauró “#{@entry.name}”."
  end

  def purge
    if @entry.destroy
      redirect_to url_for(action: :trash), status: :see_other, notice: "“#{@entry.name}” se eliminó definitivamente."
    else
      redirect_to url_for(action: :trash), status: :see_other,
        alert: "No se puede eliminar “#{@entry.name}” porque tiene libros en la papelera."
    end
  end

  private
    # The managed model (Author, Category or Publisher).
    def model
      raise NotImplementedError
    end

    # Spanish names for the list: { singular:, plural:, new: } and the
    # book filter param it maps to.
    def labels
      raise NotImplementedError
    end

    def set_entry
      @entry = model.kept.find(params[:id])
    end

    def set_discarded_entry
      @entry = model.discarded.find(params[:id])
    end

    def list_path
      url_for(action: :index, only_path: true)
    end

    def list_props
      { **labels, path: list_path, book_filter: "#{model.model_name.singular}_id" }
    end

    def entry_props(entry, counts)
      { id: entry.id, name: entry.name, books_count: counts.fetch(entry.id, 0) }
    end
end
