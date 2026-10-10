import { Outlet } from 'react-router-dom';
import SiteHeader from './SiteHeader.jsx';
import styles from './App.module.css';

export default function SiteLayout() {
  return (
    <>
      <SiteHeader />
      <div className={styles.content}>
        <main className={styles.scroll}>
          <Outlet />
        </main>
      </div>
    </>
  );
}
