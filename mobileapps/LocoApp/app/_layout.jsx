import { Slot } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { ThemeProvider } from '../styles/themeContext';
import { RunProvider } from '../context/runContext';

export default function HomeLayout() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <RunProvider>
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
        </RunProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
