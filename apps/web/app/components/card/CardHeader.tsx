export type CardHeaderProps = React.HTMLAttributes<HTMLDivElement>;

export function CardHeader({ className, ...props }: CardHeaderProps) {
  return (
    <div
      {...props}
      className={`flex flex-col space-y-1.5 p-6 ${className}`}
      data-v0-t="card"
    />
  );
}
