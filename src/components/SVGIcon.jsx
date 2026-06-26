import { useState, useEffect } from 'react';

export const SVGIcon = ({ src, className = '', style = {} }) => {
  const [svgContent, setSvgContent] = useState('');

  useEffect(() => {
    fetch(src)
      .then(res => res.text())
      .then(text => {
        // Remove XML declaration if present
        const cleaned = text.replace(/<\?xml[^?]*\?>/g, '');
        setSvgContent(cleaned);
      })
      .catch(err => console.error('Failed to load SVG:', err));
  }, [src]);

  return (
    <span
      className={`svg-icon inline-flex items-center justify-center ${className}`}
      style={style}
      role="img"
      aria-hidden="true"
      dangerouslySetInnerHTML={{ __html: svgContent }}
    />
  );
};
