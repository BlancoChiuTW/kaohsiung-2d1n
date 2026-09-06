import { useEffect, useMemo, useState } from 'react';
import Icon from './Icon';
import Photo from './Photo';
import { placeGroups } from '../data/trip';

const STORE_KEY = 'kh2d1n.picked.v1';
const ALL = placeGroups.flatMap((g) => g.places);

function readStore() {
  try {
    const raw = localStorage.getItem(STORE_KEY);
    return raw ? new Set(JSON.parse(raw)) : new Set();
  } catch {
    return new Set();
  }
}

export default function Places() {
  const [picked, setPicked] = useState(readStore);
  const [onlyPicked, setOnlyPicked] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem(STORE_KEY, JSON.stringify([...picked]));
    } catch {
      /* 無痕模式或封鎖儲存時忽略 */
    }
  }, [picked]);

  const toggle = (id) =>
    setPicked((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  const groups = useMemo(
    () =>
      placeGroups
        .map((g) => ({ ...g, places: onlyPicked ? g.places.filter((p) => picked.has(p.id)) : g.places }))
        .filter((g) => g.places.length > 0),
    [onlyPicked, picked],
  );

  return (
    <div className="places">
      <div className="pool-meta">
        <span className="pool-count">
          已選 <strong>{picked.size}</strong> / {ALL.length}
        </span>
        <div className="pool-actions">
          <button
            type="button"
            className={`tinybtn ${onlyPicked ? 'is-on' : ''}`}
            onClick={() => setOnlyPicked((v) => !v)}
          >
            只看已選
          </button>
          {picked.size > 0 ? (
            <button type="button" className="tinybtn" onClick={() => setPicked(new Set())}>
              清空
            </button>
          ) : null}
        </div>
      </div>

      {groups.length === 0 ? (
        <p className="empty">還沒有勾任何一個。</p>
      ) : (
        groups.map((g) => (
          <section key={g.id} className="batch">
            <h3 className="batch-title">
              {g.label}
              <span className="batch-sub">{g.sub}</span>
            </h3>
            <ul className="cards">
              {g.places.map((o) => {
                const on = picked.has(o.id);
                return (
                  <li key={o.id} className={`card ${on ? 'is-picked' : ''}`}>
                    {o.photo ? <Photo id={o.photo} alt={o.name} className="photo-card" /> : null}
                    <div className="card-body">
                      <button
                        type="button"
                        className="card-check"
                        onClick={() => toggle(o.id)}
                        aria-pressed={on}
                        aria-label={`${on ? '取消選取' : '加入'} ${o.name}`}
                      >
                        <Icon name="check" size={15} strokeWidth={2.6} />
                      </button>
                      <div className="card-main">
                        <h4 className="card-name">{o.name}</h4>
                        <p className="card-why">{o.why}</p>
                        <dl className="card-facts">
                          <div>
                            <dt>
                              <Icon name="pin" size={13} />
                            </dt>
                            <dd>{o.where}</dd>
                          </div>
                          <div>
                            <dt>
                              <Icon name="clock" size={13} />
                            </dt>
                            <dd>{o.time}</dd>
                          </div>
                        </dl>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          </section>
        ))
      )}
    </div>
  );
}
