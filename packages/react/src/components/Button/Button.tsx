/*
  Button — a reusable action control.
*/

import {
  forwardRef,
  type ButtonHTMLAttributes,
  type ElementType,
  type MouseEvent,
  type ReactNode,
  type Ref,
} from 'react';

declare const process: { env: { NODE_ENV?: string } };

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg';
export type ButtonAlign = 'start' | 'center' | 'end';

export interface ButtonProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'color'> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  align?: ButtonAlign;
  loading?: boolean;
  leadingIcon?: ReactNode;
  trailingIcon?: ReactNode;
  as?: ElementType;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  {
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
  },
  ref,
) {
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

  const handleClick = (event: MouseEvent<HTMLElement>) => {
    if (isDisabled) {
      event.preventDefault();
      event.stopPropagation();
      return;
    }
    if (typeof onClick === 'function') {
      onClick(event as MouseEvent<HTMLButtonElement>);
    }
  };

  const elementProps: Record<string, unknown> = {
    ref: ref as Ref<HTMLElement>,
    className: classes,
    'aria-busy': loading ? 'true' : undefined,
    'aria-disabled': isDisabled ? 'true' : undefined,
    onClick: handleClick,
    ...rest,
  };

  const content = (
    <>
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
    </>
  );

  if (isLink) {
    if (isDisabled) {
      elementProps['aria-disabled'] = 'true';
      elementProps.tabIndex = -1;
    }
    return <Component {...elementProps}>{content}</Component>;
  }

  return (
    <Component type={type} {...elementProps} disabled={disabled || loading}>
      {content}
    </Component>
  );
});

Button.displayName = 'Button';

export default Button;
