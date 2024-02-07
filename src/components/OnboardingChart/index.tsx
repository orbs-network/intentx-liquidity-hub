export default function OnboardingChart({ isSelected }: { isSelected?: boolean }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="none" viewBox="0 0 12 12">
      <g clipPath="url(#clip0_10012_78258)">
        <path
          fill="url(#paint0_linear_10012_78258)"
          d="M3.274 3.75H.73a.37.37 0 00-.363.375v7.5A.37.37 0 00.73 12h2.544a.37.37 0 00.363-.375v-7.5a.37.37 0 00-.363-.375zm-.363 7.5H1.094V4.5H2.91v6.75zm4.356-5.27H4.723a.37.37 0 00-.364.375v5.27a.37.37 0 00.364.375h2.544a.37.37 0 00.363-.375v-5.27a.369.369 0 00-.363-.375zm-.364 5.27H5.086V6.73h1.817v4.52zM11.266 0h-2.54a.37.37 0 00-.364.375v11.25a.37.37 0 00.364.375h2.54a.37.37 0 00.363-.375V.375A.37.37 0 0011.266 0zm-.364 11.25H9.09V.75h1.813v10.5z"
        ></path>
      </g>
      <defs>
        <linearGradient
          id="paint0_linear_10012_78258"
          x1="5.998"
          x2="5.998"
          y1="0"
          y2="12"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor={isSelected ? '#FF0420' : '#232933'}></stop>
          <stop offset="1" stopColor={isSelected ? '#BD2738' : '#232933'}></stop>
        </linearGradient>
        <clipPath id="clip0_10012_78258">
          <path fill="#fff" d="M0 0H11.625V12H0z" transform="translate(.188)"></path>
        </clipPath>
      </defs>
    </svg>
  )
}
