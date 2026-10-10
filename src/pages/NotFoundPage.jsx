import { Link } from 'react-router-dom';
import styles from './page.module.css';

export default function NotFoundPage() {
  return (
    <div className={styles.notFound}>
      <span className={styles.eyebrow}>404</span>
      <h1 className={styles.display}>Nothing on this press</h1>
      <p className={styles.lede}>The page you asked for is not registered in the studio.</p>
      <div className={styles.actions} style={{ justifyContent: 'center' }}>
        <Link to="/" className={styles.primaryAction}>
          Back home
        </Link>
        <Link to="/components" className={styles.secondaryAction}>
          Browse components
        </Link>
      </div>
    </div>
  );
}
