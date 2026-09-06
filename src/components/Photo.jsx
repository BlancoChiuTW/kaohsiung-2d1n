import Icon from './Icon';
import { photos } from '../data/photos';

// 圖片一律連回 Wikimedia Commons 的檔案頁，那裡有完整授權與作者。
export default function Photo({ id, alt, className = '', eager = false }) {
  const p = photos[id];
  if (!p) return null;
  return (
    <a
      className={`photo ${className}`}
      href={p.source}
      target="_blank"
      rel="noopener noreferrer"
      title={`來源：${p.title}`}
    >
      <img
        src={p.large}
        srcSet={`${p.small} 640w, ${p.large} 1280w`}
        sizes="(max-width: 600px) 100vw, 560px"
        alt={alt}
        width="1280"
        height="853"
        loading={eager ? 'eager' : 'lazy'}
        decoding="async"
      />
      <span className="photo-credit">
        {p.area ? <span className="photo-tag">街區照．{p.area}</span> : null}
        <Icon name="link" size={10} strokeWidth={2} />
        {p.author}．{p.license}
      </span>
    </a>
  );
}
