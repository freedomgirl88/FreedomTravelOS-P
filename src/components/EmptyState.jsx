export default function EmptyState({ icon: Icon, title, description, actionLabel, onAction, compact = false }) {
  return <div className={`premium-empty-state ${compact ? "compact" : ""}`} role="status">
    {Icon && <div className="premium-empty-icon"><Icon size={24}/></div>}
    <div className="premium-empty-copy"><strong>{title}</strong><p>{description}</p></div>
    {actionLabel && onAction && <button className="premium-empty-action" onClick={onAction}>{actionLabel}</button>}
  </div>;
}
