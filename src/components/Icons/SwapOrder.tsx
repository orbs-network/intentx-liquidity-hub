export default function SwapOrder({ selected, size = '24' }: { selected?: boolean; size?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} fill="none" viewBox="0 0 24 24">
      <path
        fill={selected ? 'url(#paint0_linear_12633_97362)' : '#404959'}
        d="M5 6l4-4 1.45 1.4L8.85 5H16c1.1 0 2.042.392 2.825 1.175C19.608 6.958 20 7.9 20 9s-.392 2.042-1.175 2.825C18.042 12.608 17.1 13 16 13H9c-.55 0-1.021.196-1.413.588A1.922 1.922 0 007 15c0 .55.196 1.021.587 1.413A1.92 1.92 0 009 17h7.15l-1.6-1.6L16 14l4 4-4 4-1.45-1.4 1.6-1.6H9c-1.1 0-2.042-.392-2.825-1.175C5.392 17.042 5 16.1 5 15s.392-2.042 1.175-2.825C6.958 11.392 7.9 11 9 11h7c.55 0 1.02-.196 1.412-.587A1.93 1.93 0 0018 9c0-.55-.196-1.02-.588-1.412A1.93 1.93 0 0016 7H8.85l1.6 1.6L9 10 5 6z"
      ></path>
      <defs>
        <linearGradient
          id="paint0_linear_12633_97362"
          x1="10.671"
          x2="10.671"
          y1="2"
          y2="27.614"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#BC2738"></stop>
          <stop offset="1" stopColor="#6E1620"></stop>
        </linearGradient>
      </defs>
    </svg>
  )
}
