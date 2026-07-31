export default function Card({ children, className = "", onClick, ...props }) {
  const interactive = typeof onClick === "function";
  const handleKeyDown = (event) => {
    if (!interactive) return;
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      onClick(event);
    }
  };
  return <div
    className={`card ${interactive ? "card-interactive" : ""} ${className}`.trim()}
    onClick={onClick}
    onKeyDown={handleKeyDown}
    role={interactive ? "button" : undefined}
    tabIndex={interactive ? 0 : undefined}
    {...props}
  >{children}</div>;
}
