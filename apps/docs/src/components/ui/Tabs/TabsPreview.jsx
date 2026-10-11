import { Tabs } from 'nasaq';

export default function TabsPreview({ config }) {
  return (
    <Tabs
      items={config.content.items}
      defaultActiveId={config.content.defaultActiveId}
      variant={config.variant}
      align={config.layout.align}
    />
  );
}
