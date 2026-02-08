import { Pressable, type PressableProps } from 'react-native';

export type ThemedPresableProps = PressableProps;

export function Pr({ style, onPress, animate = true, ...otherProps }: ThemedPresableProps & Partial<{ animate: boolean; }>) {

  return (
    <Pressable
      onPress={onPress}
      className={`bg-transparent ${style}`} {...otherProps} />
  )
    ;
}
