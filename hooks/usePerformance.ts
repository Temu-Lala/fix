import { useCallback, useMemo } from 'react';
import { Platform, InteractionManager } from 'react-native';

export const usePerformance = () => {
  const runAfterInteractions = useCallback((callback: () => void) => {
    if (Platform.OS === 'android') {
      InteractionManager.runAfterInteractions(callback);
    } else {
      callback();
    }
  }, []);

  const optimizedCallback = useCallback((callback: () => void) => {
    return () => {
      runAfterInteractions(callback);
    };
  }, [runAfterInteractions]);

  const memoizedValue = useMemo(() => ({
    isAndroid: Platform.OS === 'android',
    isIOS: Platform.OS === 'ios',
    shouldOptimize: Platform.OS === 'android',
  }), []);

  return {
    runAfterInteractions,
    optimizedCallback,
    ...memoizedValue,
  };
};