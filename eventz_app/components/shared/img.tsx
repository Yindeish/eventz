import { Image, type ImageProps } from 'react-native';

export type ThemedImageProps = ImageProps;

export function Img({ ...otherProps }: ThemedImageProps) {

  return <Image {...otherProps} />;
}
