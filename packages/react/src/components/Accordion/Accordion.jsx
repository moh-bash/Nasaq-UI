import { useId, useState } from 'react';

/*
  Accordion — a dependency-free, accessible Q&A list.

  Appearance is driven entirely by the matching Accordion.css file (generated
  by the playground, or written by hand). Structure and behaviour are props.

  <Accordion
    items={[{ id, question, answer, disabled }]}
    title="Before you send a job"
    description="Lead times, artwork, stock, and proofs."
    numbered={false}
    icon="chevron"        // chevron | plus | arrow | number | none
    iconPosition="end"    // start | end
    allowMultiple={false} // one open at a time
    allowCollapse={true}  // clicking the open row can close it
    defaultOpenId=""
  />
*/

function Indicator({ icon, index }) {
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
  emptyState = null,
  className = '',
}) {
  const uid = useId().replace(/[^a-zA-Z0-9_-]/g, '');
  const [openIds, setOpenIds] = useState(() =>
    defaultOpenId && items.some((item) => item.id === defaultOpenId) ? [defaultOpenId] : [],
  );

  const toggle = (id) => {
    setOpenIds((current) => {
      const isOpen = current.includes(id);
      if (isOpen) {
        if (!allowCollapse && current.length === 1) return current;
        return current.filter((entry) => entry !== id);
      }
      return allowMultiple ? [...current, id] : [id];
    });
  };

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
            const isOpen = openIds.includes(item.id);
            const triggerId = `${uid}-trigger-${item.id}`;
            const panelId = `${uid}-panel-${item.id}`;
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
                    id={triggerId}
                    className="nq-acc-trigger"
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                    disabled={item.disabled}
                    onClick={() => toggle(item.id)}
                  >
                    {showNumbering ? (
                      <span className="nq-acc-index" aria-hidden="true">
                        {String(index + 1).padStart(2, '0')}
                      </span>
                    ) : null}
                    <span className="nq-acc-question">{item.question}</span>
                    {icon !== 'none' ? (
                      <span className={`nq-acc-icon nq-acc-icon--${icon}`} aria-hidden="true">
                        <Indicator icon={icon} index={index} />
                      </span>
                    ) : null}
                  </button>
                </div>
                <div className="nq-acc-panel" id={panelId} role="region" aria-labelledby={triggerId}>
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
