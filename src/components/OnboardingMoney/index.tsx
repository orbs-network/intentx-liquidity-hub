export default function OnboardingMoney({ isSelected }: { isSelected?: boolean }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="15" height="14" fill="none" viewBox="0 0 15 14">
      <path
        stroke="url(#paint0_linear_10012_78201)"
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3.417 4.667H2.25V10.5h10.5V4.667h-.875m-2.333-.584a1.75 1.75 0 11-2.334 2.484M8.083 3.5a1.75 1.75 0 11-3.5 0 1.75 1.75 0 013.5 0z"
      ></path>
      <defs>
        <linearGradient
          id="paint0_linear_10012_78201"
          x1="7.5"
          x2="7.5"
          y1="1.75"
          y2="10.5"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor={isSelected ? '#FF0420' : '#232933'}></stop>
          <stop offset="1" stopColor={isSelected ? '#BD2738' : '#232933'}></stop>
        </linearGradient>
      </defs>
    </svg>
  )
}
