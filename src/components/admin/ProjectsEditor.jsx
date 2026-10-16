import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, Plus } from 'lucide-react';
import {
  cleanPlaceholder,
  projectStatuses,
  projectTextFields,
  validateProject,
} from '../../utils/admin-content';
import AdminField from './AdminField';
import useAdminSave from './useAdminSave';

function draftOf(project = {}) {
  return {
    ...Object.fromEntries(projectTextFields.map((key) => [key, cleanPlaceholder(project[key])])),
    status: project.status || 'Concept',
    filters: project.filters || [],
    technologies: (project.technologies || []).join(', '),
    features: (project.features || []).join('\n'),
  };
}
const labels = {
  title: 'Project title',
  slug: 'Project URL slug',
  category: 'Project category',
  summary: 'Short description',
  goal: 'Project goal',
  technologyNote: 'Technology note',
  overview: 'Overview',
  problem: 'Problem',
  users: 'Intended users',
  approach: 'Approach',
  role: 'Your role',
  challenges: 'Challenges & lessons',
  outcome: 'Outcome',
  caveat: 'Scope or limitations',
  github: 'Source code URL',
  demo: 'Live demo URL',
  image: 'Project image URL',
};

function ProjectForm({ project, content, save, onSaved, onCancel }) {
  const [draft, setDraft] = useState(() => draftOf(project || {}));
  const state = useAdminSave(save, 'projects', onSaved);
  function change(key, value) {
    setDraft({ ...draft, [key]: value });
    state.edited();
  }
  const field = (name, multiline = false, hint) => (
    <AdminField
      key={name}
      name={name}
      label={labels[name]}
      value={draft[name]}
      onChange={change}
      error={state.errors[name]}
      multiline={multiline}
      maxLength={4000}
      hint={hint}
    />
  );
  async function submit(event) {
    event.preventDefault();
    const entry = {
      ...draft,
      technologies: draft.technologies
        .split(',')
        .map((item) => item.trim())
        .filter(Boolean),
      features: draft.features
        .split('\n')
        .map((item) => item.trim())
        .filter(Boolean),
    };
    if (state.validate(validateProject(entry, content.projectFilters), event.currentTarget))
      await state.submit(
        { project: entry, ...(project ? { originalSlug: project.slug } : {}) },
        event.currentTarget,
      );
  }
  return (
    <div className="admin-editor">
      <div className="admin-panel-heading">
        <h2>{project ? 'Edit project' : 'Add a project'}</h2>
        <button
          className="text-link admin-text-button"
          type="button"
          onClick={onCancel}
          disabled={state.busy}
        >
          Back to projects
        </button>
      </div>
      <form onSubmit={submit} noValidate aria-label="Project editor" aria-busy={state.busy}>
        <fieldset disabled={state.busy} className="admin-fieldset">
          <div className="form-row">
            {field('title')}
            {field(
              'slug',
              false,
              'Lowercase words separated by hyphens. This becomes the project page URL.',
            )}
          </div>
          <div className="form-row">
            {field('category')}
            <div className="field">
              <label htmlFor="project-status">Status</label>
              <select
                id="project-status"
                name="status"
                value={draft.status}
                onChange={(event) => change('status', event.target.value)}
              >
                {projectStatuses.map((value) => (
                  <option key={value}>{value}</option>
                ))}
              </select>
            </div>
          </div>
          {field('summary', true)}
          <fieldset className="admin-category-picker">
            <legend>Show in categories</legend>
            <div>
              {content.projectFilters
                .filter((item) => item !== 'All')
                .map((item) => (
                  <label key={item}>
                    <input
                      type="checkbox"
                      name="filters"
                      value={item}
                      checked={draft.filters.includes(item)}
                      onChange={(event) =>
                        change(
                          'filters',
                          event.target.checked
                            ? [...draft.filters, item]
                            : draft.filters.filter((value) => value !== item),
                        )
                      }
                    />
                    {item}
                  </label>
                ))}
            </div>
            {state.errors.filters && (
              <p className="field-error" role="alert">
                {state.errors.filters}
              </p>
            )}
          </fieldset>
          <AdminField
            name="technologies"
            label="Technologies"
            value={draft.technologies}
            onChange={change}
            error={state.errors.technologies}
            hint="Separate technologies with commas."
          />
          {field(
            'technologyNote',
            false,
            'For example: proposed stack, or the actual technologies used.',
          )}
          <div className="form-row">
            {field('github')}
            {field('demo')}
          </div>
          {field(
            'image',
            false,
            'Optional public HTTPS image URL. Without one, the project uses a labeled concept illustration.',
          )}
          <details className="admin-case-study">
            <summary>Case study details</summary>
            {[
              'goal',
              'overview',
              'problem',
              'users',
              'approach',
              'role',
              'challenges',
              'outcome',
              'caveat',
            ].map((name) => field(name, true))}
            <AdminField
              name="features"
              label="Key features"
              value={draft.features}
              onChange={change}
              error={state.errors.features}
              multiline
              hint="One feature per line."
            />
          </details>
        </fieldset>
        <div className="admin-actions">
          <button className="button" type="submit" disabled={state.busy}>
            {state.busy ? 'Saving…' : project ? 'Save project' : 'Add project'}
          </button>
        </div>
        {state.error && (
          <p className="field-error" role="alert">
            {state.error}
          </p>
        )}
      </form>
    </div>
  );
}

export default function ProjectsEditor({ content, save }) {
  const [selected, setSelected] = useState(null);
  const [notice, setNotice] = useState('');
  if (selected !== null)
    return (
      <ProjectForm
        key={selected.slug || 'new'}
        project={selected.slug ? selected : null}
        content={content}
        save={save}
        onCancel={() => setSelected(null)}
        onSaved={() => {
          setNotice(selected.slug ? 'Project updated.' : 'Project added to your portfolio.');
          setSelected(null);
        }}
      />
    );
  return (
    <div className="admin-editor">
      <div className="admin-panel-heading">
        <div>
          <h2>Projects & portfolio work</h2>
          <p>Add a new entry or update an existing case study.</p>
        </div>
        <button
          className="button"
          type="button"
          onClick={() => {
            setNotice('');
            setSelected({});
          }}
        >
          <Plus size={18} aria-hidden="true" />
          New project
        </button>
      </div>
      <p role="status" className="form-feedback">
        {notice}
      </p>
      <ul className="admin-project-list">
        {content.projects.map((project) => (
          <li key={project.slug}>
            <div>
              <h3>{project.title}</h3>
              <p>
                {project.status} · {project.category}
              </p>
            </div>
            <div className="admin-project-actions">
              <Link
                to={`/projects/${project.slug}`}
                className="icon-button"
                aria-label={`View ${project.title}`}
              >
                <ArrowUpRight size={18} aria-hidden="true" />
              </Link>
              <button
                className="button button-outline"
                type="button"
                onClick={() => {
                  setNotice('');
                  setSelected(project);
                }}
                aria-label={`Edit ${project.title}`}
              >
                Edit
              </button>
            </div>
          </li>
        ))}
      </ul>
      {!content.projects.length && <p>No projects yet. Add your first portfolio entry.</p>}
    </div>
  );
}
