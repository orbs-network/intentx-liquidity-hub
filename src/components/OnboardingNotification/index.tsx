export default function OnboardingNotification({ isSelected }: { isSelected?: boolean }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" viewBox="0 0 14 14">
      <path
        fill="url(#paint0_linear_10880_74976)"
        d="M5.919 1.895a1.167 1.167 0 012.163 0 4.085 4.085 0 013.001 3.939v2.74l1.07 1.603a.583.583 0 01-.486.907H9.02a2.042 2.042 0 01-4.042 0H2.333a.584.584 0 01-.485-.907l1.069-1.603v-2.74a4.085 4.085 0 013.002-3.939zm.256 9.189a.875.875 0 001.65 0h-1.65zM7 2.917a2.917 2.917 0 00-2.917 2.917V8.75a.583.583 0 01-.098.324l-.561.843h7.152l-.562-.843a.583.583 0 01-.097-.324V5.834A2.917 2.917 0 007 2.917z"
      ></path>
      <defs>
        <linearGradient
          id="paint0_linear_10880_74976"
          x1="7"
          x2="7"
          y1="1.166"
          y2="12.834"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor={isSelected ? '#FF0420' : '#232933'}></stop>
          <stop offset="1" stopColor={isSelected ? '#BD2738' : '#232933'}></stop>
        </linearGradient>
      </defs>
    </svg>
  )
}
