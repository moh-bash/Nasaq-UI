import { BrowserRouter, Navigate, Route, Routes, useParams } from 'react-router-dom';
import { useTheme } from '../hooks/useTheme.js';
import SiteLayout from './SiteLayout.jsx';
import DocsShell from '../layouts/DocsShell.jsx';
import ComponentLayout from '../layouts/ComponentLayout.jsx';
import HomePage from '../pages/HomePage.jsx';
import DocsIndexPage from '../pages/DocsIndexPage.jsx';
import ComponentsPage from '../pages/ComponentsPage.jsx';
import ComponentDocsPage from '../pages/ComponentDocsPage.jsx';
import ComponentPlaygroundPage from '../pages/ComponentPlaygroundPage.jsx';
import ThemingPage from '../pages/ThemingPage.jsx';
import InstallationPage from '../pages/InstallationPage.jsx';
import NotFoundPage from '../pages/NotFoundPage.jsx';
import { getReadyComponent, readyComponents } from '../registry/componentRegistry.js';
import { paths, routePatterns } from '../routes.js';
import styles from './App.module.css';

/* Rewrites a target path, substituting :params from the matched route. */
function Redirect({ to }) {
  const params = useParams();
  const target = to.replace(/:([A-Za-z]+)/g, (_, key) => params[key] || '');
  return <Navigate to={target} replace />;
}

function PlaygroundRedirect() {
  const first = readyComponents.find((c) => c.id === 'accordion')?.id || readyComponents[0]?.id || 'accordion';
  return <Navigate to={paths.playground(first)} replace />;
}

function PlaygroundComponentRedirect() {
  const { componentId } = useParams();
  const component = getReadyComponent(componentId);
  if (!component) {
    return <Navigate to={paths.components} replace />;
  }
  return <Navigate to={paths.playground(componentId)} replace />;
}

function ThemedApp() {
  const { overridesStyle, resolvedMode } = useTheme();
  return (
    <div className={styles.root} data-theme-mode={resolvedMode} style={overridesStyle}>
      <Routes>
        {/* Marketing / wrappers */}
        <Route element={<SiteLayout />}>
          <Route index element={<HomePage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>

        {/* Docs shell with unified sidebar */}
        <Route path="docs" element={<DocsShell />}>
          <Route index element={<DocsIndexPage />} />
          <Route path="installation" element={<InstallationPage />} />
          <Route path="theming" element={<ThemingPage />} />
          <Route path="components" element={<ComponentsPage />} />
          <Route path="components/:componentId" element={<ComponentLayout />}>
            <Route index element={<ComponentDocsPage />} />
            <Route path="playground" element={<ComponentPlaygroundPage />} />
          </Route>
        </Route>

        {/* Old URLs keep working and land on their new docs home. */}
        <Route path="components" element={<Navigate to={paths.components} replace />} />
        <Route path="components/:componentId" element={<Redirect to={routePatterns.component} />} />
        <Route path="theme" element={<Navigate to={paths.theming} replace />} />

        <Route path="playground" element={<PlaygroundRedirect />} />
        <Route path="playground/:componentId" element={<PlaygroundComponentRedirect />} />
      </Routes>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <ThemedApp />
    </BrowserRouter>
  );
}