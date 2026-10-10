import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { ThemeProvider, useTheme } from '../providers/ThemeProvider.jsx';
import { StylingModeProvider } from '../providers/StylingModeProvider.jsx';
import SiteLayout from './SiteLayout.jsx';
import HomePage from '../pages/HomePage.jsx';
import ComponentsPage from '../pages/ComponentsPage.jsx';
import ComponentDocsPage from '../pages/ComponentDocsPage.jsx';
import ThemePage from '../pages/ThemePage.jsx';
import PlaygroundPage from '../pages/PlaygroundPage.jsx';
import NotFoundPage from '../pages/NotFoundPage.jsx';
import styles from './App.module.css';

function ThemedApp() {
  const { theme, overridesStyle } = useTheme();
  return (
    <div className={styles.root} data-theme-mode={theme.mode} style={overridesStyle}>
      <Routes>
        <Route element={<SiteLayout />}>
          <Route index element={<HomePage />} />
          <Route path="components" element={<ComponentsPage />} />
          <Route path="components/:componentId" element={<ComponentDocsPage />} />
          <Route path="theme" element={<ThemePage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
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
