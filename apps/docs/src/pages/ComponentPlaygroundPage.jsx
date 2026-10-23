import { Navigate, useParams } from 'react-router-dom';
import { getReadyComponent } from '../registry/componentRegistry.js';
import Playground from '../playground/Playground.jsx';

export default function ComponentPlaygroundPage() {
  const { componentId } = useParams();
  const component = getReadyComponent(componentId);

  if (!component) {
    return <Navigate to="/docs/components" replace />;
  }

  return <Playground component={component} key={component.id} />;
}
