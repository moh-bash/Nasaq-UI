import { useId, useRef, useState } from 'react';

export default function Tabs({
  items = [],
  defaultActiveId = '',
  value,
  onValueChange,
  variant = 'underline',
  align = 'start',
  label,
  orientation = 'horizontal',
  emptyState = null,
  className = '',
}) {
  const uid = useId().replace(/[^a-zA-Z0-9_-]/g, '');
  const isControlled = value !== undefined;
  const initial = defaultActiveId && items.some((item) => item.id === defaultActiveId)
    ? defaultActiveId
    : items[0]?.id || '';
  const [uncontrolledActiveId, setUncontrolledActiveId] = useState(initial);
  const activeId = isControlled ? value : uncontrolledActiveId;
  const activeItem = items.find((item) => item.id === activeId) || items[0];
  const rootClass = ['nq-tabs', `nq-tabs--${variant}`, `nq-tabs--align-${align}`, className]
    .filter(Boolean)
    .join(' ');
  const listRef = useRef(null);
  const tabRefs = useRef({});

  const setActive = (id) => {
    if (!isControlled) {
      setUncontrolledActiveId(id);
    }
    if (typeof onValueChange === 'function') {
      onValueChange(id);
    }
  };

  const getDirection = () => {
    try {
      const el = listRef.current || document.documentElement;
      const dir = window.getComputedStyle(el).direction;
      return dir === 'rtl' ? 'rtl' : 'ltr';
    } catch {
      return 'ltr';
    }
  };

  if (!items.length) {
    return (
      <div className={rootClass}>
        {emptyState ? <div className="nq-tabs-empty">{emptyState}</div> : null}
      </div>
    );
  }

  return (
    <div className={rootClass} dir={getDirection() === 'rtl' ? 'rtl' : undefined}>
      <div
        ref={listRef}
        className="nq-tabs-list"
        role="tablist"
        aria-label={label || undefined}
        aria-orientation={orientation}
      >
        {items.map((item) => {
          const selected = item.id === activeItem?.id;
          return (
            <button
              key={item.id}
              ref={(el) => {
                tabRefs.current[item.id] = el;
              }}
              id={`${uid}-tab-${item.id}`}
              type="button"
              role="tab"
              aria-selected={selected}
              aria-controls={`${uid}-panel-${item.id}`}
              tabIndex={selected ? 0 : -1}
              disabled={item.disabled}
              onClick={() => setActive(item.id)}
              onKeyDown={(event) => {
                const keys = orientation === 'vertical'
                  ? ['ArrowUp', 'ArrowDown', 'Home', 'End']
                  : ['ArrowRight', 'ArrowLeft', 'Home', 'End'];
                if (!keys.includes(event.key)) return;
                event.preventDefault();
                const enabled = items.filter((entry) => !entry.disabled);
                if (enabled.length === 0) return;
                const current = enabled.findIndex((entry) => entry.id === item.id);
                const dir = getDirection();
                let next;
                if (event.key === 'Home') {
                  next = enabled[0];
                } else if (event.key === 'End') {
                  next = enabled.at(-1);
                } else if (orientation === 'vertical') {
                  next = enabled[(current + (event.key === 'ArrowDown' ? 1 : -1) + enabled.length) % enabled.length];
                } else {
                  const forward = dir === 'rtl' ? event.key === 'ArrowLeft' : event.key === 'ArrowRight';
                  next = enabled[(current + (forward ? 1 : -1) + enabled.length) % enabled.length];
                }
                setActive(next.id);
                tabRefs.current[next.id]?.focus();
              }}
            >
              {item.label}
            </button>
          );
        })}
      </div>
      <div
        id={`${uid}-panel-${activeItem.id}`}
        className="nq-tabs-panel"
        role="tabpanel"
        aria-labelledby={`${uid}-tab-${activeItem.id}`}
        tabIndex={0}
      >
        {activeItem.content}
      </div>
    </div>
  );
}
