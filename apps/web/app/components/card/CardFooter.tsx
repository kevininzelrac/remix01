export type CardFooterProps = React.HTMLAttributes<HTMLDivElement>;

export function CardFooter({ className, ...props }: CardFooterProps) {
  return <div {...props} className={`flex items-center p-6 ${className}`} />;
}
