export default function TablerCoin({
  width,
  height,
  color = '',
  ...rest
}: {
  width?: number
  height?: number
  color?: string
  [x: string]: any
}) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={width || '1em'}
      height={height || '1em'}
      viewBox="0 0 20 21"
      fill="none"
      {...rest}
    >
      <path
        d="M7.5 12.167C7.5 13.5478 9.73833 14.667 12.5 14.667C15.2617 14.667 17.5 13.5478 17.5 12.167C17.5 10.7862 15.2617 9.66699 12.5 9.66699C9.73833 9.66699 7.5 10.7862 7.5 12.167Z"
        stroke={color || 'url(#paint0_linear_7522_33674)'}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M7.5 12.1667V15.5C7.5 16.88 9.73833 18 12.5 18C15.2617 18 17.5 16.88 17.5 15.5V12.1667M2.5 5.5C2.5 6.39333 3.45333 7.21833 5 7.665C6.54667 8.11167 8.45333 8.11167 10 7.665C11.5467 7.21833 12.5 6.39333 12.5 5.5C12.5 4.60667 11.5467 3.78167 10 3.335C8.45333 2.88833 6.54667 2.88833 5 3.335C3.45333 3.78167 2.5 4.60667 2.5 5.5Z"
        stroke={color || 'url(#paint1_linear_7522_33674)'}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M2.5 5.5V13.8333C2.5 14.5733 3.14333 15.0417 4.16667 15.5"
        stroke={color || 'url(#paint2_linear_7522_33674)'}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M2.5 9.66699C2.5 10.407 3.14333 10.8753 4.16667 11.3337"
        stroke={color || 'url(#paint3_linear_7522_33674)'}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      <defs>
        <linearGradient
          id="paint0_linear_7522_33674"
          x1="7.5"
          y1="12.7767"
          x2="20.307"
          y2="12.7767"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#BC2738" />
          <stop offset="1" stopColor="#6E1620" />
        </linearGradient>
        <linearGradient
          id="paint1_linear_7522_33674"
          x1="2.5"
          y1="12.3293"
          x2="21.7105"
          y2="12.3293"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#BC2738" />
          <stop offset="1" stopColor="#6E1620" />
        </linearGradient>
        <linearGradient
          id="paint2_linear_7522_33674"
          x1="2.5"
          y1="11.7195"
          x2="4.6345"
          y2="11.7195"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#BC2738" />
          <stop offset="1" stopColor="#6E1620" />
        </linearGradient>
        <linearGradient
          id="paint3_linear_7522_33674"
          x1="2.5"
          y1="10.7036"
          x2="4.6345"
          y2="10.7036"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#BC2738" />
          <stop offset="1" stopColor="#6E1620" />
        </linearGradient>
      </defs>
    </svg>
  )
}
