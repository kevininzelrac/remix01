export type CardDescriptionProps = React.HTMLAttributes<HTMLDivElement>;

export function CardDescription({ className, ...props }: CardDescriptionProps) {
  return (
    <div {...props} className={`text-sm text-muted-foreground ${className}`} />
  );
}
