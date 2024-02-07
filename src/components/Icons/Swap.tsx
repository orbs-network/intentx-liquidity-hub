export default function Swap({ size = '24' }: { size?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} fill="none" viewBox="0 0 24 24">
      <path
        fill="url(#paint0_linear_12573_57007)"
        d="M6 19l-4-4 1.4-1.45 1.6 1.6V8c0-1.1.392-2.042 1.175-2.825C6.958 4.392 7.9 4 9 4s2.042.392 2.825 1.175C12.608 5.958 13 6.9 13 8v7c0 .55.196 1.021.588 1.413.392.392.863.588 1.412.587.55 0 1.021-.196 1.413-.587A1.92 1.92 0 0017 15V7.85l-1.6 1.6L14 8l4-4 4 4-1.4 1.45-1.6-1.6V15c0 1.1-.392 2.042-1.175 2.825C17.042 18.608 16.1 19 15 19s-2.042-.392-2.825-1.175C11.392 17.042 11 16.1 11 15V8c0-.55-.196-1.02-.587-1.412A1.93 1.93 0 009 6c-.55 0-1.02.196-1.412.588A1.93 1.93 0 007 8v7.15l1.6-1.6L10 15l-4 4z"
      ></path>
      <defs>
        <linearGradient
          id="paint0_linear_12573_57007"
          x1="2"
          x2="27.614"
          y1="13.329"
          y2="13.329"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#BC2738"></stop>
          <stop offset="1" stopColor="#6E1620"></stop>
        </linearGradient>
      </defs>
    </svg>
  )
}
