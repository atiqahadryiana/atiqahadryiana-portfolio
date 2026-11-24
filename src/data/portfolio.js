// All personal facts live here. Replace placeholders only with confirmed values.
// Project narratives are editable conceptual seed copy, not evidence of shipped work.
// Profile copy was revised from the user's public LinkedIn listing and GitHub READMEs.
// Source notes and verification limits: docs/PROFILE_NOTES.md.
export const profile = {
  name: 'Atiqah Adryiana',
  wordmark: 'AA',
  location: 'Malaysia',
  identity: 'Software engineering student · Malaysia',
  headline: 'I build practical tools for everyday problems.',
  headlineEmphasis: 'practical',
  roles: ['Software Engineering Student', 'Web & Mobile Developer', 'Curious Problem Solver'],
  introduction:
    'Software engineering student at UTHM, bringing a networking foundation to web development, mobile apps, and data exploration.',
  about: [
    'I’m Atiqah Adryiana, a Bachelor of Computer Science student at Universiti Tun Hussein Onn Malaysia (UTHM), focusing on software engineering. My background in computer networking shapes how I think about the systems behind an application, as well as the experience on screen.',
    'I learn by building. My public projects include a PHP and MySQL tuition management system and MindBloom, a Flutter and Dart app focused on student well-being. I’ve also explored Python data analysis through dataset profiling and housing-data exercises.',
    'I’m interested in software that makes everyday tasks easier and digital experiences more useful. Alongside development, I enjoy UI/UX design, continue exploring new tools, and contribute to student leadership and community activities.',
  ],
  email: 'adryianawork@gmail.com',
  resume: 'ADD_RESUME_FILE', // Public PDF URL, or /resume.pdf after adding the real file to public/.
  socials: [
    { label: 'GitHub', url: 'https://github.com/atiqahadryiana' },
    { label: 'LinkedIn', url: 'https://www.linkedin.com/in/sitinuratiqahadryiana' },
  ],
  contactTitle: 'Good things start with a conversation.',
  contactCopy:
    'Have a thoughtful idea, a challenging project, or an opportunity to learn? Let’s make a connection.',
  footerTagline: 'Thoughtful code. Meaningful possibilities.',
};

export const navigation = [
  { id: 'home', label: 'Home' },
  { id: 'about', label: 'About' },
  { id: 'experience', label: 'Experience' },
  { id: 'skills', label: 'Skills' },
  { id: 'projects', label: 'Projects' },
  { id: 'achievements', label: 'Achievements' },
  { id: 'contact', label: 'Contact' },
];

export const pillars = [
  {
    title: 'Useful software, real purpose',
    text: 'Web and mobile projects for administration, student well-being, and everyday tasks.',
    icon: 'code',
  },
  {
    title: 'Curiosity into practice',
    text: 'Exploring Python data analysis, UI/UX design, and new development tools.',
    icon: 'sparkles',
  },
  {
    title: 'People at the center',
    text: 'Building with student needs in mind and contributing to student-led activities.',
    icon: 'community',
  },
];

// Exposure and interests. Keep levels honest; update them only from confirmed information.
export const skillCategories = [
  {
    id: 'frontend',
    label: 'Frontend',
    skills: [
      { name: 'React', icon: 'react', level: 'Exploring' },
      { name: 'JavaScript', icon: 'javascript', level: 'Exploring' },
      { name: 'HTML', icon: 'html5', level: 'Exploring' },
      { name: 'CSS', icon: 'css3', level: 'Exploring' },
    ],
  },
  {
    id: 'backend',
    label: 'Backend',
    skills: [
      { name: 'PHP', icon: 'php', level: 'Exploring' },
      { name: 'Node.js', icon: 'nodejs', level: 'Exploring' },
      { name: 'Express', icon: 'express', level: 'Exploring' },
      { name: 'Python', icon: 'python', level: 'Exploring' },
      { name: 'Java', icon: 'java', level: 'Exploring' },
      { name: 'C#', icon: 'csharp', level: 'Exploring' },
    ],
  },
  {
    id: 'mobile',
    label: 'Mobile',
    skills: [
      { name: 'Flutter', icon: 'flutter', level: 'Exploring' },
      { name: 'Dart', icon: 'dart', level: 'Exploring' },
    ],
  },
  {
    id: 'database',
    label: 'Database',
    skills: [
      { name: 'MySQL', icon: 'mysql', level: 'Exploring' },
      { name: 'MongoDB', icon: 'mongodb', level: 'Exploring' },
      { name: 'Firebase', icon: 'firebase', level: 'Exploring' },
      { name: 'SQL', icon: 'database', level: 'Exploring' },
    ],
  },
  {
    id: 'ai',
    label: 'AI/ML',
    skills: [
      { name: 'Python', icon: 'python', level: 'Exploring' },
      { name: 'TensorFlow', icon: 'tensorflow', level: 'Exploring' },
    ],
  },
  {
    id: 'tools',
    label: 'Tools & Networking',
    skills: [
      { name: 'Figma', icon: 'figma', level: 'Exploring' },
      { name: 'Git', icon: 'git', level: 'Exploring' },
      { name: 'Networking', icon: 'network', level: 'Exploring' },
    ],
  },
];

export const projectFilters = ['All', 'Web', 'Mobile', 'Data'];
export const projects = [
  {
    slug: 'tuition-management-system',
    title: 'Tuition Management System',
    number: '01',
    category: 'Web app',
    status: 'Published repository',
    filters: ['Web'],
    summary:
      'A PHP web app for managing student records, tuition fees, courses, schedules, and reports.',
    goal: 'Manage tuition and student records through one web application.',
    technologies: ['PHP', 'MySQL', 'HTML', 'CSS', 'JavaScript'],
    technologyNote: 'Stack listed in the repository README.',
    overview:
      'The repository README describes a web application for student registration, fee payments, academic scheduling, and reporting.',
    problem: '',
    users: '',
    approach: '',
    features: [],
    role: '',
    challenges: '',
    outcome: '',
    caveat: 'See the public repository README for the project details.',
    github: 'https://github.com/atiqahadryiana/Tuition-Management-System',
    demo: 'ADD_DEMO_URL',
  },
  {
    slug: 'mindbloom',
    title: 'MindBloom',
    number: '02',
    category: 'Mobile app',
    status: 'Published repository',
    filters: ['Mobile'],
    summary:
      'A student well-being app with mood tracking, task planning, a calendar, and student resources.',
    goal: 'Support student well-being with mood, task, and resource tools.',
    technologies: ['Flutter', 'Dart', 'GitHub Actions'],
    technologyNote: 'Stack listed in the repository README.',
    overview:
      'The repository README describes a mobile app for mood tracking, task management, calendar planning, and student support resources.',
    problem: '',
    users: 'Students, as described in the repository README.',
    approach: '',
    features: [],
    role: '',
    challenges: '',
    outcome: '',
    caveat: 'See the public repository README for the project details.',
    github: 'https://github.com/atiqahadryiana/Mindbloom',
    demo: 'ADD_DEMO_URL',
  },
  {
    slug: 'breast-cancer-dataset-profiling',
    title: 'Breast cancer dataset profiling',
    number: '03',
    category: 'Data analysis',
    status: 'Published repository',
    filters: ['Data'],
    summary:
      'A notebook that profiles a 569-row dataset, summarizing variables, missing values, and correlations.',
    goal: 'Explore a breast cancer dataset with a generated profiling report.',
    technologies: [
      'Python',
      'Jupyter Notebook',
      'Pandas',
      'NumPy',
      'ydata-profiling',
      'Matplotlib',
      'Seaborn',
    ],
    technologyNote: 'Imports and project details are listed in the repository.',
    overview:
      'A Jupyter notebook uses ydata-profiling to summarize a 569-row dataset, including missing cells, variable types, and correlations.',
    problem: '',
    users: '',
    approach: '',
    features: [],
    role: '',
    challenges: '',
    outcome: '',
    caveat: 'This is a dataset profiling exercise, not a diagnostic tool.',
    github: 'https://github.com/atiqahadryiana/BreastCancer',
    demo: 'ADD_DEMO_URL',
  },
  {
    slug: 'ames-housing-analysis',
    title: 'Ames housing analysis',
    number: '04',
    category: 'Data analysis',
    status: 'Published repository',
    filters: ['Data'],
    summary:
      'A notebook covering descriptive statistics, visualizations, hypothesis tests, correlations, and house-price regression.',
    goal: 'Explore housing data and a simple living-area price model.',
    technologies: ['Python', 'Jupyter Notebook', 'Pandas', 'NumPy', 'Seaborn', 'Matplotlib'],
    technologyNote: 'Imports and project details are listed in the repository.',
    overview:
      'The notebook analyzes the Ames housing dataset with descriptive statistics, plots, hypothesis tests, correlations, and a simple linear regression model.',
    problem: '',
    users: '',
    approach: '',
    features: [],
    role: '',
    challenges: '',
    outcome: '',
    caveat: 'See the public repository README for the dataset and analysis details.',
    github: 'https://github.com/atiqahadryiana/AmesHousing',
    demo: 'ADD_DEMO_URL',
  },
];

// Past employment, internships, contract, or freelance work only.
// Add entries after the role and organization have been confirmed.
export const experience = [];

export const certifications = [
  {
    id: 'pcep',
    title: 'PCEP — Certified Entry-Level Python Programmer',
    issuer: 'Python Institute',
    date: '',
    verification: '',
    note: 'Credential supplied in the brief; verification link and issue date have not been provided.',
  },
  {
    id: 'cisco',
    title: 'Cisco networking training',
    issuer: 'Cisco Networking Academy',
    date: '',
    verification: '',
    note: 'Course / training entry. Exact certificate title to be confirmed; this does not claim a passed professional CCNA exam.',
  },
];
export const awards = []; // Add only documented awards. Empty state is intentional.
export const education = [
  {
    id: 'degree',
    stage: 'Degree',
    title: 'Bachelor of Computer Science',
    institution: 'Universiti Tun Hussein Onn Malaysia',
    abbreviation: 'UTHM',
    detail: 'Software engineering focus',
    dates: '',
  },
  {
    id: 'diploma',
    stage: 'Foundation',
    title: 'Diploma in Computer Networking',
    institution: '',
    detail: 'A foundation in connected systems and networking.',
    dates: '',
  },
];
