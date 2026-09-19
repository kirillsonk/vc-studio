import React from 'react';
import { inputBox } from './inputBox.js';

/** Multi-line field matching TextInput. */
export function Textarea({ error, disabled, rows = 3, style, ...rest }) {
  const [focus, setFocus] = React.useState(false);
  return <textarea rows={rows} disabled={disabled} aria-invalid={error || undefined} onFocus={() => setFocus(true)} onBlur={() => setFocus(false)} style={{ ...inputBox(focus, error, disabled), padding: '14px 16px', resize: 'vertical', lineHeight: 1.55, ...style }} {...rest} />;
}
