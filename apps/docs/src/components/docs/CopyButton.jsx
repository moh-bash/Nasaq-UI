import { Check, Copy } from 'lucide-react';
import { useClipboard } from '../../hooks/useClipboard.js';

/** Small pill button that copies {@link text} and flashes "Copied". */
export default function CopyButton({ text, label = 'Copy', className }) {
  const { copy, status } = useClipboard();
  const copied = status === 'copied';
  return (
    <button type="button" className={className} onClick={() => copy(text)}>
      {copied ? <Check size={12} aria-hidden="true" /> : <Copy size={12} aria-hidden="true" />}
      {copied ? 'Copied' : label}
    </button>
  );
}