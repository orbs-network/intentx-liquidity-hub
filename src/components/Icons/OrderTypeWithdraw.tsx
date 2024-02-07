export default function OrderTypeWithdraw({ size = '24' }: { size?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} fill="none" viewBox="0 0 24 24">
      <circle cx="12" cy="12.75" r="12" fill="#232933" transform="rotate(90 12 12.75)"></circle>
      <circle cx="12.188" cy="12.563" r="9.188" fill="#1C1F26" transform="rotate(90 12.188 12.563)"></circle>
      <path
        fill="url(#paint0_linear_12635_108704)"
        d="M12 11l-2.5 2.5.7.725 1.3-1.3V17h1v-4.075l1.3 1.3.7-.725L12 11zM9 9a.963.963 0 00-.706.293A.965.965 0 008 10v1.5h1V10h6v1.5h1V10a.964.964 0 00-.293-.707A.96.96 0 0015 9H9z"
      ></path>
      <defs>
        <linearGradient
          id="paint0_linear_12635_108704"
          x1="8"
          x2="18.246"
          y1="12.024"
          y2="12.024"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#BC2738"></stop>
          <stop offset="1" stopColor="#6E1620"></stop>
        </linearGradient>
      </defs>
    </svg>
  )
}
