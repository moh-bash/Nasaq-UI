import { useEffect } from 'react';
import { Navigate, useParams } from 'react-router-dom';
import { getReadyComponent } from '../registry/componentRegistry.js';
import { setLastView } from '../utils/shellStorage.js';
import { paths } from '../routes.js';
import Playground from '../playground/Playground.jsx';

export default function ComponentPlaygroundPage() {
  const { componentId } = useParams();
  const component = getReadyComponent(componentId);

  useEffect(() => {
    if (component) setLastView(component.id, 'playground');
  }, [component]);

  if (!component) {
    return <Navigate to={paths.components} replace />;
  }

  return <Playground component={component} key={component.id} />;
}
