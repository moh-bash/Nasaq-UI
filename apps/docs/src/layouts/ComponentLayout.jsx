import { useEffect } from 'react';
import { NavLink, Outlet, useParams } from 'react-router-dom';
import { getComponent, getReadyComponent } from '../registry/componentRegistry.js';
import { setLastComponent } from '../utils/shellStorage.js';
import { paths } from '../routes.js';
import styles from './ComponentLayout.module.css';

export default function ComponentLayout() {
  const { componentId } = useParams();
  const component = getComponent(componentId);
  const ready = getReadyComponent(componentId);

  useEffect(() => {
    if (component && ready) {
      setLastComponent(component.id);
    }
  }, [component, ready]);

  if (!component) {
    return <Outlet />;
  }

  const showPlaygroundTab = !!ready;

  return (
    <div className={styles.container}>
      {showPlaygroundTab ? (
        <nav className={styles.tabBar} role="tablist" aria-label="Component view">
          <NavLink
            to={paths.componentDocs(componentId)}
            end
            className={({ isActive }) => (isActive ? styles.tabActive : styles.tab)}
            role="tab"
          >
            Docs
          </NavLink>
          <NavLink
            to={paths.playground(componentId)}
            className={({ isActive }) => (isActive ? styles.tabActive : styles.tab)}
            role="tab"
          >
            Playground
          </NavLink>
        </nav>
      ) : null}
      <div className={styles.content}>
        <Outlet />
      </div>
    </div>
  );
}
