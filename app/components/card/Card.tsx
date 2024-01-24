export type CardProps = React.HTMLAttributes<HTMLDivElement>;

export function Card({ className, ...props }: CardProps) {
  return (
    <div
      {...props}
      className={`rounded-lg border bg-card text-card-foreground shadow-sm ${className}`}
      data-v0-t="card"
    />
  );
}
