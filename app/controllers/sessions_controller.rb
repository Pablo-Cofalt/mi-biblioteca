class SessionsController < InertiaController
  allow_unauthenticated_access only: %i[new create]
  rate_limit to: 10, within: 3.minutes, only: :create, with: -> {
    redirect_to new_session_path, alert: "Demasiados intentos. Esperá unos minutos y volvé a probar."
  }

  def new
    return redirect_to admin_root_path if authenticated?

    render inertia: {}
  end

  def create
    if user = User.authenticate_by(params.permit(:email_address, :password))
      start_new_session_for user
      redirect_to after_authentication_url
    else
      redirect_to new_session_path, inertia: { errors: { email_address: [ "Email o contraseña incorrectos." ] } }
    end
  end

  def destroy
    terminate_session
    redirect_to root_path, status: :see_other, notice: "Cerraste sesión."
  end
end
