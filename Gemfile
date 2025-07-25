source "https://rubygems.org"

# Ruby version
ruby "~> 3.0"

# Fastlane for automation
gem "fastlane", "~> 2.220"

# Code coverage reporting
gem "slather", "~> 2.8"

# Code signing
gem "match", "~> 0.15"

# Additional fastlane plugins
gem "fastlane-plugin-versioning", "~> 0.5"
gem "fastlane-plugin-badge", "~> 0.15"
gem "fastlane-plugin-changelog", "~> 0.16"

# CocoaPods for dependency management
gem "cocoapods", "~> 1.15"

# Development and testing tools
group :development, :test do
  gem "rspec", "~> 3.12"
  gem "rubocop", "~> 1.60"
  gem "rubocop-performance", "~> 1.20"
  gem "rubocop-rspec", "~> 2.26"
end

# Plugins
plugins_path = File.join(File.dirname(__FILE__), 'fastlane', 'Pluginfile')
eval_gemfile(plugins_path) if File.exist?(plugins_path)