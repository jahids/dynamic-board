# 🚀 Quick Testing Guide

## ⚡ Fast Testing Commands

### 1. Run Validation Tests
```bash
node test/run-tests.js
```

### 2. Run SDK Demo Tests
```bash
node test/test-sdk.js
```

### 3. Test in React Native
```bash
# Replace example/App.js with test app
cp test/App.test.js example/App.js

# Start Expo
npx expo start
```

## 📱 Testing Checklist

### ✅ Basic Tests (5 minutes)
- [ ] Run `node test/run-tests.js` - should show 5/5 tests passed
- [ ] Run `node test/test-sdk.js` - should show all scenarios working
- [ ] Check console output for data collection examples

### ✅ React Native Tests (10 minutes)
- [ ] Start Expo app with test interface
- [ ] Tap "Test Local Config" button
- [ ] Navigate through all 4 screens
- [ ] Test file upload functionality
- [ ] Verify completion callback fires
- [ ] Check console for collected data

### ✅ Advanced Tests (15 minutes)
- [ ] Test error handling with invalid URLs
- [ ] Test different screen types (text, fileUpload, banner)
- [ ] Test navigation between screens
- [ ] Test data collection accuracy
- [ ] Test file upload with different file types

## 🎯 Expected Results

### Console Output Should Show:
```javascript
🎉 Onboarding Complete! Collected Data:
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

### Test Results Should Show:
```
📊 Test Results: 5/5 tests passed
🎉 All tests passed! Your SDK is ready to use.
```

## 🔧 Troubleshooting

### If tests fail:
1. **Check file structure** - all files should exist
2. **Verify JSON syntax** - `fakeDB.json` should be valid
3. **Check dependencies** - ensure expo-document-picker is installed
4. **Review console errors** - look for specific error messages

### If React Native tests fail:
1. **Check Expo installation** - `npx expo --version`
2. **Verify device/simulator** - ensure it's running
3. **Check permissions** - file upload needs device permissions
4. **Review network** - remote config tests need internet

## 📞 Quick Help

- **All tests pass** ✅ - Your SDK is ready to use!
- **Some tests fail** ⚠️ - Check the specific error messages
- **React Native issues** 📱 - Verify Expo setup and device
- **File upload problems** 📁 - Check expo-document-picker installation

## 🎉 Success Indicators

Your SDK is working correctly if:
- ✅ All validation tests pass
- ✅ React Native app loads without errors
- ✅ Navigation between screens works
- ✅ File upload functionality works
- ✅ Data collection logs appear in console
- ✅ Completion callback fires with correct data structure

**Your onboarding SDK is ready for production! 🚀**
