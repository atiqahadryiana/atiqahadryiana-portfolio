import { Mail, ArrowUpRight } from 'lucide-react';
import { profile } from '../data/portfolio';
import { isEmail, isWebUrl } from '../utils/content';
export default function SocialLinks() {
  const links = profile.socials.filter((item) => isWebUrl(item.url));
  if (!links.length && !isEmail(profile.email)) return null;
  return (
    <div className="social-links">
      {links.map((item) => {
        const brand =
          item.label === 'GitHub' ? 'github' : item.label === 'LinkedIn' ? 'linkedin' : null;
        return (
          <a
            key={item.label}
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={item.label}
          >
            {brand ? (
              <span className={`social-brand-logo social-logo-${brand}`} aria-hidden="true" />
            ) : (
              <ArrowUpRight size={19} aria-hidden="true" />
            )}
            <span>{item.label}</span>
          </a>
        );
      })}
      {isEmail(profile.email) && (
        <a href={`mailto:${profile.email}`}>
          <Mail size={19} aria-hidden="true" />
          <span>Email</span>
        </a>
      )}
    </div>
  );
}
