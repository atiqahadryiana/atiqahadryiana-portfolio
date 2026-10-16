export const projectStatuses = [
  'Concept',
  'Prototype concept',
  'In progress',
  'Prototype',
  'Completed',
  'Details pending',
];
export const projectTextFields = [
  'title',
  'slug',
  'category',
  'summary',
  'goal',
  'technologyNote',
  'overview',
  'problem',
  'users',
  'approach',
  'role',
  'challenges',
  'outcome',
  'caveat',
  'github',
  'demo',
  'image',
];
export const profileFields = [
  'name',
  'location',
  'identity',
  'headline',
  'introduction',
  'email',
  'github',
  'linkedin',
];
export const cleanPlaceholder = (value) =>
  typeof value === 'string' && !value.includes('ADD_') ? value : '';
const webLink = (value) => {
  try {
    const url = new URL(value);
    return url.protocol === 'https:' && !url.username && !url.password;
  } catch {
    return false;
  }
};
const text = (value, limit = 4000) => typeof value === 'string' && value.length <= limit;

export function validateProject(project, filters) {
  const errors = {};
  for (const key of projectTextFields)
    if (!text(project?.[key] ?? '')) errors[key] = 'Use text shorter than 4,000 characters.';
  for (const key of ['title', 'slug', 'category', 'summary'])
    if (typeof project?.[key] !== 'string' || !project[key].trim())
      errors[key] = 'This field is required.';
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(project?.slug || '') || project.slug.length > 100)
    errors.slug = 'Use lowercase words separated by hyphens (up to 100 characters).';
  if (!projectStatuses.includes(project?.status)) errors.status = 'Choose a project status.';
  if (
    !Array.isArray(project?.filters) ||
    !project.filters.length ||
    project.filters.some((item) => !filters.includes(item) || item === 'All')
  )
    errors.filters = 'Choose at least one project category.';
  for (const key of ['technologies', 'features'])
    if (
      !Array.isArray(project?.[key]) ||
      project[key].length > 40 ||
      project[key].some((item) => !text(item, 300) || !item.trim())
    )
      errors[key] = 'Use up to 40 entries, each under 300 characters.';
  for (const key of ['github', 'demo', 'image'])
    if (project?.[key] && !webLink(project[key]))
      errors[key] = 'Use a public HTTPS URL, or leave blank.';
  return errors;
}

export function validateProfile(profile) {
  const errors = {};
  for (const key of profileFields)
    if (!text(profile?.[key], key === 'introduction' ? 2000 : 300))
      errors[key] = 'Enter a shorter text value.';
  for (const key of ['name', 'identity', 'headline', 'introduction'])
    if (typeof profile?.[key] !== 'string' || !profile[key].trim())
      errors[key] = 'This field is required.';
  if (
    !Array.isArray(profile?.about) ||
    !profile.about.length ||
    profile.about.length > 12 ||
    profile.about.some((item) => !text(item) || !item.trim())
  )
    errors.about = 'Add 1–12 paragraphs, each shorter than 4,000 characters.';
  if (profile?.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(profile.email))
    errors.email = 'Enter a valid email address, or leave blank.';
  for (const key of ['github', 'linkedin'])
    if (profile?.[key] && !webLink(profile[key]))
      errors[key] = 'Use a public HTTPS URL, or leave blank.';
  return errors;
}
