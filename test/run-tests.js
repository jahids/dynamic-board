#!/usr/bin/env node

/**
 * Test script for Onboarding SDK
 * Run with: node test/run-tests.js
 */

const fs = require('fs');
const path = require('path');

console.log('🧪 Running Onboarding SDK Tests...\n');

// Test 1: Check if fakeDB.json exists and is valid JSON
function testConfigFile() {
  console.log('📋 Test 1: Configuration File Validation');
  
  try {
    const configPath = path.join(__dirname, '../assets/config/fakeDB.json');
    const configContent = fs.readFileSync(configPath, 'utf8');
    const config = JSON.parse(configContent);
    
    console.log('✅ Config file exists and is valid JSON');
    
    // Validate structure
    if (!config.screens || !Array.isArray(config.screens)) {
      throw new Error('Config must have a "screens" array');
    }
    
    console.log(`✅ Found ${config.screens.length} screens in configuration`);
    
    // Validate each screen
    config.screens.forEach((screen, index) => {
      if (!screen.id) {
        throw new Error(`Screen ${index} missing "id"`);
      }
      if (!screen.type) {
        throw new Error(`Screen ${index} missing "type"`);
      }
      if (!screen.content) {
        throw new Error(`Screen ${index} missing "content"`);
      }
      if (!screen.actions || !Array.isArray(screen.actions)) {
        throw new Error(`Screen ${index} missing "actions" array`);
      }
      
      console.log(`  ✅ Screen ${index + 1}: ${screen.id} (${screen.type})`);
    });
    
    return true;
  } catch (error) {
    console.log(`❌ Config validation failed: ${error.message}`);
    return false;
  }
}

// Test 2: Validate screen types
function testScreenTypes() {
  console.log('\n🎨 Test 2: Screen Types Validation');
  
  try {
    const configPath = path.join(__dirname, '../assets/config/fakeDB.json');
    const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
    
    const validTypes = ['text', 'fileUpload', 'banner'];
    const usedTypes = new Set();
    
    config.screens.forEach(screen => {
      usedTypes.add(screen.type);
      if (!validTypes.includes(screen.type)) {
        throw new Error(`Invalid screen type: ${screen.type}`);
      }
    });
    
    console.log('✅ All screen types are valid');
    console.log(`✅ Used screen types: ${Array.from(usedTypes).join(', ')}`);
    
    return true;
  } catch (error) {
    console.log(`❌ Screen types validation failed: ${error.message}`);
    return false;
  }
}

// Test 3: Validate navigation targets
function testNavigationTargets() {
  console.log('\n🧭 Test 3: Navigation Targets Validation');
  
  try {
    const configPath = path.join(__dirname, '../assets/config/fakeDB.json');
    const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
    
    const screenIds = config.screens.map(screen => screen.id);
    const validTargets = [...screenIds, 'end'];
    
    let hasEndTarget = false;
    
    config.screens.forEach(screen => {
      screen.actions.forEach(action => {
        if (!action.target) {
          throw new Error(`Action in screen ${screen.id} missing "target"`);
        }
        
        if (!validTargets.includes(action.target)) {
          throw new Error(`Invalid target "${action.target}" in screen ${screen.id}`);
        }
        
        if (action.target === 'end') {
          hasEndTarget = true;
        }
      });
    });
    
    if (!hasEndTarget) {
      console.log('⚠️  Warning: No action targets "end" - onboarding may not complete');
    } else {
      console.log('✅ Found end target - onboarding can complete');
    }
    
    console.log('✅ All navigation targets are valid');
    return true;
  } catch (error) {
    console.log(`❌ Navigation validation failed: ${error.message}`);
    return false;
  }
}

// Test 4: Check required files
function testRequiredFiles() {
  console.log('\n📁 Test 4: Required Files Check');
  
  const requiredFiles = [
    '../src/OnboardingScreen.js',
    '../index.js',
    '../package.json',
    '../README.md',
    '../index.d.ts'
  ];
  
  let allFilesExist = true;
  
  requiredFiles.forEach(file => {
    const filePath = path.join(__dirname, file);
    if (fs.existsSync(filePath)) {
      console.log(`✅ ${file}`);
    } else {
      console.log(`❌ ${file} - Missing`);
      allFilesExist = false;
    }
  });
  
  return allFilesExist;
}

// Test 5: Validate package.json
function testPackageJson() {
  console.log('\n📦 Test 5: Package.json Validation');
  
  try {
    const packagePath = path.join(__dirname, '../package.json');
    const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
    
    const requiredFields = ['name', 'version', 'main', 'peerDependencies'];
    requiredFields.forEach(field => {
      if (!packageJson[field]) {
        throw new Error(`Missing required field: ${field}`);
      }
    });
    
    console.log('✅ Package.json has all required fields');
    console.log(`✅ Package name: ${packageJson.name}`);
    console.log(`✅ Version: ${packageJson.version}`);
    
    return true;
  } catch (error) {
    console.log(`❌ Package.json validation failed: ${error.message}`);
    return false;
  }
}

// Run all tests
function runAllTests() {
  const tests = [
    testConfigFile,
    testScreenTypes,
    testNavigationTargets,
    testRequiredFiles,
    testPackageJson
  ];
  
  let passedTests = 0;
  let totalTests = tests.length;
  
  tests.forEach(test => {
    if (test()) {
      passedTests++;
    }
  });
  
  console.log('\n' + '='.repeat(50));
  console.log(`📊 Test Results: ${passedTests}/${totalTests} tests passed`);
  
  if (passedTests === totalTests) {
    console.log('🎉 All tests passed! Your SDK is ready to use.');
  } else {
    console.log('⚠️  Some tests failed. Please fix the issues above.');
  }
  
  console.log('\n📝 Next Steps:');
  console.log('1. Run the test app in your React Native environment');
  console.log('2. Test file upload functionality');
  console.log('3. Verify data collection in console logs');
  console.log('4. Test with different configurations');
}

// Run tests
runAllTests();
