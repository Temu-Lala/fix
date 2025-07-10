import { Platform } from 'react-native';

export const PerformanceConfig = {
  // FlatList optimizations
  flatList: {
    removeClippedSubviews: Platform.OS === 'android',
    maxToRenderPerBatch: Platform.OS === 'android' ? 10 : 15,
    windowSize: Platform.OS === 'android' ? 10 : 21,
    initialNumToRender: Platform.OS === 'android' ? 5 : 10,
    updateCellsBatchingPeriod: 50,
    scrollEventThrottle: 16,
  },
  
  // Image optimizations
  image: {
    cachePolicy: 'memory-disk' as const,
    transition: Platform.OS === 'android' ? 200 : 300,
    placeholder: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==',
  },
  
  // Animation optimizations
  animation: {
    useNativeDriver: true,
    duration: Platform.OS === 'android' ? 200 : 300,
  },
  
  // Memory management
  memory: {
    enableHermes: true,
    enableFabric: Platform.OS === 'android',
    enableTurboModules: true,
  },
};

export const AndroidOptimizations = {
  // Reduce overdraw
  backgroundColor: 'transparent',
  
  // Optimize touch handling
  activeOpacity: 0.7,
  
  // Reduce layout calculations
  collapsable: false,
  
  // Optimize text rendering
  allowFontScaling: false,
  
  // Reduce memory usage
  removeClippedSubviews: true,
};