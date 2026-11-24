import { describe, it, expect, vi } from 'vitest';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import Projects from '../src/sections/Projects';
import SkillTabs from '../src/components/SkillTabs';
import Navbar from '../src/components/Navbar';
import ContactForm from '../src/components/ContactForm';
import ProjectDetails from '../src/pages/ProjectDetails';
import Hero from '../src/sections/Hero';
import ProjectCard from '../src/components/ProjectCard';
import App from '../src/App';
import { profile, projects } from '../src/data/portfolio';
import { isEmail, isFormEndpoint, isWebUrl, publicAsset } from '../src/utils/content';

const wrap = (element, route = '/') =>
  render(<MemoryRouter initialEntries={[route]}>{element}</MemoryRouter>);
describe('Project exploration', () => {
  it('filters projects by web, mobile, and data work', async () => {
    const user = userEvent.setup();
    wrap(<Projects />);
    expect(screen.getAllByRole('article')).toHaveLength(4);
    await user.click(screen.getByRole('button', { name: 'Data', exact: true }));
    expect(screen.getAllByRole('article')).toHaveLength(2);
    expect(
      screen.getByRole('heading', { name: 'Breast cancer dataset profiling' }),
    ).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Ames housing analysis' })).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Web', exact: true }));
    expect(screen.getAllByRole('article')).toHaveLength(1);
    expect(screen.getByRole('heading', { name: 'Tuition Management System' })).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'All', exact: true }));
    expect(screen.getAllByRole('article')).toHaveLength(4);
    expect(
      screen.getByRole('link', { name: 'View GitHub repository for Tuition Management System' }),
    ).toHaveAttribute('href', 'https://github.com/atiqahadryiana/Tuition-Management-System');
  });
  it('shows each project as text, stack, and an optional repository link with no artwork', () => {
    const { container } = wrap(<Projects />);
    expect(screen.getByRole('heading', { name: 'MindBloom' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'MindBloom' })).toHaveAttribute(
      'href',
      '/projects/mindbloom',
    );
    expect(
      screen.getByText(/mood tracking, task planning, a calendar, and student resources/i),
    ).toBeInTheDocument();
    expect(screen.getByLabelText('Technologies used in MindBloom')).toHaveTextContent('Flutter');
    expect(
      screen.getByRole('link', { name: 'View GitHub repository for MindBloom' }),
    ).toHaveAttribute('href', 'https://github.com/atiqahadryiana/Mindbloom');
    expect(container.querySelector('.project-card img')).toBeNull();
    expect(container.querySelector('.project-card .project-meta')).toBeNull();
    expect(container.querySelector('.project-card .project-goal')).toBeNull();
  });
  it('renders a detail page with its configured repository and no missing demo link', async () => {
    wrap(<App />, '/projects/tuition-management-system');
    expect(
      await screen.findByRole('heading', { level: 1, name: /Tuition Management System/ }),
    ).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'View source' })).toHaveAttribute(
      'href',
      'https://github.com/atiqahadryiana/Tuition-Management-System',
    );
    expect(screen.queryByRole('link', { name: 'Live demo' })).not.toBeInTheDocument();
    expect(
      screen.getByText('See the public repository README for the project details.'),
    ).toBeInTheDocument();
  });
  it('keeps project titles plain and hides an unconfigured GitHub action', () => {
    const project = { ...projects[0], github: 'ADD_GITHUB_URL' };
    wrap(<ProjectCard project={project} />);
    expect(screen.getByRole('heading', { level: 3, name: project.title })).toBeInTheDocument();
    expect(
      screen.queryByRole('link', { name: `View GitHub repository for ${project.title}` }),
    ).not.toBeInTheDocument();
  });
  it.each(['/missing', '/projects/missing'])('handles unknown route %s', async (route) => {
    wrap(<App />, route);
    expect(await screen.findByRole('heading', { level: 1 })).toHaveTextContent(
      route.includes('projects')
        ? 'That project is still out there.'
        : 'A little off the beaten path.',
    );
  });
  it('handles an unresolved slug directly', () => {
    wrap(<ProjectDetails />);
    expect(screen.getByRole('link', { name: 'Back to projects' })).toBeInTheDocument();
  });
});

describe('Navigation and theme', () => {
  it('opens, closes with escape and returns focus, then closes after navigation', async () => {
    const user = userEvent.setup();
    wrap(<Navbar theme="dark" toggle={() => {}} />);
    const trigger = screen.getByRole('button', { name: 'Open navigation' });
    await user.click(trigger);
    expect(trigger).toHaveAttribute('aria-expanded', 'true');
    await user.keyboard('{Escape}');
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
    expect(trigger).toHaveFocus();
    await user.click(trigger);
    await user.click(screen.getByRole('link', { name: 'Projects', exact: true }));
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
  });
  it('supports keyboard movement and selection in skill tabs', async () => {
    const user = userEvent.setup();
    wrap(<SkillTabs />);
    screen.getByRole('tab', { name: 'Frontend' }).focus();
    await user.keyboard('{ArrowRight}');
    expect(screen.getByRole('tab', { name: 'Backend' })).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByRole('tabpanel')).toHaveTextContent('Express');
    await user.keyboard('{End}');
    expect(screen.getByRole('tab', { name: 'Tools & Networking' })).toHaveFocus();
    await user.keyboard('{Home}');
    expect(screen.getByRole('tab', { name: 'Frontend' })).toHaveFocus();
  });
  it('persists a selected theme', async () => {
    const user = userEvent.setup();
    wrap(<App />, '/missing');
    await user.click(screen.getByRole('button', { name: 'Switch to light theme' }));
    expect(document.documentElement.dataset.theme).toBe('light');
    expect(localStorage.getItem('portfolio-theme')).toBe('light');
  });
  it('renders configured social profiles while hiding placeholder actions', () => {
    const { container } = wrap(<Hero />);
    expect(container.querySelector('a[href*="ADD_"]')).toBeNull();
    expect(screen.queryByRole('link', { name: /resume/i })).not.toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'GitHub' })).toHaveAttribute(
      'href',
      'https://github.com/atiqahadryiana',
    );
    expect(screen.getByRole('link', { name: 'LinkedIn' })).toHaveAttribute(
      'href',
      'https://www.linkedin.com/in/sitinuratiqahadryiana',
    );
  });
  it('opens a configured public resume in a new tab without forcing a download', () => {
    const previousResume = profile.resume;
    try {
      profile.resume = 'https://example.com/resume.pdf';
      wrap(<Hero />);
      const link = screen.getByRole('link', { name: 'View resume' });
      expect(link).toHaveAttribute('href', profile.resume);
      expect(link).toHaveAttribute('target', '_blank');
      expect(link).toHaveAttribute('rel', 'noopener noreferrer');
      expect(link).not.toHaveAttribute('download');
    } finally {
      profile.resume = previousResume;
    }
  });
});

async function fillForm(user) {
  await user.type(screen.getByLabelText('Your name'), 'Example Visitor');
  await user.type(screen.getByLabelText('Email address'), 'visitor@example.com');
  await user.type(screen.getByLabelText('Subject'), 'Project idea');
  await user.type(
    screen.getByLabelText('Your message'),
    'I would like to discuss a thoughtful project.',
  );
}
describe('Contact form', () => {
  it('disables delivery without a real destination and never claims success', () => {
    wrap(<ContactForm endpoint="" email="ADD_EMAIL" />);
    expect(screen.getByRole('button', { name: 'Open email app' })).toBeDisabled();
    fireEvent.submit(screen.getByRole('form'));
    expect(screen.queryByText(/was accepted/)).not.toBeInTheDocument();
  });
  it('validates fields and focuses the first error before sending', async () => {
    const user = userEvent.setup();
    const fetchMock = vi.spyOn(globalThis, 'fetch');
    wrap(<ContactForm endpoint="https://formspree.io/f/testform" />);
    await user.click(screen.getByRole('button', { name: 'Send message' }));
    expect(screen.getByLabelText('Your name')).toHaveFocus();
    expect(screen.getByText('Please enter a valid email address.')).toBeInTheDocument();
    expect(screen.getByLabelText('Your message')).toHaveAttribute('aria-invalid', 'true');
    expect(fetchMock).not.toHaveBeenCalled();
  });
  it('announces success only after the service accepts a valid request', async () => {
    const user = userEvent.setup();
    let resolveRequest;
    const request = new Promise((resolve) => {
      resolveRequest = resolve;
    });
    const fetchMock = vi.spyOn(globalThis, 'fetch').mockReturnValue(request);
    wrap(<ContactForm endpoint="https://formspree.io/f/testform" />);
    await fillForm(user);
    await user.click(screen.getByRole('button', { name: 'Send message' }));
    expect(screen.getByRole('button', { name: 'Sending…' })).toBeDisabled();
    expect(screen.queryByText(/was accepted/)).not.toBeInTheDocument();
    resolveRequest({ ok: true });
    expect(await screen.findByText(/was accepted by the contact service/)).toBeInTheDocument();
    expect(fetchMock).toHaveBeenCalledWith(
      'https://formspree.io/f/testform',
      expect.objectContaining({ method: 'POST' }),
    );
    expect(screen.getByLabelText('Your message')).toHaveValue('');
  });
  it.each([false, 'network'])('keeps the draft when the service fails: %s', async (failure) => {
    const user = userEvent.setup();
    const fetchMock = vi.spyOn(globalThis, 'fetch');
    if (failure === 'network') fetchMock.mockRejectedValue(new Error('Offline'));
    else fetchMock.mockResolvedValue({ ok: false });
    wrap(<ContactForm endpoint="https://formspree.io/f/testform" />);
    await fillForm(user);
    await user.click(screen.getByRole('button', { name: 'Send message' }));
    expect(await screen.findByText(/could not be sent/)).toBeInTheDocument();
    expect(screen.getByLabelText('Your message')).not.toHaveValue('');
    await waitFor(() => expect(screen.getByRole('button', { name: 'Send message' })).toBeEnabled());
  });
});
describe('Safe configuration', () => {
  it('accepts only web links, real public files and supported form endpoints', () => {
    expect(isWebUrl('javascript:alert(1)')).toBe(false);
    expect(isWebUrl('ADD_DEMO_URL')).toBe(false);
    expect(isWebUrl('https://example.com')).toBe(true);
    expect(isEmail('ADD_EMAIL')).toBe(false);
    expect(isEmail('hi@example.com')).toBe(true);
    expect(publicAsset('/missing-resume.pdf')).toBe(false);
    expect(isFormEndpoint('https://formspree.io.evil.example/f/test')).toBe(false);
    expect(isFormEndpoint('https://formspree.io/f/test')).toBe(true);
  });
});
