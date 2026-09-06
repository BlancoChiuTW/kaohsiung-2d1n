import { useEffect, useRef, useState } from 'react';
import Icon from './components/Icon';
import Timeline from './components/Timeline';
import OptionPool from './components/OptionPool';
import {
  beforeYouGo,
  budget,
  days,
  goldenHours,
  meta,
  planB,
  transit,
} from './data/trip';
import './App.css';

const SECTIONS = [
  { id: 'day1', label: 'Day 1' },
  { id: 'day2', label: 'Day 2' },
  { id: 'pool', label: '加碼' },
  { id: 'light', label: '光線' },
  { id: 'planb', label: '備案' },
  { id: 'info', label: '情報' },
];

function useScrollProgress() {
  const [p, setP] = useState(0);
  useEffect(() => {
    const onScroll = () => {
      const h = document.documentElement.scrollHeight - window.innerHeight;
      setP(h > 0 ? Math.min(1, Math.max(0, window.scrollY / h)) : 0);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  return p;
}

function useActiveSection() {
  const [active, setActive] = useState('day1');
  useEffect(() => {
    const els = SECTIONS.map((s) => document.getElementById(s.id)).filter(Boolean);
    const io = new IntersectionObserver(
      (entries) => {
        const vis = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (vis[0]) setActive(vis[0].target.id);
      },
      { rootMargin: '-96px 0px -58% 0px', threshold: 0 },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
  return active;
}

function SectionHead({ kicker, title, lead, icon }) {
  return (
    <header className="sec-head">
      {kicker ? (
        <p className="kicker">
          {icon ? <Icon name={icon} size={13} /> : null}
          {kicker}
        </p>
      ) : null}
      <h2 className="sec-title">{title}</h2>
      {lead ? <p className="sec-lead">{lead}</p> : null}
    </header>
  );
}

export default function App() {
  const progress = useScrollProgress();
  const active = useActiveSection();
  const [coreOnly, setCoreOnly] = useState(false);
  const navRef = useRef(null);

  useEffect(() => {
    const nav = navRef.current;
    if (!nav) return;
    const el = nav.querySelector('.is-active');
    if (el) el.scrollIntoView({ inline: 'center', block: 'nearest', behavior: 'smooth' });
  }, [active]);

  const jump = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <>
      <div className="progress" style={{ transform: `scaleX(${progress})` }} aria-hidden="true" />

      <nav className="navbar" ref={navRef} aria-label="章節導覽">
        <div className="navbar-inner">
          {SECTIONS.map((s) => (
            <button
              key={s.id}
              type="button"
              className={`navchip ${active === s.id ? 'is-active' : ''}`}
              onClick={() => jump(s.id)}
            >
              {s.label}
            </button>
          ))}
        </div>
      </nav>

      <main className="wrap">
        <header className="hero">
          <p className="hero-kicker">兩天一夜．九月．一個人也很好</p>
          <h1 className="hero-title">{meta.title}</h1>
          <p className="hero-sub">{meta.subtitle}</p>
          <p className="hero-lead">{meta.lead}</p>
          <dl className="anchors">
            {meta.anchors.map((a) => (
              <div key={a.k}>
                <dt>{a.k}</dt>
                <dd>{a.v}</dd>
              </div>
            ))}
          </dl>
          <ul className="premise">
            {meta.premise.map((t) => (
              <li key={t}>
                <Icon name="info" size={14} />
                <span>{t}</span>
              </li>
            ))}
          </ul>
        </header>

        <div className="toolbar">
          <div className="toolbar-txt">
            <p className="toolbar-title">行程密度</p>
            <p className="toolbar-note">
              {coreOnly ? '只顯示一定會做的事，中間全是你的時間。' : '主線加上彈性與加碼，全部攤開。'}
            </p>
          </div>
          <button
            type="button"
            className={`switch ${coreOnly ? 'is-on' : ''}`}
            onClick={() => setCoreOnly((v) => !v)}
            role="switch"
            aria-checked={coreOnly}
          >
            <span className="switch-knob" />
            <span className="sr-only">只看主線</span>
          </button>
        </div>

        {days.map((day) => (
          <section key={day.id} id={day.id} className="sec">
            <SectionHead
              kicker={`${day.label}．${day.title}`}
              icon={day.id === 'day1' ? 'sea' : 'transit'}
              title={day.heading}
              lead={day.intro}
            />
            <Timeline day={day} coreOnly={coreOnly} />
          </section>
        ))}

        <section id="pool" className="sec">
          <SectionHead
            kicker="去不去都可以"
            icon="star"
            title="加碼選項池"
            lead="這些全部是可去可不去的。當天看天氣、看腳力、看心情，勾起來的會留在這個瀏覽器裡，下次打開還在。"
          />
          <OptionPool />
        </section>

        <section id="light" className="sec">
          <SectionHead kicker="拍照時間表" icon="sun" title="什麼時候光線最好" />
          <ul className="rows">
            {goldenHours.map((g) => (
              <li key={g.t}>
                <span className="row-k">{g.t}</span>
                <span className="row-v">{g.v}</span>
              </li>
            ))}
          </ul>
        </section>

        <section id="planb" className="sec">
          <SectionHead
            kicker="計畫趕不上變化"
            icon="rain"
            title="備案"
            lead="九月的高雄可能午後雷陣雨，也可能整天曬到脫水。任何一種都有對應版本。"
          />
          <div className="plans">
            {planB.map((p) => (
              <article key={p.title} className="plan">
                <h3>{p.title}</h3>
                <p>{p.body}</p>
              </article>
            ))}
          </div>
        </section>

        <section id="info" className="sec">
          <SectionHead kicker="出發前" icon="check" title="先確認這幾件事" />
          <ul className="checks">
            {beforeYouGo.map((t) => (
              <li key={t}>
                <Icon name="check" size={15} strokeWidth={2.4} />
                <span>{t}</span>
              </li>
            ))}
          </ul>

          <h3 className="sub-title">
            <Icon name="transit" size={16} />
            交通小抄
          </h3>
          <ul className="rows">
            {transit.map((t) => (
              <li key={t.k}>
                <span className="row-k">{t.k}</span>
                <span className="row-v">{t.v}</span>
              </li>
            ))}
          </ul>

          <h3 className="sub-title">
            <Icon name="wallet" size={16} />
            大概要花多少
          </h3>
          <ul className="rows rows-num">
            {budget.rows.map((r) => (
              <li key={r.k} className={r.total ? 'is-total' : ''}>
                <span className="row-k">{r.k}</span>
                <span className="row-v">{r.v}</span>
              </li>
            ))}
          </ul>
          <p className="fineprint">{budget.note}</p>
        </section>

        <footer className="foot">
          <p>祝玩得開心。累了就坐下來，行程本來就是拿來刪的。</p>
        </footer>
      </main>
    </>
  );
}
