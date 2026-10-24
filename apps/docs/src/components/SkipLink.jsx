import styles from './SkipLink.module.css';

/* Bypass block. Visible only while focused, so it never adds chrome. */
export default function SkipLink() {
  return (
    <a className={styles.skip} href="#main-content">
      Skip to content
    </a>
  );
}
