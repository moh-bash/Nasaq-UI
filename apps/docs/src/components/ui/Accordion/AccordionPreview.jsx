import { Accordion } from 'nasaq';

/* Maps an Accordion configuration to the reusable component's props, so the
   live preview always exercises the real, exported component. */
export default function AccordionPreview({ config }) {
  const { content, icons, behavior } = config;
  return (
    <Accordion
      items={content.items}
      title={content.title}
      description={content.showDescription ? content.description : ''}
      numbered={content.numbering}
      icon={icons.style}
      iconPosition={icons.position}
      allowMultiple={behavior.allowMultiple}
      allowCollapse={behavior.allowCollapse}
      defaultOpenId={content.initialOpenId}
    />
  );
}
