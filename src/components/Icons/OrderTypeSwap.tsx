export default function OrderTypeSwap({ size = '24' }: { size?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} fill="none" viewBox="0 0 24 24">
      <circle cx="12" cy="12.5" r="12" fill="#232933" transform="rotate(90 12 12.5)"></circle>
      <circle cx="12.188" cy="12.313" r="9.188" fill="#1C1F26" transform="rotate(90 12.188 12.313)"></circle>
      <path
        fill="url(#paint0_linear_12633_21283)"
        d="M9.375 10.25l1.5-1.5.544.525-.6.6H13.5c.412 0 .766.147 1.06.44.293.294.44.648.44 1.06 0 .412-.147.766-.44 1.06-.294.293-.648.44-1.06.44h-2.625a.722.722 0 00-.53.22.72.72 0 00-.22.53c0 .206.073.383.22.53a.72.72 0 00.53.22h2.681l-.6-.6.544-.525 1.5 1.5-1.5 1.5-.544-.525.6-.6h-2.681c-.412 0-.766-.147-1.06-.44a1.445 1.445 0 01-.44-1.06c0-.412.147-.766.44-1.06.294-.293.648-.44 1.06-.44H13.5a.722.722 0 00.53-.22.724.724 0 00.22-.53.721.721 0 00-.22-.53.724.724 0 00-.53-.22h-2.681l.6.6-.544.525-1.5-1.5z"
      ></path>
      <defs>
        <linearGradient
          id="paint0_linear_12633_21283"
          x1="11.502"
          x2="11.502"
          y1="8.75"
          y2="18.355"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#BC2738"></stop>
          <stop offset="1" stopColor="#6E1620"></stop>
        </linearGradient>
      </defs>
    </svg>
  )
}
