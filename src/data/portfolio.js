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

export const projectFilters = ['All', 'Web', 'Mobile', 'AI/ML', 'Community/Impact'];
export const projects = [
  {
    slug: 'smartbunda',
    title: 'SmartBunda',
    number: '01',
    category: 'Health & wellbeing',
    status: 'Concept',
    filters: ['Mobile', 'AI/ML', 'Community/Impact'],
    art: 'smartbunda',
    summary: 'Thoughtful nutrition support for Malaysian mothers-to-be.',
    goal: 'Make everyday food choices easier to understand during pregnancy.',
    technologies: ['Flutter', 'Firebase', 'TensorFlow'],
    technologyNote: 'Proposed stack; implementation is not confirmed.',
    overview:
      'A nutrition tracking application concept centered on Malaysian pregnant mothers and local food habits. The food-recognition module is exploratory.',
    problem:
      'A locally relevant food-logging experience could help mothers understand their nutrition and find trimester-aware support. This concept still needs user research and clinical review.',
    users: 'Malaysian pregnant mothers; needs and workflows to be validated through research.',
    approach:
      'Explore a mobile experience for local food logging, nutritional analysis, and trimester-aware information. Evaluate AI recognition as an optional assistive input.',
    features: [
      'Malaysian food logging',
      'Nutritional analysis',
      'Trimester-aware support',
      'Exploratory AI food recognition',
    ],
    role: '',
    challenges: '',
    outcome: '',
    caveat:
      'Concept illustration only. No completed application or medical validation is claimed. Any future health guidance requires qualified review.',
    github: 'ADD_GITHUB_URL',
    demo: 'ADD_DEMO_URL',
    image: 'ADD_IMAGE_PATH',
    gallery: [],
  },
  {
    slug: 'bakaubase',
    title: 'BakauBase',
    number: '02',
    category: 'Conservation & community',
    status: 'Prototype concept',
    filters: ['Web', 'Community/Impact'],
    art: 'bakaubase',
    summary: 'A clearer picture of mangrove restoration, from plot to progress.',
    goal: 'Explore a shared record for planting and follow-up conservation work.',
    technologies: ['React', 'Firebase'],
    technologyNote: 'Proposed stack; implementation is not confirmed.',
    overview:
      'A mangrove conservation web-app prototype concept for documenting planting plots and ongoing survival checks.',
    problem:
      'Planting records, follow-up observations, and photo evidence need to stay connected. This concept explores organizing that information in one place.',
    users: 'Conservation organizers and volunteers; target workflows are still to be validated.',
    approach:
      'Explore plot-based records, observation history, and progress summaries. Keep estimated carbon metrics separate from verified environmental outcomes.',
    features: [
      'Planting plot records',
      'Survival checks',
      'Photo evidence',
      'Progress dashboards',
      'Clearly labeled estimated carbon metrics',
    ],
    role: '',
    challenges: '',
    outcome: '',
    caveat:
      'Concept illustration only. Carbon metrics would be estimates; no verified environmental impact, active deployment, or completed prototype is claimed.',
    github: 'ADD_GITHUB_URL',
    demo: 'ADD_DEMO_URL',
    image: 'ADD_IMAGE_PATH',
    gallery: [],
  },
  {
    slug: 'scamshield-ai',
    title: 'ScamShield AI',
    number: '03',
    category: 'AI & digital safety',
    status: 'Concept',
    filters: ['Web', 'AI/ML', 'Community/Impact'],
    art: 'scamshield',
    summary: 'Helping people pause, check, and spot potential scam signals.',
    goal: 'Explore accessible, assistive message and link checking.',
    technologies: ['Python', 'TensorFlow', 'React'],
    technologyNote: 'Proposed stack; implementation is not confirmed.',
    overview:
      'An assistive concept for identifying potential scam messages and links, with an optional Telegram bot workflow.',
    problem:
      'Suspicious content can be difficult to assess. A checking workflow could highlight warning signals while making uncertainty clear.',
    users: 'People assessing suspicious messages or links; specific audience research is pending.',
    approach:
      'Explore message analysis with understandable warnings. Evaluate an optional Telegram workflow without implying a deployed bot.',
    features: [
      'Potential scam message signals',
      'Suspicious link checking',
      'Explainable assistive warnings',
      'Optional Telegram bot workflow',
    ],
    role: '',
    challenges: '',
    outcome: '',
    caveat:
      'Concept illustration only. Detection is assistive and cannot guarantee safety or accuracy. No trained model or measured results are claimed.',
    github: 'ADD_GITHUB_URL',
    demo: 'ADD_DEMO_URL',
    image: 'ADD_IMAGE_PATH',
    gallery: [],
  },
  {
    slug: 'task-manager',
    title: 'Task Manager',
    number: '04',
    category: 'Full-stack exploration',
    status: 'Details pending',
    filters: ['Web'],
    art: 'tasks',
    summary: 'An editable project entry for a full-stack task management application.',
    goal: 'Document the actual implementation, decisions, and lessons once confirmed.',
    technologies: ['React', 'Node.js', 'Express', 'MongoDB'],
    technologyNote: 'Example stack; replace with the actual stack before publication.',
    overview:
      'A full-stack software project entry awaiting confirmed scope and implementation details.',
    problem: '',
    users: '',
    approach: '',
    features: [],
    role: '',
    challenges: '',
    outcome: '',
    caveat:
      'Illustrative artwork. Project features, completion, and implementation are not confirmed.',
    github: 'ADD_GITHUB_URL',
    demo: 'ADD_DEMO_URL',
    image: 'ADD_IMAGE_PATH',
    gallery: [],
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
    image: '',
    note: 'Credential supplied in the brief; verification link and issue date have not been provided.',
  },
  {
    id: 'cisco',
    title: 'Cisco networking training',
    issuer: 'Cisco Networking Academy',
    date: '',
    verification: '',
    image: '',
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
