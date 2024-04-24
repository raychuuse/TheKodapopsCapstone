import { Slot } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { ThemeProvider } from '../styles/themeContext';

export default function HomeLayout() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
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
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
