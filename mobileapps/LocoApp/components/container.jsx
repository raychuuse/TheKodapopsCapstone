import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../styles/themeContext';

const Container = ({ children, style }) => {
  const { theme, toggleTheme } = useTheme();
  return (
    <LinearGradient
      colors={theme.containerGradient}
      style={[
        {
          borderRadius: 16,
          flexDirection: 'column',
          paddingHorizontal: 12,
          paddingVertical: 8,
        },
        style,
      ]}
    >
      {children}
    </LinearGradient>
  );
};

export default Container;
