import { Navigate, useParams } from 'react-router-dom';
import { getReadyComponent } from '../registry/componentRegistry.js';
import Playground from '../playground/Playground.jsx';
import styles from '../app/App.module.css';

export default function PlaygroundPage() {
  const { componentId } = useParams();
  const component = getReadyComponent(componentId);

  if (!component) return <Navigate to="/components" replace />;

  return (
    <div className={styles.studioFill}>
      <Playground component={component} key={component.id} />
    </div>
  );
}
