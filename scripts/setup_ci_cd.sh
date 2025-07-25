#!/bin/bash

# Setup script for iOS SwiftUI CI/CD Pipeline
# This script configures the development environment and CI/CD tools

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Helper functions
print_header() {
    echo -e "\n${BLUE}===================================================${NC}"
    echo -e "${BLUE}$1${NC}"
    echo -e "${BLUE}===================================================${NC}\n"
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

# Check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Main setup function
main() {
    print_header "iOS SwiftUI CI/CD Setup"
    
    # Check if we're on macOS
    if [[ "$OSTYPE" != "darwin"* ]]; then
        print_error "This script is designed for macOS. Please run on a Mac."
        exit 1
    fi
    
    # Check system requirements
    check_system_requirements
    
    # Install development tools
    install_development_tools
    
    # Setup Ruby environment
    setup_ruby_environment
    
    # Install iOS development tools
    install_ios_tools
    
    # Configure project
    configure_project
    
    # Setup git hooks
    setup_git_hooks
    
    # Final verification
    verify_setup
    
    print_header "Setup Complete! 🎉"
    print_success "Your iOS SwiftUI CI/CD pipeline is ready!"
    print_info "Next steps:"
    echo "  1. Update the scheme names in .github/workflows/ci.yml"
    echo "  2. Configure your GitHub repository secrets"
    echo "  3. Update fastlane/Appfile with your app details"
    echo "  4. Run: bundle exec fastlane code_quality"
    echo ""
    echo "For detailed instructions, see: CI_CD_README.md"
}

check_system_requirements() {
    print_header "Checking System Requirements"
    
    # Check Xcode
    if command_exists xcodebuild; then
        XCODE_VERSION=$(xcodebuild -version | head -n1 | awk '{print $2}')
        print_success "Xcode $XCODE_VERSION is installed"
    else
        print_error "Xcode is not installed. Please install Xcode from the App Store."
        exit 1
    fi
    
    # Check Command Line Tools
    if xcode-select -p >/dev/null 2>&1; then
        print_success "Xcode Command Line Tools are installed"
    else
        print_warning "Installing Xcode Command Line Tools..."
        xcode-select --install
        print_info "Please complete the Command Line Tools installation and run this script again."
        exit 1
    fi
    
    # Check Ruby
    if command_exists ruby; then
        RUBY_VERSION=$(ruby -v | awk '{print $2}')
        print_success "Ruby $RUBY_VERSION is installed"
    else
        print_error "Ruby is not installed. Please install Ruby 3.0+."
        exit 1
    fi
    
    # Check Git
    if command_exists git; then
        print_success "Git is installed"
    else
        print_error "Git is not installed. Please install Git."
        exit 1
    fi
}

install_development_tools() {
    print_header "Installing Development Tools"
    
    # Check and install Homebrew
    if command_exists brew; then
        print_success "Homebrew is already installed"
    else
        print_warning "Installing Homebrew..."
        /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
        print_success "Homebrew installed"
    fi
    
    # Update Homebrew
    print_info "Updating Homebrew..."
    brew update
}

setup_ruby_environment() {
    print_header "Setting up Ruby Environment"
    
    # Check if Bundler is installed
    if command_exists bundle; then
        print_success "Bundler is already installed"
    else
        print_warning "Installing Bundler..."
        gem install bundler
        print_success "Bundler installed"
    fi
    
    # Install Ruby dependencies
    if [ -f "Gemfile" ]; then
        print_info "Installing Ruby dependencies..."
        bundle config set --local path 'vendor/bundle'
        bundle install
        print_success "Ruby dependencies installed"
    else
        print_warning "Gemfile not found. Creating basic Gemfile..."
        cat > Gemfile << EOF
source "https://rubygems.org"

gem "fastlane"
gem "cocoapods"
EOF
        bundle install
        print_success "Basic Gemfile created and dependencies installed"
    fi
}

install_ios_tools() {
    print_header "Installing iOS Development Tools"
    
    # Install SwiftLint
    if command_exists swiftlint; then
        print_success "SwiftLint is already installed"
    else
        print_warning "Installing SwiftLint..."
        brew install swiftlint
        print_success "SwiftLint installed"
    fi
    
    # Install SwiftFormat
    if command_exists swiftformat; then
        print_success "SwiftFormat is already installed"
    else
        print_warning "Installing SwiftFormat..."
        brew install swiftformat
        print_success "SwiftFormat installed"
    fi
    
    # Install Periphery
    if command_exists periphery; then
        print_success "Periphery is already installed"
    else
        print_warning "Installing Periphery..."
        brew install peripheryapp/periphery/periphery
        print_success "Periphery installed"
    fi
    
    # Install xcpretty
    if command_exists xcpretty; then
        print_success "xcpretty is already installed"
    else
        print_warning "Installing xcpretty..."
        gem install xcpretty
        print_success "xcpretty installed"
    fi
}

configure_project() {
    print_header "Configuring Project"
    
    # Create directories if they don't exist
    mkdir -p .github/workflows
    mkdir -p fastlane
    mkdir -p scripts
    
    # Check if configuration files exist
    if [ -f ".swiftlint.yml" ]; then
        print_success ".swiftlint.yml already exists"
    else
        print_warning ".swiftlint.yml not found. Make sure to create it."
    fi
    
    if [ -f ".swiftformat" ]; then
        print_success ".swiftformat already exists"
    else
        print_warning ".swiftformat not found. Make sure to create it."
    fi
    
    if [ -f ".github/workflows/ci.yml" ]; then
        print_success "CI workflow already exists"
    else
        print_warning "CI workflow not found. Make sure to create it."
    fi
    
    if [ -f ".github/workflows/release.yml" ]; then
        print_success "Release workflow already exists"
    else
        print_warning "Release workflow not found. Make sure to create it."
    fi
    
    if [ -f "fastlane/Fastfile" ]; then
        print_success "Fastfile already exists"
    else
        print_warning "Fastfile not found. Make sure to create it."
    fi
    
    # Initialize fastlane if not already done
    if [ ! -f "fastlane/Appfile" ]; then
        print_info "Initializing Fastlane..."
        bundle exec fastlane init || true
        print_success "Fastlane initialized"
    else
        print_success "Fastlane already initialized"
    fi
}

setup_git_hooks() {
    print_header "Setting up Git Hooks"
    
    # Create pre-commit hook for code quality
    if [ ! -f ".git/hooks/pre-commit" ]; then
        print_info "Creating pre-commit hook..."
        cat > .git/hooks/pre-commit << 'EOF'
#!/bin/bash

# Pre-commit hook for iOS SwiftUI project
# Runs code quality checks before commit

echo "🔍 Running pre-commit checks..."

# Check if SwiftLint is available
if command -v swiftlint >/dev/null 2>&1; then
    echo "Running SwiftLint..."
    swiftlint --strict
    if [ $? -ne 0 ]; then
        echo "❌ SwiftLint failed. Please fix the issues and try again."
        exit 1
    fi
    echo "✅ SwiftLint passed"
else
    echo "⚠️  SwiftLint not found. Skipping..."
fi

# Check if SwiftFormat is available
if command -v swiftformat >/dev/null 2>&1; then
    echo "Running SwiftFormat check..."
    swiftformat --lint .
    if [ $? -ne 0 ]; then
        echo "❌ SwiftFormat check failed. Run 'swiftformat .' to fix formatting."
        exit 1
    fi
    echo "✅ SwiftFormat check passed"
else
    echo "⚠️  SwiftFormat not found. Skipping..."
fi

echo "✅ All pre-commit checks passed!"
EOF
        chmod +x .git/hooks/pre-commit
        print_success "Pre-commit hook created"
    else
        print_success "Pre-commit hook already exists"
    fi
}

verify_setup() {
    print_header "Verifying Setup"
    
    # Check tools are working
    echo "Checking installed tools:"
    
    if command_exists swiftlint; then
        SWIFTLINT_VERSION=$(swiftlint version)
        print_success "SwiftLint $SWIFTLINT_VERSION"
    else
        print_error "SwiftLint not found"
    fi
    
    if command_exists swiftformat; then
        SWIFTFORMAT_VERSION=$(swiftformat --version)
        print_success "SwiftFormat $SWIFTFORMAT_VERSION"
    else
        print_error "SwiftFormat not found"
    fi
    
    if command_exists periphery; then
        PERIPHERY_VERSION=$(periphery version)
        print_success "Periphery $PERIPHERY_VERSION"
    else
        print_error "Periphery not found"
    fi
    
    if command_exists bundle; then
        print_success "Bundler $(bundle version | awk '{print $3}')"
    else
        print_error "Bundler not found"
    fi
    
    # Test fastlane
    if bundle exec fastlane --version >/dev/null 2>&1; then
        FASTLANE_VERSION=$(bundle exec fastlane --version | head -n1)
        print_success "Fastlane $FASTLANE_VERSION"
    else
        print_error "Fastlane not working properly"
    fi
    
    # Check Xcode tools
    if command_exists xcodebuild; then
        print_success "xcodebuild available"
    else
        print_error "xcodebuild not found"
    fi
    
    if command_exists xcrun; then
        print_success "xcrun available"
    else
        print_error "xcrun not found"
    fi
}

# Run the main function
main "$@"