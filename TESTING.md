# 🧪 Testing Guide for Onboarding SDK

This guide covers all the different ways to test your React Native Onboarding SDK.

## 📋 Quick Start Testing

### 1. Run Basic Validation Tests

```bash
# From the project root
node test/run-tests.js
```

This will run automated tests to validate:
- ✅ Configuration file structure
- ✅ Screen types validation
- ✅ Navigation targets
- ✅ Required files existence
- ✅ Package.json validation

### 2. Test in React Native Environment

Replace your `example/App.js` with the test app:

```javascript
// In example/App.js
import TestApp from '../test/App.test.js';
export default TestApp;
```

Then run your Expo app:
```bash
npx expo start
```

## 🎯 Testing Scenarios

### Scenario 1: Basic Functionality Test

**What to test:**
- ✅ Component loads without errors
- ✅ Progress indicator shows correctly
- ✅ Navigation between screens works
- ✅ Buttons respond to touch
- ✅ Completion callback fires

**Steps:**
1. Run the test app
2. Tap "Test Local Config"
3. Navigate through all screens
4. Check console for data collection logs

### Scenario 2: File Upload Test

**What to test:**
- ✅ File picker opens
- ✅ File selection works
- ✅ Upload confirmation shows
- ✅ File data is collected

**Steps:**
1. Navigate to file upload screen
2. Tap "Choose File"
3. Select an image file
4. Verify file name appears
5. Complete onboarding
6. Check console for file data

### Scenario 3: Error Handling Test

**What to test:**
- ✅ Invalid URLs show error states
- ✅ Network errors are handled gracefully
- ✅ Invalid configurations show appropriate errors

**Steps:**
1. Tap "Test Error Handling"
2. Verify error message appears
3. Check that app doesn't crash

### Scenario 4: Data Collection Test

**What to test:**
- ✅ All user interactions are tracked
- ✅ Timestamps are recorded
- ✅ File uploads are captured
- ✅ Final data structure is correct

**Expected console output:**
```javascript
{
  "screen1": {
    "screenId": "screen1",
    "actionClicked": "Next",
    "timestamp": "2024-01-01T12:00:00.000Z"
  },
  "screen2": {
    "screenId": "screen2",
    "actionClicked": "Continue",
    "fileUploaded": "profile.jpg",
    "timestamp": "2024-01-01T12:01:00.000Z"
  }
}
```

## 🔧 Manual Testing Checklist

### Configuration Testing
- [ ] Local JSON config loads correctly
- [ ] Remote config URL works
- [ ] Invalid config shows error
- [ ] Missing config shows error

### Screen Rendering
- [ ] Text screens display correctly
- [ ] File upload screens work
- [ ] Banner screens show properly
- [ ] Progress indicator updates
- [ ] Screen transitions are smooth

### User Interactions
- [ ] Buttons respond to touch
- [ ] File picker opens
- [ ] Navigation works correctly
- [ ] Skip buttons function
- [ ] End target completes flow

### Data Collection
- [ ] Button clicks are tracked
- [ ] File uploads are recorded
- [ ] Timestamps are accurate
- [ ] Completion callback fires
- [ ] Data structure is correct

### Error Scenarios
- [ ] Network errors handled
- [ ] Invalid URLs show errors
- [ ] Missing files handled
- [ ] App doesn't crash on errors

## 🧪 Advanced Testing

### Custom Configuration Testing

You can test with different configurations by modifying `assets/config/fakeDB.json`:

```json
{
  "screens": [
    {
      "id": "custom_test",
      "type": "text",
      "content": {
        "title": "Custom Test",
        "subtitle": "Testing custom configuration",
        "color": "#FF0000",
        "background": "#000000"
      },
      "actions": [
        {
          "type": "button",
          "label": "Test Button",
          "color": "#FFFFFF",
          "background": "#FF0000",
          "target": "end"
        }
      ]
    }
  ]
}
```

### Performance Testing

Test with larger configurations:
- 10+ screens
- Multiple file upload screens
- Complex navigation flows

### Accessibility Testing

- [ ] Screen reader compatibility
- [ ] High contrast mode
- [ ] Large text support
- [ ] Touch target sizes

## 🐛 Debugging Tips

### Console Logging

The SDK provides detailed console logs:
```javascript
// Check for these log messages:
console.log('🎉 Onboarding Complete! Collected Data:', data);
console.log('Error loading onboarding config:', error);
```

### Common Issues

1. **File upload not working:**
   - Check expo-document-picker installation
   - Verify permissions on device

2. **Navigation not working:**
   - Check target screen IDs exist
   - Verify JSON structure

3. **Data not collecting:**
   - Check onComplete callback
   - Verify console logs

4. **Styling issues:**
   - Check color/background values
   - Verify screen dimensions

## 📱 Device Testing

### iOS Testing
- [ ] iPhone simulator
- [ ] Physical iPhone device
- [ ] Different iOS versions

### Android Testing
- [ ] Android emulator
- [ ] Physical Android device
- [ ] Different Android versions

### Web Testing (if using Expo Web)
- [ ] Chrome browser
- [ ] Safari browser
- [ ] Firefox browser

## 🔄 Continuous Testing

### Automated Tests

Add to your CI/CD pipeline:
```bash
# Run validation tests
node test/run-tests.js

# Check for linting errors
npx eslint src/

# Verify package structure
npm run build
```

### Test Coverage

Consider adding:
- Unit tests for utility functions
- Integration tests for component behavior
- E2E tests for complete flows

## 📊 Test Results

After running tests, you should see:

```
🧪 Running Onboarding SDK Tests...

📋 Test 1: Configuration File Validation
✅ Config file exists and is valid JSON
✅ Found 4 screens in configuration
  ✅ Screen 1: screen1 (text)
  ✅ Screen 2: screen2 (fileUpload)
  ✅ Screen 3: screen3 (text)
  ✅ Screen 4: screen4 (banner)

🎨 Test 2: Screen Types Validation
✅ All screen types are valid
✅ Used screen types: text, fileUpload, banner

🧭 Test 3: Navigation Targets Validation
✅ Found end target - onboarding can complete
✅ All navigation targets are valid

📁 Test 4: Required Files Check
✅ ../src/OnboardingScreen.js
✅ ../index.js
✅ ../package.json
✅ ../README.md
✅ ../index.d.ts

📦 Test 5: Package.json Validation
✅ Package.json has all required fields
✅ Package name: bless-dev
✅ Version: 1.0.0

==================================================
📊 Test Results: 5/5 tests passed
🎉 All tests passed! Your SDK is ready to use.
```

## 🎯 Next Steps

1. **Run all tests** to verify functionality
2. **Test on real devices** for complete validation
3. **Test with your backend** when ready
4. **Add more test cases** as needed
5. **Document any issues** found during testing

Your SDK is now ready for production use! 🚀
