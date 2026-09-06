import { useState } from 'react';
import Icon from './Icon';

const kindLabel = { core: '主線', flex: '彈性', bonus: '加碼' };

function TimelineRow({ item, index }) {
  const [open, setOpen] = useState(false);
  return (
    <li className={`tl-row tl-${item.kind} ${open ? 'is-open' : ''}`}>
      <div className="tl-rail" aria-hidden="true">
        <span className="tl-dot" />
      </div>
      <button
        type="button"
        className="tl-body"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls={`tl-note-${index}`}
      >
        <div className="tl-head">
          <span className="tl-time">{item.time}</span>
          <span className={`chip chip-${item.kind}`}>{kindLabel[item.kind]}</span>
          {item.star ? (
            <span className="chip chip-star">
              <Icon name="star" size={11} />
              必拍
            </span>
          ) : null}
        </div>
        <div className="tl-title-line">
          <h3 className="tl-title">{item.title}</h3>
          <Icon name="chevron" size={16} className="tl-caret" />
        </div>
      </button>
      <div id={`tl-note-${index}`} className="tl-note" hidden={!open}>
        <p>{item.note}</p>
      </div>
    </li>
  );
}

export default function Timeline({ day, coreOnly }) {
  const items = coreOnly ? day.items.filter((i) => i.kind === 'core') : day.items;
  return (
    <ol className="tl">
      {items.map((item, i) => (
        <TimelineRow key={item.time + item.title} item={item} index={`${day.id}-${i}`} />
      ))}
    </ol>
  );
}
