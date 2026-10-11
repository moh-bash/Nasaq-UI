import { useMemo } from 'react';
import { useTheme } from '../../providers/ThemeProvider.jsx';
import LivePreview from './LivePreview.jsx';

/* Renders a component at a fixed configuration with its generated stylesheet,
   isolated in a shadow root. Used by the docs and marketing pages. */
export default function ComponentPreview({ component, config, className }) {
  const { resolved } = useTheme();
  const css = useMemo(() => {
    const output = component.generators.css(config, resolved);
    return output.files.find((file) => file.id === 'css')?.code || '';
  }, [component, config, resolved]);

  const Preview = component.Preview;
  return (
    <LivePreview css={css} className={className}>
      <Preview config={config} />
    </LivePreview>
  );
}
