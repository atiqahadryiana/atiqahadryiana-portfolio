import { MessageCircle } from 'lucide-react';
import { profile } from '../data/portfolio';
import ContactForm from '../components/ContactForm';
import SocialLinks from '../components/SocialLinks';
import Reveal from '../components/Reveal';
export default function Contact() {
  return (
    <section id="contact" className="section section-tinted" aria-labelledby="contact-title">
      <Reveal className="container contact-layout">
        <div className="contact-copy">
          <p className="section-kicker">
            <span className="section-number" aria-hidden="true">
              07
            </span>
            Leave a note
          </p>
          <MessageCircle className="contact-icon" size={34} strokeWidth={1.3} aria-hidden="true" />
          <h2 id="contact-title">{profile.contactTitle}</h2>
          <p>{profile.contactCopy}</p>
          <SocialLinks />
        </div>
        <ContactForm />
      </Reveal>
    </section>
  );
}
