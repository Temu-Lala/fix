import { useSettingsStore } from '@/store/settingsStore';
import Colors from '@/constants/colors';

export const useTheme = () => {
  const theme = useSettingsStore((state) => state.theme);
  
  const themeColors = theme === 'dark' ? Colors.dark : Colors.light;
  const colors = {
    ...themeColors,
    ...Colors.common,
  };
  
  return {
    colors,
    theme,
    isDark: theme === 'dark',
  };
};