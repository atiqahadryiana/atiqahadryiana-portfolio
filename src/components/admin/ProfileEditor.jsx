import { useState } from 'react';
import { cleanPlaceholder, profileFields, validateProfile } from '../../utils/admin-content';
import AdminField from './AdminField';
import useAdminSave from './useAdminSave';

export default function ProfileEditor({ content, save }) {
  const [draft, setDraft] = useState(() => ({
    ...Object.fromEntries(
      profileFields.map((key) => [key, cleanPlaceholder(content.profile[key])]),
    ),
    github: content.profile.socials.find((item) => item.label === 'GitHub')?.url || '',
    linkedin: content.profile.socials.find((item) => item.label === 'LinkedIn')?.url || '',
    about: content.profile.about.join('\n\n'),
  }));
  const state = useAdminSave(save, 'profile');
  function change(key, value) {
    setDraft({ ...draft, [key]: value });
    state.edited();
  }
  async function submit(event) {
    event.preventDefault();
    const profile = {
      ...draft,
      about: draft.about
        .split(/\n\s*\n/)
        .map((value) => value.trim())
        .filter(Boolean),
    };
    if (state.validate(validateProfile(profile), event.currentTarget))
      await state.submit({ profile }, event.currentTarget);
  }
  const labels = {
    name: 'Full name',
    location: 'Location',
    identity: 'Short identity',
    headline: 'Headline',
    introduction: 'Introduction',
    email: 'Public email',
    github: 'GitHub URL',
    linkedin: 'LinkedIn URL',
  };
  return (
    <div className="admin-editor">
      <h2>Your portfolio details</h2>
      <p>Keep your introduction and public contact links current.</p>
      <form onSubmit={submit} noValidate aria-label="Profile settings" aria-busy={state.busy}>
        <fieldset disabled={state.busy} className="admin-fieldset">
          <div className="form-row">
            {profileFields
              .filter((key) => !['introduction', 'headline'].includes(key))
              .map((key) => (
                <AdminField
                  scope="profile"
                  key={key}
                  name={key}
                  label={labels[key]}
                  value={draft[key]}
                  onChange={change}
                  error={state.errors[key]}
                  type={
                    key === 'email'
                      ? 'email'
                      : key === 'github' || key === 'linkedin'
                        ? 'url'
                        : 'text'
                  }
                  maxLength={300}
                />
              ))}
          </div>
          <AdminField
            name="headline"
            label="Headline"
            value={draft.headline}
            onChange={change}
            error={state.errors.headline}
            maxLength={300}
          />
          <AdminField
            name="introduction"
            label="Introduction"
            value={draft.introduction}
            onChange={change}
            error={state.errors.introduction}
            multiline
            maxLength={2000}
          />
          <AdminField
            name="about"
            label="About you"
            value={draft.about}
            onChange={change}
            error={state.errors.about}
            multiline
            hint="Separate paragraphs with a blank line."
            maxLength={48000}
          />
        </fieldset>
        <div className="admin-actions">
          <button className="button" type="submit" disabled={state.busy}>
            {state.busy ? 'Saving…' : 'Save profile'}
          </button>
        </div>
        {state.error && (
          <p className="field-error" role="alert">
            {state.error}
          </p>
        )}
        <p className="form-feedback" role="status">
          {state.saved && 'Profile saved to your portfolio.'}
        </p>
      </form>
    </div>
  );
}
