import { SafeAreaView, type SafeAreaViewProps } from 'react-native-safe-area-context';

export type ThemedSafeViewProps = SafeAreaViewProps

export function Sav({ className, ...otherProps }: ThemedSafeViewProps) {

  return <SafeAreaView className={`relative bg-transparent ${className}`} {...otherProps} />;
}
