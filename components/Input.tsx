import React from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ViewStyle,
  TextStyle,
  TextInputProps,
} from 'react-native';
import { useTheme } from '@/hooks/useTheme';
import Theme from '@/constants/theme';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  containerStyle?: ViewStyle;
  inputStyle?: TextStyle;
  labelStyle?: TextStyle;
}

export default function Input({
  label,
  error,
  leftIcon,
  rightIcon,
  containerStyle,
  inputStyle,
  labelStyle,
  ...props
}: InputProps) {
  const { colors } = useTheme();

  return (
    <View style={[styles.container, containerStyle]}>
      {label && (
        <Text style={[styles.label, { color: colors.text }, labelStyle]}>
          {label}
        </Text>
      )}
      <View style={[
        styles.inputContainer,
        { 
          backgroundColor: colors.card,
          borderColor: error ? colors.error : colors.border,
        }
      ]}>
        {leftIcon && <View style={styles.leftIcon}>{leftIcon}</View>}
        <TextInput
          style={[
            styles.input,
            { color: colors.text },
            inputStyle,
          ]}
          placeholderTextColor={colors.textSecondary}
          {...props}
        />
        {rightIcon && <View style={styles.rightIcon}>{rightIcon}</View>}
      </View>
      {error && (
        <Text style={[styles.error, { color: colors.error }]}>
          {error}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: Theme.spacing.m,
  },
  label: {
    fontSize: Theme.fontSize.s,
    fontWeight: Theme.fontWeight.medium,
    marginBottom: Theme.spacing.s,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: Theme.borderRadius.m,
    paddingHorizontal: Theme.spacing.m,
  },
  input: {
    flex: 1,
    paddingVertical: Theme.spacing.m,
    fontSize: Theme.fontSize.m,
  },
  leftIcon: {
    marginRight: Theme.spacing.s,
  },
  rightIcon: {
    marginLeft: Theme.spacing.s,
  },
  error: {
    fontSize: Theme.fontSize.s,
    marginTop: Theme.spacing.xs,
  },
});