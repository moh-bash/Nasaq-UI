import { Outlet } from 'react-router-dom';
import SiteHeader from './SiteHeader.jsx';
import SkipLink from '../components/SkipLink.jsx';
import styles from './App.module.css';

export default function SiteLayout() {
  return (
    <>
      <SkipLink />
      <SiteHeader />
      <div className={styles.content}>
        <main className={styles.scroll} id="main-content">
          <Outlet />
        </main>
      </div>
    </>
  );
}
