import React, { useRef, useState } from 'react';

export function safeExternalUrl(value?: string | null): string | undefined {
  if (!value) return;
  try {
    const url = new URL(value);
    if (url.protocol !== 'https:' || url.username || url.password) return;
    return url.href;
  } catch { return; }
}

export default function InteractiveArtwork({ title, url, desktopRatio, mobileRatio }: {
  title: string; url: string; desktopRatio?: string | null; mobileRatio?: string | null;
}) {
  const stage = useRef<HTMLDivElement>(null);
  const [notice, setNotice] = useState('');
  const source = safeExternalUrl(url);
  const embeddable = source && new URL(source).origin !== window.location.origin;
  const ratios: Record<string, string> = { landscape: '16 / 10', square: '1', portrait: '4 / 5' };
  const style = { '--art-desktop': ratios[desktopRatio || ''] || '16 / 10', '--art-mobile': ratios[mobileRatio || ''] || '1' } as React.CSSProperties;
  async function fullscreen() {
    try { await stage.current?.requestFullscreen(); }
    catch { setNotice('Fullscreen is unavailable. Use Open artwork to view the original.'); }
  }
  return <section className="artwork-player" aria-label={`${title} interactive artwork`}>
    {embeddable ? <div ref={stage} className="artwork-stage" style={style}>
      <iframe key={source} src={source} title={`${title} — interactive artwork by SMLDMS`}
        sandbox="allow-scripts allow-same-origin" allow="autoplay; fullscreen" allowFullScreen
        referrerPolicy="no-referrer" />
    </div> : <p>The embedded artwork is unavailable. Please use its original link.</p>}
    <div className="artwork-controls"><span>SMLDMS / {title}</span><div>
      {embeddable && document.fullscreenEnabled && <button type="button" onClick={fullscreen}>Fullscreen ⛶</button>}
      {source && <a href={source} target="_blank" rel="noopener noreferrer">Open artwork ↗</a>}
    </div></div>
    {notice && <p role="status">{notice}</p>}
  </section>;
}
