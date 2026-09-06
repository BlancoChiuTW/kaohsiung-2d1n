import { useEffect, useMemo, useState } from 'react';
import Icon from './Icon';
import { categories, options } from '../data/trip';

const STORE_KEY = 'kh2d1n.picked.v1';

const catIcon = {
  photo: 'photo',
  night: 'night',
  food: 'food',
  indoor: 'indoor',
  sea: 'sea',
};

function readStore() {
  try {
    const raw = localStorage.getItem(STORE_KEY);
    return raw ? new Set(JSON.parse(raw)) : new Set();
  } catch {
    return new Set();
  }
}

export default function OptionPool() {
  const [picked, setPicked] = useState(readStore);
  const [filter, setFilter] = useState('all');
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

  const shown = useMemo(
    () =>
      options.filter(
        (o) =>
          (filter === 'all' || o.cats.includes(filter)) &&
          (!onlyPicked || picked.has(o.id)),
      ),
    [filter, onlyPicked, picked],
  );

  return (
    <div className="pool">
      <div className="pool-bar" role="group" aria-label="加碼分類篩選">
        <div className="chiprow">
          <button
            type="button"
            className={`fchip ${filter === 'all' ? 'is-on' : ''}`}
            onClick={() => setFilter('all')}
          >
            全部
          </button>
          {categories.map((c) => (
            <button
              key={c.id}
              type="button"
              className={`fchip ${filter === c.id ? 'is-on' : ''}`}
              onClick={() => setFilter(c.id)}
            >
              <Icon name={catIcon[c.id]} size={13} />
              {c.label}
            </button>
          ))}
        </div>
      </div>

      <div className="pool-meta">
        <span className="pool-count">
          已選 <strong>{picked.size}</strong> / {options.length}
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

      {shown.length === 0 ? (
        <p className="empty">這個條件下沒有項目，換一個分類看看。</p>
      ) : (
        <ul className="cards">
          {shown.map((o) => {
            const on = picked.has(o.id);
            return (
              <li key={o.id} className={`card ${on ? 'is-picked' : ''}`}>
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
                  <h3 className="card-name">{o.name}</h3>
                  <div className="card-cats">
                    {o.cats.map((c) => (
                      <span key={c} className="minicat">
                        <Icon name={catIcon[c]} size={11} />
                        {categories.find((x) => x.id === c)?.label}
                      </span>
                    ))}
                  </div>
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
                    <div>
                      <dt>
                        <Icon name="wallet" size={13} />
                      </dt>
                      <dd>{o.cost}</dd>
                    </div>
                  </dl>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
