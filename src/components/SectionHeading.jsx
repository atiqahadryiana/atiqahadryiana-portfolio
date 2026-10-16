export default function SectionHeading({ number, label, title, accent, description, children }) {
  return (
    <div className="section-heading">
      <div>
        {label && (
          <p className="section-kicker">
            {number && (
              <span className="section-number" aria-hidden="true">
                {number}
              </span>
            )}
            {label}
          </p>
        )}
        <h2>
          {title}
          {accent && (
            <>
              {' '}
              <span className="accent">{accent}</span>
            </>
          )}
        </h2>
        {description && <p>{description}</p>}
      </div>
      {children}
    </div>
  );
}
