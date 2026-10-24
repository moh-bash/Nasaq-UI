import { useEffect } from 'react';
import { Navigate, useParams } from 'react-router-dom';
import { getReadyComponent } from '../registry/componentRegistry.js';
import { useShellStore } from '../stores/shellStore.js';
import { paths } from '../routes.js';
import Playground from '../playground/Playground.jsx';

export default function ComponentPlaygroundPage() {
  const { componentId } = useParams();
  const component = getReadyComponent(componentId);
  const setLastView = useShellStore((state) => state.setLastView);

  useEffect(() => {
    if (component) setLastView(component.id, 'playground');
  }, [component, setLastView]);

  if (!component) {
    return <Navigate to={paths.components} replace />;
  }

  return <Playground component={component} key={component.id} />;
}
