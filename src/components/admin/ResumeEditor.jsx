import { useState } from 'react';
import { ArrowUpRight, FileText, LoaderCircle, Save } from 'lucide-react';
import { resumeUrlError } from '../../utils/resume';
import { cleanPlaceholder } from '../../utils/admin-content';
import { isWebUrl, publicAsset } from '../../utils/content';
import AdminField from './AdminField';
import useAdminSave from './useAdminSave';

export default function ResumeEditor({ content, save }) {
  const [resume, setResume] = useState(cleanPlaceholder(content.profile.resume));
  const state = useAdminSave(save, 'resume');
  const savedResume = cleanPlaceholder(content.profile.resume);
  const canOpen = isWebUrl(savedResume) || publicAsset(savedResume);
  async function submit(event) {
    event.preventDefault();
    const error = resumeUrlError(resume);
    if (state.validate(error ? { resume: error } : {}, event.currentTarget))
      await state.submit({ resume }, event.currentTarget);
  }
  return (
    <div className="admin-layout">
      <div className="admin-editor">
        <h2>Update your resume</h2>
        <p>Paste a public link to your latest PDF.</p>
        <form onSubmit={submit} noValidate aria-label="Resume settings" aria-busy={state.busy}>
          <AdminField
            name="resume"
            label="Resume PDF URL"
            value={resume}
            type="url"
            maxLength={2048}
            onChange={(_, value) => {
              setResume(value);
              state.edited();
            }}
            error={state.errors.resume}
            hint="Use a public HTTPS link that opens without signing in. Leave blank to hide the resume button."
            disabled={state.busy}
          />
          <div className="admin-actions">
            {resume !== savedResume && <span className="admin-unsaved">Unsaved changes</span>}
            <button className="button" type="submit" disabled={state.busy}>
              {state.busy ? (
                <LoaderCircle className="spin" size={18} aria-hidden="true" />
              ) : (
                <Save size={18} aria-hidden="true" />
              )}
              {state.busy ? 'Saving…' : 'Save resume link'}
            </button>
          </div>
          {state.error && (
            <p className="field-error" role="alert">
              {state.error}
            </p>
          )}
          <p className="form-feedback" role="status">
            {state.saved &&
              (savedResume
                ? 'Resume saved to your portfolio.'
                : 'Saved. The resume button is now hidden.')}
          </p>
        </form>
      </div>
      <aside className="admin-preview" aria-labelledby="resume-preview-title">
        <FileText size={28} aria-hidden="true" />
        <h2 id="resume-preview-title">Current resume</h2>
        <p>
          {canOpen
            ? 'This is the document your portfolio button opens.'
            : 'No resume is linked yet.'}
        </p>
        {canOpen && (
          <>
            <a
              href={savedResume}
              target="_blank"
              rel="noopener noreferrer"
              className="button button-outline"
            >
              View resume <ArrowUpRight size={16} aria-hidden="true" />
            </a>
            <p className="admin-saved-url">{savedResume}</p>
          </>
        )}
      </aside>
    </div>
  );
}
