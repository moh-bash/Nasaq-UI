import { useCallback, useRef, useState } from 'react';
import { copyText } from '../utils/clipboard.js';

/** Copy-to-clipboard with transient feedback: status is 'idle' | 'copied' | 'failed'. */
export function useClipboard(resetAfter = 1600) {
  const [status, setStatus] = useState('idle');
  const timer = useRef(null);

  const copy = useCallback(
    async (text) => {
      const ok = await copyText(text);
      setStatus(ok ? 'copied' : 'failed');
      if (timer.current) clearTimeout(timer.current);
      timer.current = setTimeout(() => setStatus('idle'), resetAfter);
      return ok;
    },
    [resetAfter],
  );

  return { copy, status };
}
