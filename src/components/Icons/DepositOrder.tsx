export default function DepositOrder({ selected, size = '24' }: { selected?: boolean; size?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} fill="none" viewBox="0 0 24 24">
      <path
        fill={selected ? 'url(#paint0_linear_12633_97362)' : '#404959'}
        d="M12 16l-5-5 1.4-1.45 2.6 2.6V4h2v8.15l2.6-2.6L17 11l-5 5zm-6 4c-.55 0-1.02-.196-1.412-.587A1.93 1.93 0 014 18v-3h2v3h12v-3h2v3c0 .55-.196 1.021-.587 1.413A1.92 1.92 0 0118 20H6z"
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
