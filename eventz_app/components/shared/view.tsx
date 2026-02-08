import { useThemeColor } from '@/hooks/use-theme-color';
import { View, type ViewProps } from 'react-native';

export type ThemedViewProps = ViewProps & Partial<{ ref: React.Ref<View> | undefined }> & {
  lightColor?: string;
  darkColor?: string;
  themed?: boolean
};

export function Tv({ style, className, lightColor, darkColor, themed = false, ...otherProps }: ThemedViewProps) {
  const backgroundColor = useThemeColor({ light: lightColor, dark: darkColor }, 'background');

  return <View style={[themed ? { backgroundColor } : {}, style]} className={`${className}`} {...otherProps} />;
}
