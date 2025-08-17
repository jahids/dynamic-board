import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import OnboardingScreen from '../src/OnboardingScreen';

export default function TestApp() {
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [testResults, setTestResults] = useState([]);

  const handleOnboardingComplete = (collectedData) => {
    console.log('🎉 Onboarding Complete! Collected Data:', JSON.stringify(collectedData, null, 2));
    
    // Add test result
    setTestResults(prev => [...prev, {
      timestamp: new Date().toISOString(),
      data: collectedData,
      success: true
    }]);
    
    setShowOnboarding(false);
  };

  const runTest = (testName, configUrl = null) => {
    console.log(`🧪 Running test: ${testName}`);
    setTestResults(prev => [...prev, {
      timestamp: new Date().toISOString(),
      testName,
      status: 'started'
    }]);
    setShowOnboarding(true);
  };

  const clearResults = () => {
    setTestResults([]);
  };

  if (showOnboarding) {
    return (
      <OnboardingScreen 
        configUrl={null} // Use local config
        onComplete={handleOnboardingComplete}
      />
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🧪 Onboarding SDK Test Suite</Text>
      
      <ScrollView style={styles.testContainer}>
        <Text style={styles.sectionTitle}>Test Cases:</Text>
        
        <TouchableOpacity 
          style={styles.testButton}
          onPress={() => runTest('Local JSON Config Test')}
        >
          <Text style={styles.buttonText}>📱 Test Local Config</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.testButton}
          onPress={() => runTest('Remote Config Test', 'https://jsonplaceholder.typicode.com/todos')}
        >
          <Text style={styles.buttonText}>🌐 Test Remote Config</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.testButton}
          onPress={() => runTest('Invalid URL Test', 'https://invalid-url-test.com')}
        >
          <Text style={styles.buttonText}>❌ Test Error Handling</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.clearButton}
          onPress={clearResults}
        >
          <Text style={styles.clearButtonText}>🗑️ Clear Results</Text>
        </TouchableOpacity>

        <Text style={styles.sectionTitle}>Test Results:</Text>
        
        {testResults.length === 0 ? (
          <Text style={styles.noResults}>No test results yet. Run a test above!</Text>
        ) : (
          testResults.map((result, index) => (
            <View key={index} style={styles.resultItem}>
              <Text style={styles.resultTitle}>
                {result.testName || 'Onboarding Complete'}
              </Text>
              <Text style={styles.resultTime}>
                {new Date(result.timestamp).toLocaleTimeString()}
              </Text>
              {result.success && (
                <Text style={styles.successText}>✅ Success</Text>
              )}
              {result.status === 'started' && (
                <Text style={styles.pendingText}>⏳ In Progress...</Text>
              )}
            </View>
          ))
        )}
      </ScrollView>

      <View style={styles.footer}>
        <Text style={styles.footerText}>
          Check console for detailed data collection logs
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    paddingTop: 60,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#333',
  },
  testContainer: {
    flex: 1,
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 20,
    marginBottom: 10,
    color: '#333',
  },
  testButton: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  clearButton: {
    backgroundColor: '#FF3B30',
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
    alignItems: 'center',
  },
  clearButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  resultItem: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  resultTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 5,
  },
  resultTime: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  successText: {
    fontSize: 14,
    color: '#28a745',
    fontWeight: '600',
  },
  pendingText: {
    fontSize: 14,
    color: '#FF9500',
    fontWeight: '600',
  },
  noResults: {
    textAlign: 'center',
    color: '#666',
    fontStyle: 'italic',
    marginTop: 20,
  },
  footer: {
    padding: 20,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  footerText: {
    textAlign: 'center',
    color: '#666',
    fontSize: 14,
  },
});
