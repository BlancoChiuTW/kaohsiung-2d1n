const paths = {
  photo: (
    <>
      <path d="M3 8.5A2.5 2.5 0 0 1 5.5 6h1.2a1 1 0 0 0 .84-.46l.7-1.08A1 1 0 0 1 9.08 4h5.84a1 1 0 0 1 .84.46l.7 1.08a1 1 0 0 0 .84.46h1.2A2.5 2.5 0 0 1 21 8.5v8A2.5 2.5 0 0 1 18.5 19h-13A2.5 2.5 0 0 1 3 16.5z" />
      <circle cx="12" cy="12.2" r="3.4" />
    </>
  ),
  night: (
    <path d="M20 14.2A8.2 8.2 0 0 1 9.8 4 8.4 8.4 0 1 0 20 14.2z" />
  ),
  food: (
    <>
      <path d="M6 3v7a2.5 2.5 0 0 0 5 0V3M8.5 12.5V21" />
      <path d="M17.5 3c-1.4 1.2-2 3-2 5.2 0 1.8.7 2.9 2 3.3V21" />
    </>
  ),
  indoor: (
    <>
      <path d="M4 10.5 12 4l8 6.5" />
      <path d="M6 10v9.5h12V10" />
      <path d="M10 19.5v-5h4v5" />
    </>
  ),
  sea: (
    <>
      <path d="M3 8.5c1.8 0 1.8 1.6 3.6 1.6S8.4 8.5 10.2 8.5s1.8 1.6 3.6 1.6 1.8-1.6 3.6-1.6S19.2 10.1 21 10.1" />
      <path d="M3 14c1.8 0 1.8 1.6 3.6 1.6S8.4 14 10.2 14s1.8 1.6 3.6 1.6S15.6 14 17.4 14 19.2 15.6 21 15.6" />
    </>
  ),
  clock: (
    <>
      <circle cx="12" cy="12" r="8.4" />
      <path d="M12 7.4V12l3 1.9" />
    </>
  ),
  pin: (
    <>
      <path d="M12 21s6.4-5.6 6.4-10.4A6.4 6.4 0 0 0 5.6 10.6C5.6 15.4 12 21 12 21z" />
      <circle cx="12" cy="10.4" r="2.4" />
    </>
  ),
  check: <path d="M4.8 12.6 9.6 17.4 19.2 6.8" />,
  chevron: <path d="M9 5.5 15.5 12 9 18.5" />,
  star: (
    <path d="M12 3.6l2.6 5.3 5.8.85-4.2 4.1 1 5.8-5.2-2.75-5.2 2.75 1-5.8-4.2-4.1 5.8-.85z" />
  ),
  link: (
    <>
      <path d="M14 4.5h5.5V10" />
      <path d="M19.5 4.5 11.8 12.2" />
      <path d="M18 14.4v3.9a2.2 2.2 0 0 1-2.2 2.2H5.9a2.2 2.2 0 0 1-2.2-2.2V8.4a2.2 2.2 0 0 1 2.2-2.2h3.9" />
    </>
  ),
  info: (
    <>
      <circle cx="12" cy="12" r="8.4" />
      <path d="M12 11v5.4M12 7.9v.1" />
    </>
  ),
  transit: (
    <>
      <rect x="5.5" y="3.5" width="13" height="13" rx="3.2" />
      <path d="M5.5 11.5h13M8.4 20.5l1.8-4M15.6 20.5l-1.8-4" />
      <path d="M9 14.4v.1M15 14.4v.1" />
    </>
  ),
  sun: (
    <>
      <circle cx="12" cy="12" r="4.2" />
      <path d="M12 2.6v2.2M12 19.2v2.2M2.6 12h2.2M19.2 12h2.2M5.4 5.4l1.6 1.6M17 17l1.6 1.6M18.6 5.4 17 7M7 17l-1.6 1.6" />
    </>
  ),
  rain: (
    <>
      <path d="M7.5 15.5a4.2 4.2 0 0 1-.3-8.4 5.6 5.6 0 0 1 10.7 1.5 3.5 3.5 0 0 1-.6 6.9" />
      <path d="M9.4 18.2l-.9 2.4M14.6 18.2l-.9 2.4" />
    </>
  ),
  wallet: (
    <>
      <rect x="3.2" y="6" width="17.6" height="13" rx="3" />
      <path d="M3.2 10.5h17.6" />
      <path d="M16.4 15.2v.1" />
    </>
  ),
};

export default function Icon({ name, size = 20, className = '', strokeWidth = 1.7 }) {
  const d = paths[name];
  if (!d) return null;
  const filled = name === 'night' || name === 'star';
  return (
    <svg
      className={`icon ${className}`}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={filled ? 'currentColor' : 'none'}
      stroke="currentColor"
      strokeWidth={filled ? 0 : strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      {d}
    </svg>
  );
}
