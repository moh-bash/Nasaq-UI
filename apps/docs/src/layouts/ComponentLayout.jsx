import { useEffect } from 'react';
import { Outlet, useParams } from 'react-router-dom';
import { getComponent, getReadyComponent } from '../registry/componentRegistry.js';
import { setLastComponent } from '../utils/shellStorage.js';
import styles from './ComponentLayout.module.css';

/*
  Shared wrapper for both component views. The Docs/Playground switch lives in
  the sidebar; this layout only remembers the last component the user visited.
*/
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

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <Outlet />
      </div>
    </div>
  );
}
