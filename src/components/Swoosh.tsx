export function Swoosh({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 36" className={className} aria-hidden="true" focusable="false">
      <path
        fill="currentColor"
        d="M100 .5 28.9 30.4c-5.9 2.5-10.9 3.7-14.9 3.7-4.6 0-8-1.6-10-4.8-2.6-4.2-1.5-10.9 3.4-18.3-3.4 5.9-4.1 10.7-2 14.1 1.6 2.6 4.6 3.9 8.7 3.9 3.1 0 6.6-.7 10.6-2.2L100 .5Z"
      />
    </svg>
  )
}
