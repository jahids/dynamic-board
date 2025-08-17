// Test file for onboarding functionality
// This file can be used to test the onboarding flow

const testConfig = {
  screens: [
    {
      id: "test_screen1",
      type: "text",
      content: {
        title: "Test Screen 1",
        subtitle: "This is a test screen",
        color: "#333333",
        background: "#ffffff",
        fontSize: "xl"
      },
      actions: [
        {
          type: "button",
          label: "Next",
          color: "#ffffff",
          background: "#007AFF",
          target: "test_screen2"
        }
      ]
    },
    {
      id: "test_screen2",
      type: "fileUpload",
      content: {
        title: "Test File Upload",
        subtitle: "Upload a test file",
        color: "#333333",
        background: "#f8f9fa"
      },
      actions: [
        {
          type: "button",
          label: "Finish Test",
          color: "#ffffff",
          background: "#28a745",
          target: "end"
        }
      ]
    }
  ]
};

// Mock collected data structure
const mockCollectedData = {
  test_screen1: {
    screenId: "test_screen1",
    actionClicked: "Next",
    timestamp: "2024-01-01T12:00:00.000Z"
  },
  test_screen2: {
    screenId: "test_screen2",
    actionClicked: "Finish Test",
    fileUploaded: "test_file.jpg",
    timestamp: "2024-01-01T12:01:00.000Z"
  }
};

console.log('Test configuration:', JSON.stringify(testConfig, null, 2));
console.log('Mock collected data:', JSON.stringify(mockCollectedData, null, 2));

// Export for testing
module.exports = {
  testConfig,
  mockCollectedData
};
