import React from 'react';
import { StatusBar } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { CameraScreen } from './src/screens/CameraScreen';
import { ModelProvider } from './src/context/ModelContext';
import { useFungiStore } from './src/store/useFungiStore';

import { HomeScreen } from './src/screens/HomeScreen';
import { LibraryScreen } from './src/screens/LibraryScreen';
import { SettingsScreen } from './src/screens/SettingsScreen';
import { DonationScreen } from './src/screens/DonationScreen';
import { ResultsScreen } from './src/screens/ResultsScreen';

import { BackHandler } from 'react-native';

function AppContent() {
  const { currentScreen, setCurrentScreen, isDarkMode } = useFungiStore();

  React.useEffect(() => {
    const backAction = () => {
      if (currentScreen === 'home') {
        return false; // Exit app
      }

      // Navigation logic
      switch (currentScreen) {
        case 'results':
          setCurrentScreen('camera');
          break;
        default:
          setCurrentScreen('home');
          break;
      }
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );

    return () => backHandler.remove();
  }, [currentScreen, setCurrentScreen]);

  const backgroundStyle = {
    backgroundColor: isDarkMode ? '#0c120e' : '#f0f2f0',
    flex: 1,
  };

  return (
    <SafeAreaView style={backgroundStyle} edges={['left', 'right']}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor="transparent"
        translucent
      />
      {currentScreen === 'home' && <HomeScreen />}
      {currentScreen === 'camera' && <CameraScreen />}
      {currentScreen === 'library' && <LibraryScreen />}
      {currentScreen === 'settings' && <SettingsScreen />}
      {currentScreen === 'donation' && <DonationScreen />}
      {currentScreen === 'results' && <ResultsScreen />}
    </SafeAreaView>
  );
}

function App(): React.JSX.Element {
  return (
    <SafeAreaProvider>
      <ModelProvider>
        <AppContent />
      </ModelProvider>
    </SafeAreaProvider>
  );
}

export default App;
