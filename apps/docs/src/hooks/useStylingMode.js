import { usePlaygroundStore } from '../stores/playgroundStore.js';

/*
  Styling mode lives in the playground store. Components read only the mode and
  the setter, so a viewport change never re-renders the code panel.
*/
export function useStylingMode() {
  const mode = usePlaygroundStore((state) => state.stylingMode);
  const setMode = usePlaygroundStore((state) => state.setStylingMode);
  return { mode, setMode };
}
