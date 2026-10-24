import { useEffect } from 'react';
import { Outlet, useParams } from 'react-router-dom';
import { getComponent, getReadyComponent } from '../registry/componentRegistry.js';
import { useShellStore } from '../stores/shellStore.js';
import styles from './ComponentLayout.module.css';

/*
  Shared wrapper for both component views. The Docs/Playground switch lives in
  the sidebar; this layout only remembers the last component the user visited.
*/
export default function ComponentLayout() {
  const { componentId } = useParams();
  const component = getComponent(componentId);
  const ready = getReadyComponent(componentId);
  const setLastComponent = useShellStore((state) => state.setLastComponent);

  useEffect(() => {
    if (component && ready) setLastComponent(component.id);
  }, [component, ready, setLastComponent]);

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
