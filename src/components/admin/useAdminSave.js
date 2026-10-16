import { useRef, useState } from 'react';

export default function useAdminSave(save, endpoint, onSaved) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [errors, setErrors] = useState({});
  const [saved, setSaved] = useState(false);
  const pending = useRef(false);
  function focusFirst(fields, form) {
    const field = form?.elements.namedItem(Object.keys(fields)[0]);
    const element = field instanceof Element ? field : field?.[0];
    if (element) {
      element.closest('details')?.setAttribute('open', '');
      element.focus();
    }
  }
  function validate(fields, form) {
    setErrors(fields);
    setError('');
    setSaved(false);
    const first = Object.keys(fields)[0];
    if (first) focusFirst(fields, form);
    return !first;
  }
  async function submit(payload, form) {
    if (pending.current) return;
    pending.current = true;
    setBusy(true);
    setError('');
    setSaved(false);
    try {
      const content = await save(endpoint, payload);
      onSaved?.(content);
      setErrors({});
      setSaved(true);
      return content;
    } catch (failure) {
      setError(failure.message);
      setErrors(failure.fields || {});
      if (failure.fields) focusFirst(failure.fields, form);
    } finally {
      pending.current = false;
      setBusy(false);
    }
  }
  return {
    busy,
    error,
    errors,
    saved,
    validate,
    submit,
    edited: () => {
      setSaved(false);
      setErrors({});
      setError('');
    },
  };
}
