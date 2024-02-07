export default function OrderTypeDeposit({ size = '24' }: { size?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} fill="none" viewBox="0 0 24 24">
      <circle cx="12" cy="12.75" r="12" fill="#232933" transform="rotate(90 12 12.75)"></circle>
      <circle cx="12.188" cy="12.563" r="9.188" fill="#1C1F26" transform="rotate(90 12.188 12.563)"></circle>
      <path
        fill="url(#paint0_linear_12635_108530)"
        d="M12 15l-2.5-2.5.7-.725 1.3 1.3V9h1v4.075l1.3-1.3.7.725L12 15zm-3 2a.962.962 0 01-.706-.294A.965.965 0 018 16v-1.5h1V16h6v-1.5h1V16c0 .275-.098.51-.293.706A.96.96 0 0115 17H9z"
      ></path>
      <defs>
        <linearGradient
          id="paint0_linear_12635_108530"
          x1="8"
          x2="18.246"
          y1="13.976"
          y2="13.976"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#BC2738"></stop>
          <stop offset="1" stopColor="#6E1620"></stop>
        </linearGradient>
      </defs>
    </svg>
  )
}
