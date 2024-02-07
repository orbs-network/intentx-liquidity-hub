import React from 'react'
import styled, { keyframes, useTheme } from 'styled-components'

const rotate = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`

const StyledSVG = styled.svg<{
  duration: string
  size: string
}>`
  animation: ${({ duration }) => duration} ${rotate} linear infinite;
  height: ${({ size }) => size};
  width: ${({ size }) => size};
`

export default function Loader({
  size = '16px',
  stroke,
  color = '',
  duration = '2s',
  ...rest
}: {
  size?: string
  stroke?: string
  color?: string
  duration?: string
  [x: string]: any
}) {
  const theme = useTheme()

  return (
    <StyledSVG size={size} viewBox="0 0 95 95" fill="none" stroke={stroke ?? theme.text2} duration={duration} {...rest}>
      <path
        opacity="0.3"
        d="M95 47.5C95 73.7335 73.7335 95 47.5 95C21.2665 95 0 73.7335 0 47.5C0 21.2665 21.2665 0 47.5 0C73.7335 0 95 21.2665 95 47.5ZM14.8113 47.5C14.8113 65.5535 29.4465 80.1887 47.5 80.1887C65.5535 80.1887 80.1887 65.5535 80.1887 47.5C80.1887 29.4465 65.5535 14.8113 47.5 14.8113C29.4465 14.8113 14.8113 29.4465 14.8113 47.5Z"
        fill={color || "url(#paint0_linear_1996_26244)"}
      />
      <path
        d="M87.5943 47.5C91.6844 47.5 95.059 44.1647 94.4239 40.1243C93.8423 36.4248 92.824 32.7984 91.3843 29.3225C88.9972 23.5596 85.4984 18.3232 81.0876 13.9124C76.6768 9.50164 71.4404 6.00282 65.6775 3.61572C62.2016 2.17597 58.5752 1.15765 54.8757 0.576141C50.8353 -0.0589567 47.5 3.31562 47.5 7.40565C47.5 11.4957 50.857 14.7279 54.8425 15.6466C56.6035 16.0525 58.3319 16.6047 60.0094 17.2996C63.9754 18.9423 67.579 21.3502 70.6144 24.3856C73.6498 27.421 76.0577 31.0246 77.7004 34.9906C78.3953 36.6681 78.9475 38.3965 79.3534 40.1575C80.2721 44.143 83.5043 47.5 87.5943 47.5Z"
        fill={color || "url(#paint1_linear_1996_26244)"}
      />
      <defs>
        <linearGradient id="paint0_linear_1996_26244" x1="47.5" y1="0" x2="47.5" y2="95" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FF0420" />
          <stop offset="1" stopColor="#BD2738" />
        </linearGradient>
        <linearGradient id="paint1_linear_1996_26244" x1="47.5" y1="0" x2="47.5" y2="95" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FF0420" />
          <stop offset="1" stopColor="#BD2738" />
        </linearGradient>
      </defs>
    </StyledSVG>
  )
}
