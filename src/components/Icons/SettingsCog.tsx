export default function SettingsCog({ hovered, size = '24' }: { hovered?: boolean; size: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} fill="none" viewBox="0 0 24 24">
      <path
        fill={hovered ? 'url(#paint0_linear_12224_113505)' : 'white'}
        d="M12 1l9.5 5.5v11L12 23l-9.5-5.5v-11L12 1zm0 2.311L4.5 7.653v8.694l7.5 4.342 7.5-4.342V7.653L12 3.311zM12 16a4 4 0 110-8 4 4 0 010 8zm0-2a2 2 0 100-4 2 2 0 000 4z"
      ></path>
      <defs>
        <linearGradient id="paint0_linear_12224_113505" x1="12" x2="12" y1="1" y2="23" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FF0420"></stop>
          <stop offset="1" stopColor="#BD2738"></stop>
        </linearGradient>
      </defs>
    </svg>
  )
}
