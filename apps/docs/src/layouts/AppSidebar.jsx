import { useCallback, useMemo, useRef, useState } from 'react';
import {
  Blocks,
  BookOpen,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Code2,
  Download,
  FileText,
  Palette,
  Search,
} from 'lucide-react';
import { NavLink, useMatch, useNavigate } from 'react-router-dom';
import { buildSidebarSections, countPlanned, countReady } from '../navigation/docs-nav.js';
import {
  getExpandedComponents,
  getLastView,
  setExpandedComponents,
} from '../utils/shellStorage.js';
import { useShell } from './useShell.js';
import { paths, routePatterns } from '../routes.js';
import styles from './AppSidebar.module.css';

const STATIC_ICONS = {
  start: BookOpen,
  installation: Download,
  overview: Blocks,
  theming: Palette,
};

const SECTION_ICONS = {
  'getting-started': BookOpen,
  components: Blocks,
  customization: Palette,
};

function Highlight({ text, term }) {
  if (!term) return text;
  const index = text.toLowerCase().indexOf(term);
  if (index < 0) return text;
  return (
    <>
      {text.slice(0, index)}
      <mark className={styles.mark}>{text.slice(index, index + term.length)}</mark>
      {text.slice(index + term.length)}
    </>
  );
}

function filterSections(sections, term) {
  if (!term) return { sections, matches: new Set() };
  const matches = new Set();
  const result = [];
  for (const section of sections) {
    if (section.type === 'static') {
      const items = (section.items || []).filter((item) => item.label.toLowerCase().includes(term));
      if (items.length > 0) result.push({ ...section, items });
      continue;
    }
    const items = (section.items || []).filter((item) => item.label.toLowerCase().includes(term));
    const categories = (section.categories || [])
      .map((category) => {
        const components = (category.components || []).filter((component) => {
          const hit =
            component.name.toLowerCase().includes(term) ||
            (component.description || '').toLowerCase().includes(term);
          if (hit && component.ready) matches.add(component.id);
          return hit;
        });
        return { ...category, components };
      })
      .filter((category) => category.components.length > 0);
    if (items.length > 0 || categories.length > 0) {
      result.push({ ...section, items, categories });
    }
  }
  return { sections: result, matches };
}

export default function AppSidebar() {
  const navigate = useNavigate();
  const shell = useShell();
  const { collapsed, toggleCollapsed, isNarrow, view, closeMobileDrawer } = shell;
  const playgroundMatch = useMatch(routePatterns.playground);
  const docsMatch = useMatch(routePatterns.component);
  const activeId = playgroundMatch?.params.componentId || docsMatch?.params.componentId || null;
  const currentView = playgroundMatch ? 'playground' : 'docs';
  const onComponentRoute = Boolean(playgroundMatch || docsMatch);

  const [query, setQuery] = useState('');
  const [expanded, setExpanded] = useState(() => new Set(getExpandedComponents()));
  const navRef = useRef(null);
  const searchRef = useRef(null);
  const typeahead = useRef({ buffer: '', at: 0 });
  const term = query.trim().toLowerCase();

  const sections = useMemo(() => buildSidebarSections(), []);
  const filtered = useMemo(() => filterSections(sections, term), [sections, term]);

  const expandedIds = useMemo(() => {
    const next = new Set(expanded);
    if (activeId) next.add(activeId);
    for (const id of filtered.matches) next.add(id);
    return next;
  }, [expanded, activeId, filtered.matches]);

  const updateExpanded = useCallback((id) => {
    setExpanded((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      setExpandedComponents(next);
      return next;
    });
  }, []);

  const collapseSection = useCallback((id) => {
    setExpanded((current) => {
      if (!current.has(id)) return current;
      const next = new Set(current);
      next.delete(id);
      setExpandedComponents(next);
      return next;
    });
  }, []);

  const targetFor = useCallback(
    (componentId) => {
      const remembered = onComponentRoute ? currentView : getLastView(componentId) || view || 'docs';
      return remembered === 'playground' ? paths.playground(componentId) : paths.componentDocs(componentId);
    },
    [currentView, onComponentRoute, view],
  );

  const goToComponent = useCallback(
    (componentId) => {
      navigate(targetFor(componentId));
      closeMobileDrawer();
    },
    [closeMobileDrawer, navigate, targetFor],
  );

  const onComponentClick = useCallback(
    (componentId) => {
      const open = expandedIds.has(componentId);
      if (open && activeId !== componentId) collapseSection(componentId);
      else if (!open) updateExpanded(componentId);
      goToComponent(componentId);
    },
    [activeId, collapseSection, expandedIds, goToComponent, updateExpanded],
  );

  /* Arrow-key navigation over the disclosure buttons and links. The elements
     stay in the natural tab order; the handlers only add a second, faster path. */
  const onKeyDown = useCallback(
    (event) => {
      const { key, target, metaKey, ctrlKey, altKey } = event;
      if (!navRef.current || metaKey || ctrlKey || altKey) return;
      if (target.closest('input, textarea, select, [contenteditable="true"]')) return;
      const focusables = [...navRef.current.querySelectorAll('[data-nav-focusable]')];

      if (key === 'ArrowDown' || key === 'ArrowUp' || key === 'Home' || key === 'End') {
        if (focusables.length === 0) return;
        event.preventDefault();
        const index = focusables.indexOf(target);
        let next;
        if (key === 'Home') next = 0;
        else if (key === 'End') next = focusables.length - 1;
        else if (key === 'ArrowDown') next = index < 0 ? 0 : (index + 1) % focusables.length;
        else next = index <= 0 ? focusables.length - 1 : index - 1;
        focusables[next]?.focus();
        return;
      }

      if (key === 'ArrowRight') {
        if (target.dataset.componentId && target.getAttribute('aria-expanded') === 'false') {
          event.preventDefault();
          updateExpanded(target.dataset.componentId);
          return;
        }
        const id = target.dataset.parentId || target.dataset.componentId;
        if (id) {
          const child = focusables.find((el) => el.dataset.parentId === id);
          if (child && !expandedIds.has(id)) updateExpanded(id);
          if (child) {
            event.preventDefault();
            child.focus();
          }
        }
        return;
      }

      if (key === 'ArrowLeft') {
        const parentId = target.dataset.parentId;
        if (parentId) {
          event.preventDefault();
          focusables.find((el) => el.dataset.componentId === parentId)?.focus();
          return;
        }
        if (target.dataset.componentId && target.getAttribute('aria-expanded') === 'true') {
          event.preventDefault();
          collapseSection(target.dataset.componentId);
        }
        return;
      }

      if (key.length === 1 && /[a-z0-9]/i.test(key)) {
        const now = Date.now();
        if (now - typeahead.current.at > 600) typeahead.current.buffer = '';
        typeahead.current.buffer += key.toLowerCase();
        typeahead.current.at = now;
        const buffer = typeahead.current.buffer;
        const start = focusables.indexOf(target) + 1;
        const ordered = [...focusables.slice(start), ...focusables.slice(0, start)];
        const hit = ordered.find((el) => (el.dataset.navLabel || '').startsWith(buffer));
        if (hit) {
          event.preventDefault();
          hit.focus();
        }
      }
    },
    [collapseSection, expandedIds, updateExpanded],
  );

  const clearSearch = useCallback(() => {
    setQuery('');
    searchRef.current?.focus();
  }, []);

  const renderStaticItem = (item) => {
    const Icon = STATIC_ICONS[item.id] || BookOpen;
    return (
      <li key={item.id}>
        <NavLink
          to={item.to}
          end={item.end}
          data-nav-focusable
          data-nav-label={item.label.toLowerCase()}
          className={({ isActive }) => (isActive ? styles.itemActive : styles.item)}
          onClick={closeMobileDrawer}
        >
          <Icon size={14} aria-hidden="true" />
          <span className={styles.labelText}>
            <Highlight text={item.label} term={term} />
          </span>
        </NavLink>
      </li>
    );
  };

  const renderComponent = (component) => {
    if (!component.ready) {
      return (
        <li key={component.id}>
          <div className={styles.planned} aria-disabled="true">
            <span className={styles.plannedName}>{component.name}</span>
            <span className={styles.soonBadge}>Soon</span>
          </div>
        </li>
      );
    }

    const open = expandedIds.has(component.id);
    const isCurrent = activeId === component.id;
    return (
      <li key={component.id} className={styles.node}>
        <button
          type="button"
          className={isCurrent ? styles.nodeButtonActive : styles.nodeButton}
          data-nav-focusable
          data-nav-label={`${component.name} ${currentView}`.toLowerCase()}
          data-component-id={component.id}
          aria-expanded={open}
          aria-controls={`nav-children-${component.id}`}
          title={component.description}
          onClick={() => onComponentClick(component.id)}
        >
          <ChevronRight size={13} className={styles.nodeChevron} data-open={open} aria-hidden="true" />
          <span className={styles.labelText}>
            <Highlight text={component.name} term={term} />
          </span>
          {isCurrent ? <span className={styles.currentDot} aria-hidden="true" /> : null}
        </button>
        <div
          className={styles.childrenWrap}
          data-expanded={open}
          id={`nav-children-${component.id}`}
        >
          <ul className={styles.children}>
            <li>
              <NavLink
                to={paths.componentDocs(component.id)}
                end
                data-nav-focusable
                data-nav-label={`${component.name} docs`.toLowerCase()}
                data-parent-id={component.id}
                className={({ isActive }) => (isActive ? styles.childActive : styles.child)}
                onClick={closeMobileDrawer}
              >
                <FileText size={12} aria-hidden="true" />
                Docs
              </NavLink>
            </li>
            <li>
              <NavLink
                to={paths.playground(component.id)}
                data-nav-focusable
                data-nav-label={`${component.name} playground`.toLowerCase()}
                data-parent-id={component.id}
                className={({ isActive }) => (isActive ? styles.childActive : styles.child)}
                onClick={closeMobileDrawer}
              >
                <Code2 size={12} aria-hidden="true" />
                Playground
              </NavLink>
            </li>
          </ul>
        </div>
      </li>
    );
  };

  const rail = collapsed && !isNarrow;

  if (rail) {
    return (
      <nav
        id="docs-sidebar"
        className={`${styles.sidebar} ${styles.rail}`}
        aria-label="Documentation"
        data-collapsed="true"
      >
        <ul className={styles.railList}>
          {sections.map((section) => {
            const Icon = SECTION_ICONS[section.id] || Blocks;
            const first = section.items?.[0] || section.categories?.[0]?.components?.[0];
            const to = section.type === 'components' ? paths.components : first?.to;
            return (
              <li key={section.id}>
                <NavLink
                  to={to || paths.docs}
                  end={section.id === 'getting-started'}
                  className={({ isActive }) => (isActive ? styles.railActive : styles.railLink)}
                  aria-label={section.label}
                  title={section.label}
                >
                  <Icon size={16} aria-hidden="true" />
                </NavLink>
              </li>
            );
          })}
          <li className={styles.railDivider} aria-hidden="true" />
          {sections
            .flatMap((section) => section.categories || [])
            .flatMap((category) => category.components || [])
            .filter((component) => component.ready)
            .map((component) => (
              <li key={component.id}>
                <NavLink
                  to={targetFor(component.id)}
                  className={({ isActive }) => (isActive ? styles.railActive : styles.railLink)}
                  aria-label={component.name}
                  title={component.name}
                >
                  <span className={styles.railDot} aria-hidden="true" />
                </NavLink>
              </li>
            ))}
        </ul>
        <div className={styles.railFoot}>
          <button
            type="button"
            className={styles.collapseBtn}
            onClick={toggleCollapsed}
            aria-label="Expand sidebar"
            title="Expand sidebar"
          >
            <ChevronsRight size={16} aria-hidden="true" />
          </button>
        </div>
      </nav>
    );
  }

  return (
    <nav
      ref={navRef}
      id="docs-sidebar"
      className={styles.sidebar}
      aria-label="Documentation"
      data-collapsed="false"
      onKeyDown={onKeyDown}
    >
      <div className={styles.searchRow}>
        <Search size={13} className={styles.searchIcon} aria-hidden="true" />
        <input
          ref={searchRef}
          type="search"
          className={styles.search}
          name="component-search"
          placeholder="Search components"
          value={query}
          aria-label="Search components"
          data-sidebar-search
          onChange={(event) => setQuery(event.target.value)}
        />
        {query ? (
          <button type="button" className={styles.clearSearch} aria-label="Clear search" onClick={clearSearch}>
            ×
          </button>
        ) : null}
      </div>

      <div className={styles.body}>
        {filtered.sections.length === 0 ? (
          <p className={styles.noResults}>No components match “{query}”.</p>
        ) : (
          filtered.sections.map((section) => (
            <section className={styles.section} key={section.id} aria-label={section.label}>
              <h2 className={styles.sectionLabel}>{section.label}</h2>
              {section.items?.length ? (
                <ul className={styles.list} role="list">
                  {section.items.map(renderStaticItem)}
                </ul>
              ) : null}
              {(section.categories || []).map((category) => (
                <div className={styles.category} key={category.id}>
                  <h3 className={styles.categoryLabel}>{category.label}</h3>
                  <ul className={styles.list} role="list">
                    {category.components.map(renderComponent)}
                  </ul>
                </div>
              ))}
            </section>
          ))
        )}
      </div>

      <div className={styles.foot}>
        <span className={styles.counts}>
          <strong>{countReady()}</strong> ready · <strong>{countPlanned()}</strong> planned
        </span>
        {!isNarrow ? (
          <button
            type="button"
            className={styles.collapseBtn}
            onClick={toggleCollapsed}
            aria-label="Collapse sidebar"
            title="Collapse sidebar"
            aria-expanded="true"
          >
            <ChevronsLeft size={16} aria-hidden="true" />
          </button>
        ) : null}
      </div>
    </nav>
  );
}
