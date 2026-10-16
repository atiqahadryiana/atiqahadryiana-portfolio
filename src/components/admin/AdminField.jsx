export default function AdminField({
  name,
  label,
  value,
  onChange,
  error,
  multiline = false,
  hint,
  scope = 'admin',
  ...props
}) {
  const id = `${scope}-${name}`;
  const Input = multiline ? 'textarea' : 'input';
  return (
    <div className="field">
      <label htmlFor={id}>{label}</label>
      <Input
        id={id}
        name={name}
        value={value}
        onChange={(event) => onChange(name, event.target.value)}
        aria-invalid={Boolean(error)}
        aria-describedby={
          [hint && `${id}-hint`, error && `${id}-error`].filter(Boolean).join(' ') || undefined
        }
        {...(multiline ? { rows: 4 } : { type: 'text' })}
        {...props}
      />
      {hint && (
        <p id={`${id}-hint`} className="admin-help">
          {hint}
        </p>
      )}
      {error && (
        <p id={`${id}-error`} className="field-error">
          {error}
        </p>
      )}
    </div>
  );
}
