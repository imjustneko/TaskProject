interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
}

export function Card({ children, className = "", style, ...props }: CardProps) {
  return (
    <div className={`card${className ? " " + className : ""}`} style={style} {...props}>
      {children}
    </div>
  );
}
