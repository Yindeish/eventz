import { TouchableOpacity, type TouchableOpacityProps } from 'react-native';

export type ThemedTouchableOpacityProps = TouchableOpacityProps

export function To({ className,...otherProps }: ThemedTouchableOpacityProps) {

  return <TouchableOpacity className={`bg-transparent ${className}`} {...otherProps} />;
}
