/*
  Accordion configuration model — the single source of truth.
  One config object drives: properties inspector, live preview, generated JSX,
  generated CSS, presets and reset.

  Colour values are either `null` (inherit the matching global theme token)
  or an explicit `#hex` override. See COLOR_TOKEN_MAP.
*/

export const CONFIG_VERSION = 2;

/** Which global theme token each accordion colour inherits from. */
export const COLOR_TOKEN_MAP = {
  background: '--color-surface',
  questionBackground: '--color-surface',
  answerBackground: '--color-background',
  questionText: '--color-text',
  answerText: '--color-text-muted',
  headingText: '--color-text',
  borderColor: '--color-border',
  dividerColor: '--color-border',
  iconColor: '--color-primary',
  hoverBackground: '--color-hover',
  openBackground: '--color-active',
  focusColor: '--color-focus',
};

export const DEFAULT_ITEMS = [
  {
    id: 'lh-turnaround',
    question: 'How long does a letterpress job take?',
    answer:
      'Most commercial work ships within ten working days of proof approval. Editions over 500 impressions, foil work, or hand-bound books are scheduled two to three weeks out. If you are working to a fixed date, tell us before you send artwork and we will book the press accordingly.',
    disabled: false,
  },
  {
    id: 'lh-artwork',
    question: 'Do you accept digital files, or do you need film?',
    answer:
      'Vector artwork in PDF, AI, or EPS is ideal — text converted to outlines, spot colours named as the ink we should mix. We also take polymer plates from a 1200 dpi PDF if you are not working with a printer. Film is welcome but no longer required.',
    disabled: false,
  },
  {
    id: 'lh-stock',
    question: 'What paper stocks do you keep on hand?',
    answer:
      'Crane Lettra 110lb and 220lb in fluoro white and pearl, Gmund Cotton 300gsm, and a house mould-made stock in natural white. Anything outside that list we can source, usually with about a week added to the schedule.',
    disabled: false,
  },
  {
    id: 'lh-proof',
    question: 'Can I see a proof before the full run?',
    answer:
      'Yes. Every job includes one digital proof, and press proofs are available on the actual stock for the cost of the make-ready. Colour on cotton stock shifts as the impression bites, so a press proof is the honest record of the finished sheet.',
    disabled: false,
  },
];

export const defaultAccordionConfig = {
  version: CONFIG_VERSION,
  content: {
    title: 'Before you send a job',
    description:
      'Lead times, artwork, stock, and proofs — the four questions that arrive most weeks.',
    showDescription: true,
    numbering: false,
    initialOpenId: '',
    items: DEFAULT_ITEMS,
  },
  layout: {
    widthPercent: 100,
    maxWidth: 640,
    align: 'center',
    itemGap: 0,
    questionPaddingY: 16,
    questionPaddingX: 20,
    answerPadding: 16,
    contentGap: 8,
    sectionGap: 24,
    dividers: true,
    textAlign: 'left',
  },
  /* null = inherit the mapped theme token */
  colors: {
    background: null,
    questionBackground: null,
    answerBackground: null,
    questionText: null,
    answerText: null,
    headingText: null,
    borderColor: null,
    dividerColor: null,
    iconColor: null,
    hoverBackground: null,
    openBackground: null,
    focusColor: null,
  },
  borders: {
    enabled: true,
    width: 1,
    style: 'solid',
    radius: 6,
    itemRadius: 6,
    questionRadius: 6,
    answerBorder: 'none',
    dividerThickness: 1,
    shadow: 'none',
  },
  typography: {
    fontFamily: 'system',
    headingSize: 26,
    questionSize: 16,
    answerSize: 15,
    fontWeight: 500,
    lineHeight: 1.55,
    letterSpacing: 0,
  },
  icons: {
    style: 'chevron',
    size: 18,
    position: 'end',
    rotateWhenOpen: true,
  },
  animation: {
    enabled: true,
    duration: 280,
    easing: 'cubic-bezier(0.2, 0, 0, 1)',
  },
  behavior: {
    allowMultiple: false,
    allowCollapse: true,
    hoverEffect: true,
    wholeRow: true,
  },
};

export function createEmptyConfig() {
  return {
    ...defaultAccordionConfig,
    content: { ...defaultAccordionConfig.content, title: '', description: '', items: [] },
  };
}
