import Button from './Button.jsx';
import ButtonIcon from './ButtonIcon.jsx';
import { hasIcon } from '../../../config/buttonIcons.js';

/* Maps a Button configuration to the reusable component's props. */
export default function ButtonPreview({ config }) {
  const { content, layout } = config;
  return (
    <Button
      variant={config.variant}
      size={config.size}
      fullWidth={layout.fullWidth}
      align={layout.align}
      disabled={content.disabled}
      loading={content.loading}
      leadingIcon={hasIcon(content.leadingIcon) ? <ButtonIcon name={content.leadingIcon} /> : null}
      trailingIcon={hasIcon(content.trailingIcon) ? <ButtonIcon name={content.trailingIcon} /> : null}
    >
      {content.label}
    </Button>
  );
}
