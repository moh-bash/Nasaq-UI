import { BrowserRouter, Navigate, Route, Routes, useParams } from 'react-router-dom';
import { ThemeProvider, useTheme } from '../providers/ThemeProvider.jsx';
import { StylingModeProvider } from '../providers/StylingModeProvider.jsx';
import SiteLayout from './SiteLayout.jsx';
import DocsLayout from '../layouts/DocsLayout.jsx';
import HomePage from '../pages/HomePage.jsx';
import DocsIndexPage from '../pages/DocsIndexPage.jsx';
import ComponentsPage from '../pages/ComponentsPage.jsx';
import ComponentDocsPage from '../pages/ComponentDocsPage.jsx';
import ThemingPage from '../pages/ThemingPage.jsx';
import InstallationPage from '../pages/InstallationPage.jsx';
import PlaygroundPage from '../pages/PlaygroundPage.jsx';
import NotFoundPage from '../pages/NotFoundPage.jsx';
import styles from './App.module.css';

/* Rewrites a target path, substituting :params from the matched route. */
function Redirect({ to }) {
  const params = useParams();
  const target = to.replace(/:([A-Za-z]+)/g, (_, key) => params[key] || '');
  return <Navigate to={target} replace />;
}

function ThemedApp() {
  const { theme, overridesStyle } = useTheme();
  return (
    <div className={styles.root} data-theme-mode={theme.mode} style={overridesStyle}>
      <Routes>
        {/* Marketing / wrappers */}
        <Route element={<SiteLayout />}>
          <Route index element={<HomePage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>

        {/* Docs shell: header + sidebar + content */}
        <Route path="docs" element={<DocsLayout />}>
          <Route index element={<DocsIndexPage />} />
          <Route path="components" element={<ComponentsPage />} />
          <Route path="components/:componentId" element={<ComponentDocsPage />} />
          <Route path="theming" element={<ThemingPage />} />
          <Route path="installation" element={<InstallationPage />} />
        </Route>

        {/* Old URLs keep working and land on their new docs home. */}
        <Route path="components" element={<Navigate to="/docs/components" replace />} />
        <Route path="components/:componentId" element={<Redirect to="/docs/components/:componentId" />} />
        <Route path="theme" element={<Navigate to="/docs/theming" replace />} />

        <Route path="playground" element={<Navigate to="/playground/accordion" replace />} />
        <Route path="playground/:componentId" element={<PlaygroundPage />} />
      </Routes>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <StylingModeProvider>
          <ThemedApp />
        </StylingModeProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}