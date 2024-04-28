import { View } from 'react-native';

// Import Style Components
import { useTheme } from '../styles/themeContext';

const Divider = ({ style }) => {
  const { theme, toggleTheme } = useTheme();
  return (
    <View
      style={[
        {
          height: 1,
          width: '100%',
          backgroundColor: theme.spDiv,
        },
        style,
      ]}
    />
  );
};

export default Divider;
