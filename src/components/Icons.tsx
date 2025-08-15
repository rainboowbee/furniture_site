export function MeasureIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <rect x="3" y="6" width="18" height="12" rx="2" stroke="currentColor" strokeWidth="1.5"/>
      <path d="M7 9h2M11 9h2M15 9h2M7 15h2M11 15h2M15 15h2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  );
}

export function DesignIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path d="M12 3l3 3-9 9-3 0 0-3 9-9z" stroke="currentColor" strokeWidth="1.5"/>
      <path d="M14 5l5 5" stroke="currentColor" strokeWidth="1.5"/>
    </svg>
  );
}

export function BuildIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path d="M12 2l2 4 4 .5-3 3 .8 4.5-3.8-2-3.8 2 .8-4.5-3-3 4-.5L12 2z" stroke="currentColor" strokeWidth="1.5"/>
    </svg>
  );
}

export function DeliveryIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path d="M3 7h11v7H3zM14 9h4l3 3v2h-7z" stroke="currentColor" strokeWidth="1.5"/>
      <circle cx="7" cy="17" r="2" stroke="currentColor" strokeWidth="1.5"/>
      <circle cx="17" cy="17" r="2" stroke="currentColor" strokeWidth="1.5"/>
    </svg>
  );
}