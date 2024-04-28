import { Slot } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

// Import Providers
import { ThemeProvider } from '../styles/themeContext';
import { RunProvider } from '../context/runContext';
import { ModalProvider } from '../context/modalContext';

export default function HomeLayout() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <RunProvider>
          <ModalProvider>
            <SafeAreaView
              style={{
                flex: 1,
                position: 'relative',
                backgroundColor: '#272231',
              }}
            >
              <Slot />
              <StatusBar style='light' />
            </SafeAreaView>
          </ModalProvider>
        </RunProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
