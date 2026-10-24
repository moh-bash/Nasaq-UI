import { useId, useRef, useState, type KeyboardEvent, type ReactNode } from 'react';

/*
  Accordion — a dependency-free, accessible Q&A list.
*/

export type AccordionIcon = 'chevron' | 'arrow' | 'plus' | 'number' | 'none';

export interface AccordionItem {
  id: string;
  question: string;
  answer: ReactNode;
  disabled?: boolean;
}

export interface AccordionProps {
  items?: AccordionItem[];
  title?: string;
  description?: string;
  numbered?: boolean;
  icon?: AccordionIcon;
  iconPosition?: 'start' | 'end';
  allowMultiple?: boolean;
  allowCollapse?: boolean;
  defaultOpenId?: string;
  value?: string[];
  onValueChange?: (value: string[]) => void;
  emptyState?: ReactNode;
  className?: string;
}

function Indicator({ icon, index }: { icon: AccordionIcon; index: number }) {
  if (icon === 'chevron') {
    return (
      <svg viewBox="0 0 24 24" width="100%" height="100%" focusable="false" aria-hidden="true">
        <path
          d="M6 9l6 6 6-6"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }
  if (icon === 'arrow') {
    return (
      <svg viewBox="0 0 24 24" width="100%" height="100%" focusable="false" aria-hidden="true">
        <path
          d="M5 12h13M13 6l6 6-6 6"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }
  if (icon === 'plus') {
    return (
      <span className="nq-acc-plus" aria-hidden="true">
        <span className="nq-acc-plus__bar nq-acc-plus__bar--h" />
        <span className="nq-acc-plus__bar nq-acc-plus__bar--v" />
      </span>
    );
  }
  if (icon === 'number') {
    return (
      <span className="nq-acc-numeral" aria-hidden="true">
        {String(index + 1).padStart(2, '0')}
      </span>
    );
  }
  return null;
}

export default function Accordion({
  items = [],
  title = '',
  description = '',
  numbered = false,
  icon = 'chevron',
  iconPosition = 'end',
  allowMultiple = false,
  allowCollapse = true,
  defaultOpenId = '',
  value,
  onValueChange,
  emptyState = null,
  className = '',
}: AccordionProps) {
  const uid = useId().replace(/[^a-zA-Z0-9_-]/g, '');
  const isControlled = Array.isArray(value);
  const [uncontrolledOpenIds, setUncontrolledOpenIds] = useState<string[]>(() =>
    defaultOpenId && items.some((item) => item.id === defaultOpenId) ? [defaultOpenId] : [],
  );
  const openIds = isControlled ? value : uncontrolledOpenIds;
  const triggerRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  const setOpenIdsState = (updater: string[] | ((current: string[]) => string[])) => {
    if (isControlled) {
      const next = typeof updater === 'function' ? updater(value || []) : updater;
      if (typeof onValueChange === 'function') {
        onValueChange(next);
      }
      return;
    }
    setUncontrolledOpenIds(updater);
  };

  const toggle = (id: string) => {
    setOpenIdsState((current) => {
      const isOpen = current.includes(id);
      if (isOpen) {
        if (!allowCollapse && current.length === 1) return current;
        return current.filter((entry) => entry !== id);
      }
      return allowMultiple ? [...current, id] : [id];
    });
  };

  const enabledItems = items.filter((item) => !item.disabled);

  const showNumbering = numbered && icon !== 'number';
  const rootClass = ['nq-acc', `nq-acc--icon-${iconPosition}`, allowMultiple ? 'nq-acc--multi' : 'nq-acc--single', className]
    .filter(Boolean)
    .join(' ');

  const hasHeading = Boolean(title || description);

  return (
    <div className={rootClass}>
      {hasHeading && (
        <header className="nq-acc-head">
          {title ? <h3 className="nq-acc-title">{title}</h3> : null}
          {description ? <p className="nq-acc-desc">{description}</p> : null}
        </header>
      )}

      {items.length === 0 ? (
        emptyState ? <div className="nq-acc-empty">{emptyState}</div> : null
      ) : (
        <div className="nq-acc-list">
          {items.map((item, index) => {
            const isOpen = openIds?.includes(item.id) || false;
            const triggerId = `${uid}-trigger-${item.id}`;
            const panelId = `${uid}-panel-${item.id}`;
            const currentEnabledIndex = enabledItems.findIndex((entry) => entry.id === item.id);
            return (
              <div
                key={item.id}
                className={['nq-acc-item', isOpen ? 'nq-is-open' : '', item.disabled ? 'nq-is-disabled' : '']
                  .filter(Boolean)
                  .join(' ')}
              >
                <div className="nq-acc-item__header">
                  <button
                    type="button"
                    ref={(el) => {
                      triggerRefs.current[item.id] = el;
                    }}
                    id={triggerId}
                    className="nq-acc-trigger"
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                    disabled={item.disabled}
                    onClick={() => toggle(item.id)}
                    onKeyDown={(event: KeyboardEvent<HTMLButtonElement>) => {
                      if (item.disabled) return;
                      if (!['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(event.key)) return;
                      event.preventDefault();
                      if (enabledItems.length === 0) return;
                      let next: AccordionItem | undefined;
                      if (event.key === 'Home') next = enabledItems[0];
                      else if (event.key === 'End') next = enabledItems.at(-1);
                      else if (event.key === 'ArrowDown') next = enabledItems[(currentEnabledIndex + 1) % enabledItems.length];
                      else next = enabledItems[(currentEnabledIndex - 1 + enabledItems.length) % enabledItems.length];
                      if (next) triggerRefs.current[next.id]?.focus();
                    }}
                  >
                    {showNumbering ? (
                      <span className="nq-acc-index" aria-hidden="true">
                        {String(index + 1).padStart(2, '0')}
                      </span>
                    ) : null}
                    <span className="nq-acc-question">{item.question}</span>
                    {icon !== 'none' ? (
                      <span
                        className={[
                          'nq-acc-icon',
                          icon === 'chevron' || icon === 'arrow' ? `nq-acc-icon--${icon}` : '',
                        ]
                          .filter(Boolean)
                          .join(' ')}
                        aria-hidden="true"
                      >
                        <Indicator icon={icon} index={index} />
                      </span>
                    ) : null}
                  </button>
                </div>
                <div
                  className="nq-acc-panel"
                  id={panelId}
                  role={items.length <= 6 ? 'region' : undefined}
                  aria-labelledby={triggerId}
                >
                  <div className="nq-acc-panel__inner">
                    <div className="nq-acc-answer">{item.answer}</div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
