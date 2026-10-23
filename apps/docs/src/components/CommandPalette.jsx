import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Command } from 'cmdk';
import {
  BookOpen,
  Boxes,
  Code2,
  Copy,
  ExternalLink,
  Keyboard,
  Monitor,
  Moon,
  Palette,
  Search,
  Sun,
  Wrench,
} from 'lucide-react';
import { allComponents } from '../registry/componentRegistry.js';
import { useShellStore } from '../stores/shellStore.js';
import { useTheme } from '../hooks/useTheme.js';
import { useShell } from '../layouts/useShell.js';
import { paths } from '../routes.js';
import styles from './CommandPalette.module.css';

const GITHUB_URL = 'https://github.com/moh-bash/Nasaq-UI';

export default function CommandPalette() {
  const navigate = useNavigate();
  const open = useShellStore((state) => state.commandOpen);
  const setOpen = useShellStore((state) => state.setCommandOpen);
  const recentIds = useShellStore((state) => state.recentCommandIds);
  const pushRecent = useShellStore((state) => state.pushRecentCommand);
  const setHelpOpen = useShellStore((state) => state.setHelpOpen);
  const { setMode } = useTheme();
  const { focusSidebarSearch, toggleCollapsed } = useShell();

  const commands = useMemo(() => {
    const list = [];

    for (const component of allComponents) {
      const id = `component:${component.id}:docs`;
      list.push({
        id,
        group: 'Components',
        label: `${component.name} docs`,
        hint: component.status === 'ready' ? 'Documentation' : 'Planned',
        icon: Boxes,
        keywords: `${component.name} ${component.id} ${component.category}`,
        run: () => navigate(paths.componentDocs(component.id)),
      });
      if (component.status === 'ready') {
        list.push({
          id: `component:${component.id}:playground`,
          group: 'Components',
          label: `${component.name} playground`,
          hint: 'Live studio',
          icon: Wrench,
          keywords: `${component.name} ${component.id} playground studio`,
          run: () => navigate(paths.playground(component.id)),
        });
      }
    }

    const pages = [
      { label: 'Docs start', to: paths.docs, icon: BookOpen },
      { label: 'Installation', to: paths.installation, icon: Code2 },
      { label: 'Theming', to: paths.theming, icon: Palette },
      { label: 'All components', to: paths.components, icon: Boxes },
    ];
    for (const page of pages) {
      list.push({
        id: `page:${page.to}`,
        group: 'Pages',
        label: page.label,
        hint: page.to,
        icon: page.icon,
        keywords: page.label,
        run: () => navigate(page.to),
      });
    }

    list.push(
      {
        id: 'action:theme-light',
        group: 'Actions',
        label: 'Use light theme',
        hint: 'Theme',
        icon: Sun,
        keywords: 'theme light mode appearance',
        run: () => setMode('light'),
      },
      {
        id: 'action:theme-dark',
        group: 'Actions',
        label: 'Use dark theme',
        hint: 'Theme',
        icon: Moon,
        keywords: 'theme dark mode appearance',
        run: () => setMode('dark'),
      },
      {
        id: 'action:theme-system',
        group: 'Actions',
        label: 'Follow system theme',
        hint: 'Theme',
        icon: Monitor,
        keywords: 'theme system auto mode appearance',
        run: () => setMode('system'),
      },
      {
        id: 'action:copy',
        group: 'Actions',
        label: 'Copy current generated code',
        hint: '⌘/Ctrl Shift C',
        icon: Copy,
        keywords: 'copy clipboard code',
        run: () => window.dispatchEvent(new CustomEvent('nq:copy-primary')),
      },
      {
        id: 'action:search',
        group: 'Actions',
        label: 'Search components',
        hint: '/',
        icon: Search,
        keywords: 'search sidebar find navigate',
        run: () => focusSidebarSearch(),
      },
      {
        id: 'action:sidebar',
        group: 'Actions',
        label: 'Toggle component sidebar',
        hint: '[',
        icon: Boxes,
        keywords: 'sidebar collapse rail toggle',
        run: () => toggleCollapsed(),
      },
      {
        id: 'action:shortcuts',
        group: 'Actions',
        label: 'Keyboard shortcuts',
        hint: '?',
        icon: Keyboard,
        keywords: 'keyboard shortcuts help keys',
        run: () => setHelpOpen(true),
      },
      {
        id: 'action:github',
        group: 'Actions',
        label: 'Open GitHub repository',
        hint: 'External',
        icon: ExternalLink,
        keywords: 'github source repository external',
        run: () => window.open(GITHUB_URL, '_blank', 'noopener,noreferrer'),
      },
    );

    return list;
  }, [focusSidebarSearch, navigate, setHelpOpen, setMode, toggleCollapsed]);

  const commandMap = useMemo(() => new Map(commands.map((entry) => [entry.id, entry])), [commands]);
  const recent = recentIds.map((id) => commandMap.get(id)).filter(Boolean);
  const normal = commands.filter((entry) => !recentIds.includes(entry.id));

  const run = (entry) => {
    if (!entry) return;
    pushRecent(entry.id);
    setOpen(false);
    // Let the dialog finish closing before route changes steal focus.
    requestAnimationFrame(() => entry.run());
  };

  const renderItem = (entry) => {
    const Icon = entry.icon;
    return (
      <Command.Item
        key={entry.id}
        value={`${entry.label} ${entry.keywords || ''} ${entry.hint || ''}`}
        onSelect={() => run(entry)}
      >
        <Icon size={14} aria-hidden="true" />
        <span>{entry.label}</span>
        {entry.hint ? <kbd>{entry.hint}</kbd> : null}
      </Command.Item>
    );
  };

  return (
    <Command.Dialog
      open={open}
      onOpenChange={setOpen}
      label="Command palette"
      loop
      className={styles.dialog}
      overlayClassName={styles.overlay}
      contentClassName={styles.content}
    >
      <div className={styles.inputRow}>
        <Search size={15} aria-hidden="true" />
        <Command.Input placeholder="Search components, pages, and actions…" autoFocus />
        <kbd>Esc</kbd>
      </div>
      <Command.List className={styles.list}>
        <Command.Empty className={styles.empty}>No matches. Try “button” or “theme”.</Command.Empty>
        {recent.length ? (
          <Command.Group heading="Recent" className={styles.group}>
            {recent.map(renderItem)}
          </Command.Group>
        ) : null}
        {['Components', 'Pages', 'Actions'].map((group) => {
          const items = normal.filter((entry) => entry.group === group);
          if (!items.length) return null;
          return (
            <Command.Group key={group} heading={group} className={styles.group}>
              {items.map(renderItem)}
            </Command.Group>
          );
        })}
      </Command.List>
      <div className={styles.footer}>
        <span>
          <kbd>↑</kbd>
          <kbd>↓</kbd> to move
        </span>
        <span>
          <kbd>↵</kbd> to open
        </span>
        <span>Nasaq UI</span>
      </div>
    </Command.Dialog>
  );
}
