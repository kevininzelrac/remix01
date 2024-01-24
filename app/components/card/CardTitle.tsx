export type CardTitleProps = React.HTMLAttributes<HTMLDivElement>;

export function CardTitle({ className, ...props }: CardTitleProps) {
  return (
    <div
      {...props}
      className={`text-2xl font-semibold whitespace-nowrap leading-none tracking-tigh ${className}`}
    />
  );
}
