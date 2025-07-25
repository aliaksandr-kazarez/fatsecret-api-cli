# iOS SwiftUI CI/CD Pipeline

This repository contains a comprehensive CI/CD pipeline for iOS SwiftUI applications using GitHub Actions, Fastlane, and various code quality tools.

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Setup](#setup)
- [Configuration](#configuration)
- [Workflows](#workflows)
- [Tools](#tools)
- [Usage](#usage)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)

## 🔍 Overview

This CI/CD pipeline implements the following stages:

### CI Pipeline
1. **Code Formatting** - SwiftFormat and SwiftLint
2. **Static Analysis** - Xcode Analyzer and Periphery
3. **Unit Testing** - XCTest with coverage enforcement (80% minimum)
4. **Build Verification** - Debug and Release builds
5. **E2E Testing** - UI Tests automation
6. **Pre-deployment** - IPA validation and dry-run deployment

### Release Pipeline
1. **Version Management** - Automatic version bumping
2. **Documentation Update** - Changelog generation
3. **Build & Archive** - Release IPA creation
4. **Deployment** - TestFlight and App Store uploads
5. **Notifications** - Slack integration for status updates

## ✨ Features

- ✅ **Code Quality Enforcement**
  - SwiftLint for style and conventions
  - SwiftFormat for consistent formatting
  - Custom SwiftUI-specific rules

- ✅ **Static Analysis**
  - Xcode built-in analyzer
  - Periphery for dead code detection
  - Code complexity metrics

- ✅ **Testing & Coverage**
  - Unit tests with XCTest
  - UI tests for E2E scenarios
  - Code coverage reporting with 80% threshold
  - Test result artifacts and reports

- ✅ **Build & Deployment**
  - Multi-configuration builds (Debug/Release)
  - Automatic version management
  - TestFlight and App Store deployments
  - IPA validation and verification

- ✅ **Automation & Integration**
  - GitHub Actions workflows
  - Fastlane automation
  - Slack notifications
  - Artifact management

## 🚀 Setup

### Prerequisites

1. **Xcode 15.1+** with iOS 17.2+ SDK
2. **Ruby 3.0+** for Fastlane
3. **Homebrew** for tool installation
4. **Apple Developer Account** with App Store Connect access

### Initial Setup

1. **Clone and configure the repository:**
   ```bash
   git clone your-repo-url
   cd your-ios-app
   ```

2. **Install Ruby dependencies:**
   ```bash
   bundle install
   ```

3. **Install development tools:**
   ```bash
   # Install SwiftLint
   brew install swiftlint
   
   # Install SwiftFormat
   brew install swiftformat
   
   # Install Periphery
   brew install peripheryapp/periphery/periphery
   ```

4. **Configure project settings:**
   - Update scheme names in workflow files
   - Set your app identifier and team ID
   - Configure signing certificates

## ⚙️ Configuration

### Environment Variables

Set these secrets in your GitHub repository settings:

#### Required Secrets
```bash
# Apple Developer
APPLE_ID                 # Your Apple ID email
APPLE_TEAM_ID           # Your Apple Developer Team ID
ITC_TEAM_ID             # Your App Store Connect Team ID

# App Store Connect
APP_STORE_CONNECT_API_KEY_ID        # API Key ID
APP_STORE_CONNECT_API_ISSUER_ID     # API Issuer ID
APP_STORE_CONNECT_API_KEY_CONTENT   # API Key content (base64)

# Code Signing (if using manual signing)
CERTIFICATES_P12         # iOS Distribution certificate (base64)
CERTIFICATES_PASSWORD    # Certificate password
PROVISIONING_PROFILE     # Provisioning profile (base64)

# Notifications
SLACK_WEBHOOK_URL        # Slack webhook for notifications

# App Configuration
APP_IDENTIFIER          # Your app bundle identifier
SCHEME                  # Your main app scheme
UI_TEST_SCHEME         # Your UI test scheme
APP_NAME               # Your app name
```

### Project Configuration

1. **Update `.github/workflows/ci.yml`:**
   ```yaml
   # Replace these values with your project specifics
   - "YourAppScheme" → Your actual scheme name
   - "YourAppTarget" → Your actual target name
   - "YourApp.xcarchive" → Your app name
   ```

2. **Update `fastlane/Appfile`:**
   ```ruby
   app_identifier "com.yourcompany.yourapp"
   apple_id "your.email@example.com"
   team_id "YOUR_TEAM_ID"
   ```

3. **Configure SwiftLint (`.swiftlint.yml`):**
   ```yaml
   # Update included directories
   included:
     - Sources        # Your source directory
     - YourApp        # Your app directory
   ```

## 🔄 Workflows

### CI Workflow (`.github/workflows/ci.yml`)

Triggers on:
- Push to `main` and `develop` branches
- Pull requests to `main` and `develop`

Jobs:
1. **code-formatting** - SwiftFormat and SwiftLint checks
2. **static-analysis** - Code analysis and dead code detection
3. **unit-tests** - Unit testing with coverage
4. **build-verification** - Debug and Release builds
5. **e2e-tests** - UI testing
6. **pre-deployment** - IPA validation

### Release Workflow (`.github/workflows/release.yml`)

Triggers on:
- Git tags matching `v*.*.*`
- Manual dispatch with version input

Jobs:
1. **version-bump** - Version management and changelog
2. **build-release** - Release build creation
3. **test-release** - Release build validation
4. **create-release** - GitHub release creation
5. **notify** - Success/failure notifications

## 🛠️ Tools

### Code Quality
- **SwiftLint**: Style and convention enforcement
- **SwiftFormat**: Code formatting
- **Periphery**: Dead code detection

### Testing
- **XCTest**: Unit and UI testing framework
- **xcpretty**: Pretty test output formatting
- **Slather**: Code coverage reporting

### Build & Deployment
- **xcodebuild**: Build and test execution
- **Fastlane**: Automation and deployment
- **xcarchive**: App archiving and IPA creation

### CI/CD
- **GitHub Actions**: Workflow execution
- **Ruby/Bundler**: Dependency management
- **Homebrew**: Tool installation

## 📖 Usage

### Running Locally

#### Code Quality Checks
```bash
# Format code
swiftformat .

# Lint code
swiftlint

# Run all quality checks via Fastlane
bundle exec fastlane code_quality
```

#### Testing
```bash
# Unit tests
bundle exec fastlane test_unit

# UI tests
bundle exec fastlane test_ui

# All tests
xcodebuild test \
  -workspace YourApp.xcworkspace \
  -scheme YourAppScheme \
  -destination "platform=iOS Simulator,name=iPhone 15"
```

#### Building
```bash
# Debug build
bundle exec fastlane build_for_testing

# Release build
bundle exec fastlane build_release

# Complete CI pipeline
bundle exec fastlane ci
```

### GitHub Actions

#### CI Pipeline
Automatically runs on every push and pull request:
- Code quality checks
- Unit and UI tests
- Build verification
- Coverage reporting

#### Release Pipeline
Triggered by git tags or manual dispatch:
```bash
# Create a release
git tag v1.0.0
git push origin v1.0.0

# Or use GitHub's web interface for manual dispatch
```

### Fastlane Commands

```bash
# Code quality
bundle exec fastlane code_quality

# Testing
bundle exec fastlane test_unit
bundle exec fastlane test_ui

# Building
bundle exec fastlane build_release

# Deployment
bundle exec fastlane upload_testflight
bundle exec fastlane upload_appstore

# Complete pipelines
bundle exec fastlane ci
bundle exec fastlane release
```

## 🔧 Troubleshooting

### Common Issues

#### 1. Code Signing Issues
```bash
# Setup automatic code signing
fastlane match init
fastlane match development
fastlane match appstore
```

#### 2. Simulator Issues
```bash
# Reset simulators
xcrun simctl erase all
xcrun simctl boot "iPhone 15"
```

#### 3. Build Cache Issues
```bash
# Clean derived data
rm -rf ~/Library/Developer/Xcode/DerivedData
```

#### 4. Dependency Issues
```bash
# Clean and reinstall
bundle clean --force
bundle install
```

### Debug Mode

Enable debug logging:
```bash
# Fastlane debug mode
bundle exec fastlane ci --verbose

# Xcode debug mode
xcodebuild -showBuildSettings
```

### GitHub Actions Debugging

Add debug steps to workflows:
```yaml
- name: Debug Environment
  run: |
    echo "Xcode version: $(xcodebuild -version)"
    echo "Available schemes:"
    xcodebuild -list
    echo "Available simulators:"
    xcrun simctl list devices available
```

## 📝 Contributing

### Making Changes

1. **Fork the repository**
2. **Create a feature branch**
3. **Make your changes**
4. **Test locally:**
   ```bash
   bundle exec fastlane code_quality
   bundle exec fastlane test_unit
   ```
5. **Submit a pull request**

### Adding New Tools

1. **Update configuration files:**
   - Add tool installation to workflows
   - Update Fastfile with new lanes
   - Add configuration files

2. **Update documentation:**
   - Add tool description to README
   - Update troubleshooting section

### Workflow Modifications

1. **Test changes locally first:**
   ```bash
   # Validate YAML syntax
   yamllint .github/workflows/
   
   # Test fastlane changes
   bundle exec fastlane validate
   ```

2. **Use feature branches for workflow changes**
3. **Test with draft releases first**

## 📞 Support

### Getting Help

1. **Check the logs:**
   - GitHub Actions logs
   - Fastlane output
   - Xcode build logs

2. **Common resources:**
   - [Fastlane Documentation](https://docs.fastlane.tools/)
   - [GitHub Actions Documentation](https://docs.github.com/en/actions)
   - [Xcode Documentation](https://developer.apple.com/documentation/xcode)

3. **Community:**
   - [Fastlane Community](https://github.com/fastlane/fastlane/discussions)
   - [iOS Dev Community](https://iosdev.io/)

### Reporting Issues

When reporting issues, include:
- Error messages and logs
- Environment details (Xcode version, macOS version)
- Steps to reproduce
- Expected vs actual behavior

---

## 📄 License

This CI/CD configuration is available under the MIT License. See LICENSE file for details.

---

**Happy Coding! 🚀**