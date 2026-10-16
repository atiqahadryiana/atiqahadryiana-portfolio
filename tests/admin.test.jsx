import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import Admin from '../src/pages/Admin';
import { profile, projects, projectFilters } from '../src/data/portfolio';

const initial = {
  profile: { ...profile, resume: '' },
  projects,
  projectFilters,
  revision: 'revision-one',
};
const auth = {
  authenticated: true,
  configured: true,
  username: 'testowner',
  token: 'test-session',
};
const ok = (data) => ({ ok: true, json: async () => data });
const open = () =>
  render(
    <MemoryRouter>
      <Admin />
    </MemoryRouter>,
  );
const start = () =>
  vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce(ok(auth)).mockResolvedValueOnce(ok(initial));

describe('Portfolio admin', () => {
  it('requires a successful login before showing editing tools', async () => {
    const user = userEvent.setup();
    vi.spyOn(globalThis, 'fetch')
      .mockResolvedValueOnce(ok({ configured: true, authenticated: false }))
      .mockResolvedValueOnce({
        ok: false,
        status: 401,
        json: async () => ({ error: 'The username or password is incorrect.' }),
      })
      .mockResolvedValueOnce(ok(auth))
      .mockResolvedValueOnce(ok(initial));
    open();
    expect(await screen.findByRole('heading', { name: 'Admin sign-in.' })).toBeVisible();
    expect(screen.queryByRole('button', { name: 'New project' })).not.toBeInTheDocument();
    await user.type(screen.getByLabelText('Username'), 'testowner');
    await user.type(screen.getByLabelText('Password'), 'test-password');
    await user.click(screen.getByRole('button', { name: 'Sign in', exact: true }));
    expect(await screen.findByRole('alert')).toHaveTextContent('incorrect');
    await user.click(screen.getByRole('button', { name: 'Sign in', exact: true }));
    expect(await screen.findByRole('button', { name: 'New project' })).toBeVisible();
  });
  it('validates a resume and previews it only after a confirmed save', async () => {
    const user = userEvent.setup();
    const fetchMock = start().mockResolvedValueOnce(
      ok({
        ...initial,
        profile: { ...profile, resume: 'https://example.com/resume.pdf' },
        revision: 'revision-two',
      }),
    );
    open();
    await user.click(await screen.findByRole('button', { name: 'Resume', exact: true }));
    await user.type(screen.getByLabelText('Resume PDF URL'), 'javascript:alert(1)');
    await user.click(screen.getByRole('button', { name: 'Save resume link' }));
    expect(screen.getByLabelText('Resume PDF URL')).toHaveAttribute('aria-invalid', 'true');
    expect(fetchMock).toHaveBeenCalledTimes(2);
    await user.clear(screen.getByLabelText('Resume PDF URL'));
    await user.type(screen.getByLabelText('Resume PDF URL'), 'https://example.com/resume.pdf');
    expect(screen.queryByRole('link', { name: 'View resume' })).not.toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Save resume link' }));
    expect(await screen.findByRole('link', { name: 'View resume' })).toHaveAttribute(
      'href',
      'https://example.com/resume.pdf',
    );
  });
  it('keeps a project draft when a save fails', async () => {
    const user = userEvent.setup();
    start().mockResolvedValueOnce({
      ok: false,
      status: 409,
      json: async () => ({ error: 'Reload before saving.' }),
    });
    open();
    await user.click(await screen.findByRole('button', { name: 'New project' }));
    for (const [label, value] of [
      ['Project title', 'New project'],
      ['Project URL slug', 'new-project'],
      ['Project category', 'Web application'],
      ['Short description', 'A useful application.'],
    ])
      await user.type(screen.getByLabelText(label), value);
    await user.click(screen.getByLabelText('Web', { selector: 'input' }));
    await user.click(screen.getByRole('button', { name: 'Add project', exact: true }));
    expect(await screen.findByRole('alert')).toHaveTextContent('Reload before saving');
    expect(screen.getByLabelText('Project title')).toHaveValue('New project');
    expect(screen.getByRole('form', { name: 'Project editor' })).toBeVisible();
  });
});
