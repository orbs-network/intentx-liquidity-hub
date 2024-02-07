export default function CircleCheck({ width, height, ...rest }: { width?: number; height?: number; [x: string]: any }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={width} height={height} viewBox="0 0 12 12" fill="none" {...rest}>
      <g clipPath="url(#clip0_9962_94965)">
        <path
          d="M5.1215 8.15756L3 6.03556L3.707 5.32856L5.1215 6.74256L7.9495 3.91406L8.657 4.62156L5.1215 8.15656V8.15756Z"
          fill="url(#paint0_linear_9962_94965)"
        />
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M0.5 6C0.5 2.9625 2.9625 0.5 6 0.5C9.0375 0.5 11.5 2.9625 11.5 6C11.5 9.0375 9.0375 11.5 6 11.5C2.9625 11.5 0.5 9.0375 0.5 6ZM6 10.5C5.40905 10.5 4.82389 10.3836 4.27792 10.1575C3.73196 9.93131 3.23588 9.59984 2.81802 9.18198C2.40016 8.76412 2.06869 8.26804 1.84254 7.72208C1.6164 7.17611 1.5 6.59095 1.5 6C1.5 5.40905 1.6164 4.82389 1.84254 4.27792C2.06869 3.73196 2.40016 3.23588 2.81802 2.81802C3.23588 2.40016 3.73196 2.06869 4.27792 1.84254C4.82389 1.6164 5.40905 1.5 6 1.5C7.19347 1.5 8.33807 1.97411 9.18198 2.81802C10.0259 3.66193 10.5 4.80653 10.5 6C10.5 7.19347 10.0259 8.33807 9.18198 9.18198C8.33807 10.0259 7.19347 10.5 6 10.5Z"
          fill="url(#paint1_linear_9962_94965)"
        />
      </g>
      <defs>
        <linearGradient
          id="paint0_linear_9962_94965"
          x1="3"
          y1="6.55331"
          x2="10.2449"
          y2="6.55331"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#BC2738" />
          <stop offset="1" stopColor="#6E1620" />
        </linearGradient>
        <linearGradient
          id="paint1_linear_9962_94965"
          x1="0.5"
          y1="7.34146"
          x2="14.5877"
          y2="7.34146"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#BC2738" />
          <stop offset="1" stopColor="#6E1620" />
        </linearGradient>
        <clipPath id="clip0_9962_94965">
          <rect width="12" height="12" fill="white" />
        </clipPath>
      </defs>
    </svg>
  )
}
