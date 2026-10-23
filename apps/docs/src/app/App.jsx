import { lazy, Suspense, useEffect } from 'react';
import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
  useLocation,
  useParams,
} from 'react-router-dom';
import { Toaster } from 'sonner';
import { useTheme } from '../hooks/useTheme.js';
import SiteLayout from './SiteLayout.jsx';
import DocsShell from '../layouts/DocsShell.jsx';
import ComponentLayout from '../layouts/ComponentLayout.jsx';
import HomePage from '../pages/HomePage.jsx';
import DocsIndexPage from '../pages/DocsIndexPage.jsx';
import ComponentsPage from '../pages/ComponentsPage.jsx';
import ComponentDocsPage from '../pages/ComponentDocsPage.jsx';
import ThemingPage from '../pages/ThemingPage.jsx';
import InstallationPage from '../pages/InstallationPage.jsx';
import NotFoundPage from '../pages/NotFoundPage.jsx';
import ErrorBoundary from '../components/ErrorBoundary.jsx';
import ShortcutsHelp from '../components/ShortcutsHelp.jsx';
import AppShortcuts from '../components/AppShortcuts.jsx';
import { useShellStore } from '../stores/shellStore.js';
import { getComponent, getReadyComponent, readyComponents } from '../registry/componentRegistry.js';
import { paths, routePatterns } from '../routes.js';
import styles from './App.module.css';

/* The playground pulls in the split-view and generator code, so it is the one
   route worth splitting out of the initial docs bundle. */
const ComponentPlaygroundPage = lazy(() => import('../pages/ComponentPlaygroundPage.jsx'));
const CommandPalette = lazy(() => import('../components/CommandPalette.jsx'));

function RouteTitle() {
  const { pathname } = useLocation();

  useEffect(() => {
    const segment = pathname.split('/').filter(Boolean);
    let page = '';
    if (pathname === '/') page = 'Component library';
    else if (segment[0] === 'docs') {
      if (segment[1] === 'components' && segment[2]) {
        const component = getComponent(segment[2]);
        page = component ? component.name : 'Components';
        if (segment[3] === 'playground') page += ' playground';
      } else if (segment[1] === 'components') page = 'Components';
      else if (segment[1] === 'installation') page = 'Installation';
      else if (segment[1] === 'theming') page = 'Theming';
      else page = 'Documentation';
    }
    document.title = page ? `${page} · Nasaq UI` : 'Nasaq UI';
  }, [pathname]);

  return null;
}

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
  const commandOpen = useShellStore((state) => state.commandOpen);
  return (
    <div className={styles.root} data-theme-mode={resolvedMode} style={overridesStyle}>
      <RouteTitle />
      <AppShortcuts />
      <ErrorBoundary label="This page failed to render.">
        <Suspense
          fallback={
            <div className={styles.routeFallback} role="status" aria-live="polite">
              <span className="visually-hidden">Loading the studio…</span>
              <span className={styles.skeleton} aria-hidden="true" />
              <span className={styles.skeletonWide} aria-hidden="true" />
              <span className={styles.skeleton} aria-hidden="true" />
            </div>
          }
        >
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
        </Suspense>
      </ErrorBoundary>
      {commandOpen ? (
        <Suspense fallback={null}>
          <CommandPalette />
        </Suspense>
      ) : null}
      <ShortcutsHelp />
      <Toaster
        position="bottom-right"
        theme={resolvedMode}
        closeButton
        toastOptions={{ duration: 2600 }}
      />
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