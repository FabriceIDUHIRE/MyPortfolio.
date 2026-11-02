// ─────────────────────────────────────────────────────────────
//  Your links. Edit these and the whole site updates.
//  Until a link is filled in, its button falls back to an email.
// ─────────────────────────────────────────────────────────────
export const site = {
  name: 'Fabrice Iduhire',
  role: 'Product designer',
  email: 'fabriceatwork@gmail.com',
  bookCall: 'https://cal.com/fabrice-iduhire',
  resume: '', // e.g. '/resume.pdf' (put the file in the /public folder)
  linkedin: '', // e.g. 'https://www.linkedin.com/in/your-name'
};

export const mailto = `mailto:${site.email}`;
const mail = (subject: string) => `${mailto}?subject=${encodeURIComponent(subject)}`;

export const links = {
  book: site.bookCall || mail('Let’s book a 30-min call'),
  resume: site.resume || mail('Could you send me your resume?'),
  linkedin: site.linkedin || 'https://www.linkedin.com/search/results/all/?keywords=Fabrice%20Iduhire',
  email: mailto,
  hi: mail('Just saying hi 👋'),
};
export const isExternal = (href: string) => /^https?:/.test(href);
