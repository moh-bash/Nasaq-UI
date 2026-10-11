import logoUrl from '../assets/logo.png';

export default function Logo({ size = 22, className }) {
  return (
    <img
      src={logoUrl}
      alt="Nasaq UI logo"
      width={size}
      height={size}
      className={className}
      style={{ objectFit: 'contain', display: 'block', background: 'transparent' }}
    />
  );
}
