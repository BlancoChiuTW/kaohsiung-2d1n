import Icon from './Icon';
import Photo from './Photo';
import { eats } from '../data/trip';

const mapUrl = (name, area) =>
  `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${name} ${area} 高雄`)}`;

export default function Eats() {
  return (
    <div className="eats">
      {eats.map((group) => (
        <section key={group.id} className="eatgroup">
          <h3 className="eatgroup-title">
            {group.label}
            <span className="eatgroup-sub">{group.sub}</span>
          </h3>
          <ul className="eatlist">
            {group.places.map((pl) => (
              <li key={pl.name} className="eatcard">
                {pl.photo ? <Photo id={pl.photo} alt={pl.name} className="photo-card" /> : null}
                <a
                  className="eat"
                  href={mapUrl(pl.name, pl.area)}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span className="eat-head">
                    <span className="eat-name">{pl.name}</span>
                    <Icon name="link" size={13} className="eat-go" />
                  </span>
                  <span className="eat-area">
                    <Icon name="pin" size={12} />
                    {pl.area}
                  </span>
                  <span className="eat-why">{pl.why}</span>
                  {pl.alert ? (
                    <span className="eat-alert">
                      <Icon name="info" size={12} />
                      {pl.alert}
                    </span>
                  ) : null}
                </a>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
