import './StatCard.css'

export default function StatCard({ icon, label, value, trend, trendUp, color = 'violet', delay = 0 }) {
  return (
    <div
      className={`stat-card stat-card--${color} animate-fade-in-up`}
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="stat-card__header">
        <div className={`stat-card__icon stat-card__icon--${color}`}>{icon}</div>
        {trend !== undefined && (
          <div className={`stat-card__trend ${trendUp ? 'stat-card__trend--up' : 'stat-card__trend--down'}`}>
            {trendUp ? '↑' : '↓'} {trend}
          </div>
        )}
      </div>
      <div className="stat-card__value">{value}</div>
      <div className="stat-card__label">{label}</div>
    </div>
  )
}
