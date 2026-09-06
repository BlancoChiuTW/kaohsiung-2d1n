import { useState } from 'react';
import Icon from './Icon';
import Photo from './Photo';

const kindLabel = { core: '主線', flex: '彈性' };

function TimelineRow({ item, index, eager }) {
  const [open, setOpen] = useState(false);
  return (
    <li className={`tl-row tl-${item.kind} ${open ? 'is-open' : ''}`}>
      <div className="tl-rail" aria-hidden="true">
        <span className="tl-dot" />
      </div>
      <div className="tl-main">
        <button
          type="button"
          className="tl-head-btn"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls={`tl-note-${index}`}
        >
          <span className="tl-head">
            <span className="tl-time">{item.time}</span>
            <span className={`chip chip-${item.kind}`}>{kindLabel[item.kind]}</span>
          </span>
          <span className="tl-title-line">
            <span className="tl-title">{item.title}</span>
            <Icon name="chevron" size={15} className="tl-caret" />
          </span>
        </button>

        {item.photo ? <Photo id={item.photo} alt={item.title} eager={eager} /> : null}

        <div id={`tl-note-${index}`} className="tl-note" hidden={!open}>
          <p>{item.note}</p>
        </div>
      </div>
    </li>
  );
}

export default function Timeline({ day, coreOnly }) {
  const items = coreOnly ? day.items.filter((i) => i.kind === 'core') : day.items;
  return (
    <ol className="tl">
      {items.map((item, i) => (
        <TimelineRow
          key={item.time + item.title}
          item={item}
          index={`${day.id}-${i}`}
          eager={day.id === 'day1' && i < 2}
        />
      ))}
    </ol>
  );
}
