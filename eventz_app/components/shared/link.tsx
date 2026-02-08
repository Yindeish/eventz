import { Link, type LinkProps } from 'expo-router';

export type ThemedLinkProps = LinkProps

export function Li({
  className,
  ...rest
}: ThemedLinkProps) {

  return (
    <Link
      className={className}
      {...rest}
    />
  );
}

