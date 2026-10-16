import { useRef, useState } from 'react';
import { ArrowUpRight, LoaderCircle, Mail } from 'lucide-react';
import { profile } from '../data/portfolio';
import { isEmail, isFormEndpoint } from '../utils/content';

export function validateContact(values) {
  const errors = {};
  if (!values.name.trim()) errors.name = 'Please enter your name.';
  if (!isEmail(values.email.trim())) errors.email = 'Please enter a valid email address.';
  if (!values.subject.trim()) errors.subject = 'Please add a subject.';
  if (values.message.trim().length < 10) errors.message = 'Please write at least 10 characters.';
  return errors;
}

export default function ContactForm({
  endpoint = import.meta.env.VITE_FORMSPREE_ENDPOINT,
  email = profile.email,
}) {
  const [values, setValues] = useState({ name: '', email: '', subject: '', message: '' });
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState('idle');
  const form = useRef(null);
  const canSend = isFormEndpoint(endpoint);
  const canEmail = isEmail(email);
  const configured = canSend || canEmail;
  async function submit(event) {
    event.preventDefault();
    if (!configured || status === 'sending') return;
    const validation = validateContact(values);
    setErrors(validation);
    setStatus('idle');
    if (Object.keys(validation).length) {
      form.current.elements.namedItem(Object.keys(validation)[0])?.focus();
      return;
    }
    const data = Object.fromEntries(
      Object.entries(values).map(([key, value]) => [key, value.trim()]),
    );
    if (!canSend) {
      window.location.href = `mailto:${encodeURIComponent(email)}?subject=${encodeURIComponent(data.subject)}&body=${encodeURIComponent(`From: ${data.name} <${data.email}>\n\n${data.message}`)}`;
      setStatus('email');
      return;
    }
    setStatus('sending');
    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(data),
        signal: AbortSignal.timeout(20000),
      });
      if (!response.ok) throw new Error('Service rejected the request');
      setStatus('success');
      setValues({ name: '', email: '', subject: '', message: '' });
    } catch {
      setStatus('error');
    }
  }
  return (
    <form
      ref={form}
      className="contact-form"
      noValidate
      onSubmit={submit}
      aria-label="Contact form"
      aria-describedby="contact-notice"
      aria-busy={status === 'sending'}
    >
      <div className="form-row">
        {['name', 'email'].map((field) => (
          <div className="field" key={field}>
            <label htmlFor={`contact-${field}`}>
              {field === 'name' ? 'Your name' : 'Email address'}
            </label>
            <input
              id={`contact-${field}`}
              name={field}
              type={field === 'email' ? 'email' : 'text'}
              autoComplete={field}
              disabled={status === 'sending'}
              maxLength={field === 'email' ? 254 : 100}
              required
              value={values[field]}
              onChange={(event) => setValues({ ...values, [field]: event.target.value })}
              placeholder={field === 'name' ? 'How should I call you?' : 'you@example.com'}
              aria-invalid={Boolean(errors[field])}
              aria-describedby={errors[field] ? `${field}-error` : undefined}
            />
            <span id={`${field}-error`} className="field-error">
              {errors[field]}
            </span>
          </div>
        ))}
      </div>
      {['subject', 'message'].map((field) => (
        <div className="field" key={field}>
          <label htmlFor={`contact-${field}`}>
            {field === 'subject' ? 'Subject' : 'Your message'}
          </label>
          {field === 'message' ? (
            <textarea
              id="contact-message"
              name="message"
              disabled={status === 'sending'}
              onKeyDown={(event) => {
                if ((event.ctrlKey || event.metaKey) && event.key === 'Enter') {
                  event.preventDefault();
                  form.current.requestSubmit();
                }
              }}
              rows={5}
              maxLength={5000}
              required
              value={values.message}
              onChange={(event) => setValues({ ...values, message: event.target.value })}
              placeholder="Tell me a little about your idea…"
              aria-invalid={Boolean(errors.message)}
              aria-describedby={errors.message ? 'message-error' : undefined}
            />
          ) : (
            <input
              id="contact-subject"
              name="subject"
              disabled={status === 'sending'}
              maxLength={200}
              required
              value={values.subject}
              onChange={(event) => setValues({ ...values, subject: event.target.value })}
              placeholder="What’s on your mind?"
              aria-invalid={Boolean(errors.subject)}
              aria-describedby={errors.subject ? 'subject-error' : undefined}
            />
          )}
          <span id={`${field}-error`} className="field-error">
            {errors[field]}
          </span>
        </div>
      ))}
      <p id="contact-notice" className="form-notice">
        {canSend
          ? 'Your message is sent securely through Formspree. Your details are used to reply.'
          : canEmail
            ? 'This opens your email app with a draft. Review and send it there.'
            : 'Contact details are being prepared. Sending is unavailable until an email address or form endpoint is configured.'}
      </p>
      <button className="button" type="submit" disabled={!configured || status === 'sending'}>
        {status === 'sending' ? (
          <>
            <LoaderCircle className="spin" size={18} aria-hidden="true" /> Sending…
          </>
        ) : canSend ? (
          <>
            Send message <ArrowUpRight size={18} aria-hidden="true" />
          </>
        ) : (
          <>
            <Mail size={18} aria-hidden="true" /> Open email app
          </>
        )}
      </button>
      <div
        className={`form-feedback ${status === 'error' ? 'field-error' : ''}`}
        role="status"
        aria-live="polite"
      >
        {status === 'success' &&
          'Your message was accepted by the contact service. Thank you for reaching out.'}
        {status === 'error' &&
          'Your message could not be sent. Please try again; your draft is still here.'}
        {status === 'email' &&
          'Email draft requested. If your email app opened, send the message there.'}
      </div>
    </form>
  );
}
