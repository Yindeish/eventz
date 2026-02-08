import { ScrollView, type ScrollViewProps } from 'react-native';

export type ThemedScrollViewProps = ScrollViewProps

export function Ts({ className, ...otherProps }: ThemedScrollViewProps) {

  return <ScrollView
    showsVerticalScrollIndicator={false}
    showsHorizontalScrollIndicator={false}
    className={`bg-transparent ${className}`} {...otherProps} />;
}
