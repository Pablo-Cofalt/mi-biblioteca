# frozen_string_literal: true

class InertiaController < ApplicationController
  # Share data with all Inertia responses
  # see https://inertia-rails.dev/guide/shared-data
  inertia_share auth: -> { { user: authenticated? ? Current.user.slice(:id, :email_address) : nil } }
end
