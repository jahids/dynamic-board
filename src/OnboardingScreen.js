import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  Dimensions,
} from 'react-native';
import * as DocumentPicker from 'expo-document-picker';

// Import local JSON config
const onboardingConfig = require('../assets/config/fakeDB.json');

export const OnboardingScreen = ({ 
  configUrl = null, // Optional: can still use remote config
  onComplete = null // Callback when onboarding is complete
}) => {
  const [currentScreenIndex, setCurrentScreenIndex] = useState(0);
  const [config, setConfig] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [collectedData, setCollectedData] = useState({});
  const [uploadedFile, setUploadedFile] = useState(null);

  useEffect(() => {
    loadConfig();
  }, [configUrl]);

  const loadConfig = async () => {
    try {
      setLoading(true);
      
      if (configUrl) {
        // Load from remote URL if provided
        const response = await fetch(configUrl);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const remoteConfig = await response.json();
        setConfig(remoteConfig);
      } else {
        // Use local config
        setConfig(onboardingConfig);
      }
      
      setLoading(false);
    } catch (err) {
      console.error('Error loading onboarding config:', err);
      setError(err.message);
      setLoading(false);
    }
  };

  const handleAction = (action) => {
    const { target, label } = action;
    
    // Collect data from current screen
    const currentScreen = config.screens[currentScreenIndex];
    const screenData = {
      screenId: currentScreen.id,
      actionClicked: label,
      timestamp: new Date().toISOString(),
    };

    // Add screen-specific data
    if (currentScreen.type === 'fileUpload' && uploadedFile) {
      screenData.fileUploaded = uploadedFile.name;
    }

    // Update collected data
    setCollectedData(prev => ({
      ...prev,
      [currentScreen.id]: screenData
    }));

    if (target === 'end') {
      // Onboarding complete - log all collected data
      const finalData = {
        ...collectedData,
        [currentScreen.id]: screenData
      };
      
      console.log('🎉 Onboarding Complete! Collected Data:', JSON.stringify(finalData, null, 2));
      
      // Call completion callback if provided
      if (onComplete) {
        onComplete(finalData);
      }
      
      Alert.alert(
        'Onboarding Complete!',
        'Check the console for collected data.',
        [{ text: 'OK' }]
      );
    } else {
      // Navigate to next screen
      const nextScreenIndex = config.screens.findIndex(screen => screen.id === target);
      if (nextScreenIndex !== -1) {
        setCurrentScreenIndex(nextScreenIndex);
        setUploadedFile(null); // Reset file upload for next screen
      }
    }
  };

  const handleFileUpload = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: 'image/*',
        copyToCacheDirectory: true,
      });

      if (result.type === 'success') {
        setUploadedFile(result);
        Alert.alert('Success', `File uploaded: ${result.name}`);
      }
    } catch (err) {
      console.error('Error picking document:', err);
      Alert.alert('Error', 'Failed to upload file');
    }
  };

  const renderScreen = (screen) => {
    const { type, content, actions } = screen;

    switch (type) {
      case 'text':
        return (
          <View style={[styles.screenContainer, { backgroundColor: content.background }]}>
            <View style={styles.contentContainer}>
              <Text style={[
                styles.title,
                { color: content.color, fontSize: content.fontSize === 'xl' ? 28 : 24 }
              ]}>
                {content.title}
              </Text>
              {content.subtitle && (
                <Text style={[styles.subtitle, { color: content.color }]}>
                  {content.subtitle}
                </Text>
              )}
            </View>
            <View style={styles.actionsContainer}>
              {actions.map((action, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.button,
                    { backgroundColor: action.background === 'transparent' ? 'transparent' : action.background }
                  ]}
                  onPress={() => handleAction(action)}
                >
                  <Text style={[styles.buttonText, { color: action.color }]}>
                    {action.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        );

      case 'fileUpload':
        return (
          <View style={[styles.screenContainer, { backgroundColor: content.background }]}>
            <View style={styles.contentContainer}>
              <Text style={[styles.title, { color: content.color }]}>
                {content.title}
              </Text>
              {content.subtitle && (
                <Text style={[styles.subtitle, { color: content.color }]}>
                  {content.subtitle}
                </Text>
              )}
              
              <TouchableOpacity
                style={styles.uploadButton}
                onPress={handleFileUpload}
              >
                <Text style={styles.uploadButtonText}>
                  {uploadedFile ? `✓ ${uploadedFile.name}` : '📁 Choose File'}
                </Text>
              </TouchableOpacity>
            </View>
            <View style={styles.actionsContainer}>
              {actions.map((action, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.button,
                    { backgroundColor: action.background === 'transparent' ? 'transparent' : action.background }
                  ]}
                  onPress={() => handleAction(action)}
                >
                  <Text style={[styles.buttonText, { color: action.color }]}>
                    {action.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        );

      case 'banner':
        return (
          <View style={[styles.screenContainer, { backgroundColor: content.background }]}>
            <View style={styles.contentContainer}>
              <Text style={[styles.title, { color: content.color }]}>
                {content.title}
              </Text>
              {content.subtitle && (
                <Text style={[styles.subtitle, { color: content.color }]}>
                  {content.subtitle}
                </Text>
              )}
            </View>
            <View style={styles.actionsContainer}>
              {actions.map((action, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.button,
                    { backgroundColor: action.background === 'transparent' ? 'transparent' : action.background }
                  ]}
                  onPress={() => handleAction(action)}
                >
                  <Text style={[styles.buttonText, { color: action.color }]}>
                    {action.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        );

      default:
        return (
          <View style={styles.screenContainer}>
            <Text style={styles.errorText}>Unknown screen type: {type}</Text>
          </View>
        );
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Loading onboarding...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Error: {error}</Text>
      </View>
    );
  }

  if (!config || !config.screens || config.screens.length === 0) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>No onboarding screens found</Text>
      </View>
    );
  }

  const currentScreen = config.screens[currentScreenIndex];

  return (
    <View style={styles.container}>
      {/* Progress indicator */}
      <View style={styles.progressContainer}>
        <View style={styles.progressBar}>
          <View 
            style={[
              styles.progressFill, 
              { width: `${((currentScreenIndex + 1) / config.screens.length) * 100}%` }
            ]} 
          />
        </View>
        <Text style={styles.progressText}>
          {currentScreenIndex + 1} of {config.screens.length}
        </Text>
      </View>

      {/* Screen content */}
      {renderScreen(currentScreen)}
    </View>
  );
};

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  progressContainer: {
    padding: 20,
    paddingTop: 60,
    backgroundColor: '#fff',
  },
  progressBar: {
    height: 4,
    backgroundColor: '#e0e0e0',
    borderRadius: 2,
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#007AFF',
    borderRadius: 2,
  },
  progressText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  screenContainer: {
    flex: 1,
    justifyContent: 'space-between',
    padding: 20,
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 24,
  },
  uploadButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 20,
  },
  uploadButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  button: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    minWidth: 120,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: '#d32f2f',
    textAlign: 'center',
  },
});
