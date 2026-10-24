import { Link2 } from 'lucide-react';
import { toast } from 'sonner';
import { useLocation } from 'react-router-dom';
import { copyText } from '../../utils/clipboard.js';
import styles from './SectionHeading.module.css';

/* h2 + deep-link affordance. The link copies the absolute URL so it can be
   pasted into a chat, which is more useful than only changing the hash. */
export default function SectionHeading({ id, children, className = '' }) {
  const { pathname } = useLocation();

  const copyLink = async () => {
    const url = `${window.location.origin}${pathname}#${id}`;
    const ok = await copyText(url);
    if (ok) toast.success('Section link copied');
    else toast.error('Could not copy the section link');
  };

  return (
    <h2 id={id} className={`${className} ${styles.heading}`}>
      <span>{children}</span>
      <a
        href={`#${id}`}
        className={styles.anchor}
        aria-label={`Copy a link to ${children}`}
        title={`Copy a link to ${children}`}
        onClick={(event) => {
          if (event.metaKey || event.ctrlKey || event.shiftKey) return;
          event.preventDefault();
          copyLink();
        }}
      >
        <Link2 size={13} aria-hidden="true" />
      </a>
    </h2>
  );
}
