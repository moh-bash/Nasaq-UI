import { useId, useState } from 'react';

export default function Tabs({
  items = [],
  defaultActiveId = '',
  variant = 'underline',
  align = 'start',
  className = '',
}) {
  const uid = useId().replace(/[^a-zA-Z0-9_-]/g, '');
  const initial = defaultActiveId && items.some((item) => item.id === defaultActiveId)
    ? defaultActiveId
    : items[0]?.id || '';
  const [activeId, setActiveId] = useState(initial);
  const activeItem = items.find((item) => item.id === activeId) || items[0];
  const rootClass = ['tabs', `tabs--${variant}`, `tabs--align-${align}`, className].filter(Boolean).join(' ');

  if (!items.length) {
    return <div className={rootClass}><p className="tabs-empty">Add tabs from the inspector.</p></div>;
  }

  return (
    <div className={rootClass}>
      <div className="tabs-list" role="tablist" aria-label="Content tabs">
        {items.map((item) => {
          const selected = item.id === activeItem?.id;
          return (
            <button
              key={item.id}
              id={`${uid}-tab-${item.id}`}
              type="button"
              role="tab"
              aria-selected={selected}
              aria-controls={`${uid}-panel-${item.id}`}
              tabIndex={selected ? 0 : -1}
              disabled={item.disabled}
              onClick={() => setActiveId(item.id)}
              onKeyDown={(event) => {
                if (!['ArrowRight', 'ArrowLeft', 'Home', 'End'].includes(event.key)) return;
                event.preventDefault();
                const enabled = items.filter((entry) => !entry.disabled);
                const current = enabled.findIndex((entry) => entry.id === item.id);
                const next = event.key === 'Home'
                  ? enabled[0]
                  : event.key === 'End'
                    ? enabled.at(-1)
                    : enabled[(current + (event.key === 'ArrowRight' ? 1 : -1) + enabled.length) % enabled.length];
                setActiveId(next.id);
                document.getElementById(`${uid}-tab-${next.id}`)?.focus();
              }}
            >
              {item.label}
            </button>
          );
        })}
      </div>
      <div
        id={`${uid}-panel-${activeItem.id}`}
        className="tabs-panel"
        role="tabpanel"
        aria-labelledby={`${uid}-tab-${activeItem.id}`}
        tabIndex={0}
      >
        {activeItem.content}
      </div>
    </div>
  );
}
