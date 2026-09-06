import { useEffect, useRef, useState } from 'react';
import Icon from './components/Icon';
import Timeline from './components/Timeline';
import OptionPool from './components/OptionPool';
import Eats from './components/Eats';
import { beforeYouGo, days, goldenHours, meta, planB, transit } from './data/trip';
import './App.css';

// 章節捲到定位後標題大約落在這條線下方，用來判斷「現在在哪一節」
const ACTIVE_LINE = 140;

const SECTIONS = [
  { id: 'day1', label: 'Day 1' },
  { id: 'day2', label: 'Day 2' },
  { id: 'pool', label: '加碼' },
  { id: 'eat', label: '吃的' },
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

// 取「最後一個標題已經捲過導覽列」的章節，比 IntersectionObserver 的可視區判斷穩定
function useActiveSection() {
  const [active, setActive] = useState('day1');
  useEffect(() => {
    const els = SECTIONS.map((s) => document.getElementById(s.id)).filter(Boolean);
    let raf = 0;
    const measure = () => {
      raf = 0;
      let cur = els[0]?.id ?? 'day1';
      for (const el of els) {
        if (el.getBoundingClientRect().top <= ACTIVE_LINE) cur = el.id;
      }
      setActive(cur);
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(measure);
    };
    measure();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
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

  // 只捲導覽列自己的水平捲軸。用 scrollIntoView 會連帶動到整頁，跟章節跳轉打架。
  useEffect(() => {
    const rail = navRef.current;
    const el = rail?.querySelector('.is-active');
    if (!rail || !el) return;
    const left = el.offsetLeft - (rail.clientWidth - el.clientWidth) / 2;
    rail.scrollTo({ left: Math.max(0, left), behavior: 'smooth' });
  }, [active]);

  // 短距離用平滑捲動，跨越大半頁時直接瞬移，免得滾好幾秒
  const jump = (id) => {
    const el = document.getElementById(id);
    if (!el) return;
    const far = Math.abs(el.getBoundingClientRect().top) > window.innerHeight * 2.5;
    el.scrollIntoView({ behavior: far ? 'instant' : 'smooth', block: 'start' });
  };

  return (
    <>
      <div className="progress" style={{ transform: `scaleX(${progress})` }} aria-hidden="true" />

      <nav className="navbar" aria-label="章節導覽">
        <div className="navbar-inner" ref={navRef}>
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
          <p className="hero-kicker">兩天一夜．九月．不騎車</p>
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
              {coreOnly ? '只顯示主線。' : '主線、彈性、加碼全部顯示。'}
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
            icon="pin"
            title="加碼選項池"
            lead="以下都是可去可不去的。勾起來的會存在這個瀏覽器，下次打開還在。"
          />
          <OptionPool />
        </section>

        <section id="eat" className="sec">
          <SectionHead
            kicker="咖啡廳與餐廳"
            icon="food"
            title="吃的"
            lead="依兩條路線分開。點店名會開 Google 地圖。營業時間和公休日變動很快，出發前再確認一次。"
          />
          <Eats />
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
            lead="九月可能午後雷陣雨，也可能整天曬。兩種都有對應版本。"
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
        </section>

        <footer className="foot">
          <p>營業時間、船班、開合秀場次都以官方公告為準。</p>
          <p className="foot-credit">
            照片取自 Wikimedia Commons，點任何一張都會開到原始檔案頁，上面有作者與授權。
          </p>
        </footer>
      </main>
    </>
  );
}
