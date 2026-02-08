import { Ref } from 'react';
import { TextInput, type TextInputProps } from 'react-native';

type FocusableInput = Ref<TextInput> | undefined;

export type ThemedTextInputProps = TextInputProps & {
  ref?: FocusableInput
};

export function Ti({
  className,
  placeholderTextColor,
  ...rest
}: ThemedTextInputProps) {

  return (
    <TextInput
      ref={rest?.ref}
      className={`text-black text-[14px] bg-transparent ${className}`}
      placeholderTextColor={placeholderTextColor || '#94A3B8'}
      {...rest}
    />
  );
}

