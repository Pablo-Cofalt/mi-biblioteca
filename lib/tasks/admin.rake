namespace :admin do
  desc "Cambia la contraseña de un administrador (EMAIL=... para elegir cuál; por defecto, el primero)"
  task password: :environment do
    user = ENV["EMAIL"] ? User.find_by(email_address: ENV["EMAIL"].strip.downcase) : User.order(:id).first
    abort "No se encontró el usuario administrador." unless user

    password = read_secret("Nueva contraseña para #{user.email_address}: ")
    confirmation = read_secret("Repetí la contraseña: ")

    if user.update(password:, password_confirmation: confirmation)
      user.sessions.destroy_all
      puts "Contraseña actualizada. Se cerraron las sesiones abiertas."
    else
      abort user.errors.full_messages.to_sentence
    end
  end

  def read_secret(prompt)
    if $stdin.tty?
      require "io/console"
      $stdin.getpass(prompt)
    else
      print prompt
      $stdin.gets.to_s.chomp
    end
  end
end
