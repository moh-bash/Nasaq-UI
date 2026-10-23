/*
  Canonical route builders. Everything in the docs app (sidebar, header,
  pagers, cards, tests) should use these instead of re-typing path strings.
  Legacy URLs stay handled by the redirects in app/App.jsx.
*/

export const paths = {
  home: '/',
  docs: '/docs',
  installation: '/docs/installation',
  theming: '/docs/theming',
  components: '/docs/components',
  componentDocs: (id) => `/docs/components/${id}`,
  playground: (id) => `/docs/components/${id}/playground`,
  theme: '/docs/theming',
};

export const routePatterns = {
  component: '/docs/components/:componentId',
  playground: '/docs/components/:componentId/playground',
};
