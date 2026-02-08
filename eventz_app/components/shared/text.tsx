import { useThemeColor } from '@/hooks/use-theme-color';
import { Text, type TextProps } from 'react-native';

export type ThemedTextProps = TextProps & {
  lightColor?: string;
  darkColor?: string;
  themed?: boolean
}

export function Tt({
  style,
  className,
  lightColor,
  darkColor,
  themed = false,
  ...rest
}: ThemedTextProps) {
  const color = useThemeColor({ light: lightColor, dark: darkColor }, 'text');


  return (
    <Text
      style={[
        style,
        themed ? { color } : {}
      ]}
      // className={`bg-transparent ${className}`}
      className={`${className}`}
      {...rest}
    />
  );
}
