require "test_helper"
require "rake"

class AdminTaskTest < ActiveSupport::TestCase
  setup do
    Rails.application.load_tasks unless Rake::Task.task_defined?("admin:password")
    @user = users(:admin)
  end

  teardown { Rake::Task["admin:password"].reenable }

  test "changes the password and closes open sessions" do
    @user.sessions.create!

    run_task input: "nueva-clave\nnueva-clave\n"

    assert @user.reload.authenticate("nueva-clave")
    assert_empty @user.sessions
  end

  test "rejects a confirmation that does not match" do
    error = assert_raises(SystemExit) { run_task input: "nueva-clave\notra-clave\n" }

    assert_not error.success?
    assert @user.reload.authenticate("password123")
  end

  private
    def run_task(input:)
      original_stdin = $stdin
      $stdin = StringIO.new(input)
      capture_io { Rake::Task["admin:password"].invoke }
    ensure
      $stdin = original_stdin
    end
end
