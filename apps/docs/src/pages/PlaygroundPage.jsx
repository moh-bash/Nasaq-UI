import { Navigate, useParams } from 'react-router-dom';
import { getReadyComponent } from '../registry/componentRegistry.js';
import Playground from '../playground/Playground.jsx';
import SiteHeader from '../app/SiteHeader.jsx';
import styles from '../app/App.module.css';

export default function PlaygroundPage() {
  const { componentId } = useParams();
  const component = getReadyComponent(componentId);

  if (!component) return <Navigate to="/docs/components" replace />;

  return (
    <div className={styles.studioFill}>
      <SiteHeader />
      <div className={styles.studioBody}>
        <Playground component={component} key={component.id} />
      </div>
    </div>
  );
}