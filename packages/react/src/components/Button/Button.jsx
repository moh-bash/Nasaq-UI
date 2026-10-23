/*
  Button — a reusable action control.
*/

import { forwardRef } from 'react';

const Button = forwardRef(function Button({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  align = 'start',
  disabled = false,
  loading = false,
  leadingIcon = null,
  trailingIcon = null,
  type = 'button',
  as: Component = 'button',
  className = '',
  children,
  onClick,
  ...rest
}, ref) {
  const classes = [
    'nq-btn',
    `nq-btn--${variant}`,
    `nq-btn--${size}`,
    fullWidth ? 'nq-btn--full' : `nq-btn--align-${align}`,
    loading ? 'nq-is-loading' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const hasLeading = Boolean(leadingIcon) || loading;
  const hasTrailing = Boolean(trailingIcon) && !loading;
  const isDisabled = disabled || loading;
  const isLink = Component === 'a';

  if (process.env.NODE_ENV !== 'production') {
    const hasChildren = children !== null && children !== undefined && children !== false;
    const hasAriaLabel = rest['aria-label'] || rest['aria-labelledby'];
    if (!hasChildren && !hasAriaLabel) {
      console.warn('Button: icon-only buttons require an aria-label for accessibility.');
    }
  }

  const handleClick = (event) => {
    if (isDisabled) {
      event.preventDefault();
      event.stopPropagation();
      return;
    }
    if (typeof onClick === 'function') {
      onClick(event);
    }
  };

  const elementProps = {
    ref,
    className: classes,
    'aria-busy': loading ? 'true' : undefined,
    'aria-disabled': isDisabled ? 'true' : undefined,
    onClick: handleClick,
    ...rest,
  };

  if (isLink) {
    if (isDisabled) {
      elementProps['aria-disabled'] = 'true';
      elementProps.tabIndex = -1;
    }
    return (
      <Component {...elementProps}>
        {loading ? (
          <span className="nq-btn__spinner" aria-hidden="true" />
        ) : hasLeading ? (
          <span className="nq-btn__icon" aria-hidden="true">
            {leadingIcon}
          </span>
        ) : null}
        {children ? <span className="nq-btn__label">{children}</span> : null}
        {hasTrailing ? (
          <span className="nq-btn__icon" aria-hidden="true">
            {trailingIcon}
          </span>
        ) : null}
      </Component>
    );
  }

  return (
    <Component
      type={type}
      {...elementProps}
      disabled={disabled || loading}
    >
      {loading ? (
        <span className="nq-btn__spinner" aria-hidden="true" />
      ) : hasLeading ? (
        <span className="nq-btn__icon" aria-hidden="true">
          {leadingIcon}
        </span>
      ) : null}
      {children ? <span className="nq-btn__label">{children}</span> : null}
      {hasTrailing ? (
        <span className="nq-btn__icon" aria-hidden="true">
          {trailingIcon}
        </span>
      ) : null}
    </Component>
  );
});

Button.displayName = 'Button';

export default Button;
