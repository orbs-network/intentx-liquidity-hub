import React, { useCallback, useMemo } from 'react'
import { scaleLinear } from 'd3'
import SVGBase from './SVGBase'
import Pointer from './Pointer'

const HealthGauge = ({
  height,
  width,
  disabled = false,
  value = -1,
  min = 0,
  max = 100,
  maxAngle = 135,
  minAngle = -135,
  arcSegments = [{ min: 0, max: 1, color: 'skyblue' }],
  pointerLabel = '',
  ...props
}: any) => {
  const gaugeOrigin = {
    x: 43 / 2,
    y: 19,
  }

  const valueScale = useCallback(scaleLinear().domain([min, max]).range([0, 1]), [min, max])

  const valueRef = useMemo(() => valueScale(value), [value, valueScale])

  return (
    <>
      <SVGBase
        className="gauge"
        width={43}
        height={24}
        viewBox={'0 0 43 24'}
        style={{
          transition: 'all 0.25s 0.25s',
        }}
        {...props}
      >
        <g clipPath="url(#clip0_8105_77)">
          <path
            fill="url(#paint0_linear_8105_77)"
            d="M5.137 22.501c-2.21.006-4.042-1.794-3.655-3.97.747-4.198 2.683-8.1 5.6-11.17 3.82-4.025 9.012-6.293 14.43-6.308 5.42-.014 10.622 2.228 14.465 6.232 2.932 3.056 4.888 6.947 5.657 11.142.398 2.173-1.425 3.983-3.634 3.989-2.21.005-3.947-1.82-4.594-3.932a13.145 13.145 0 00-3.071-5.257c-2.338-2.437-5.504-3.8-8.8-3.792-3.297.009-6.456 1.389-8.78 3.838a13.147 13.147 0 00-3.045 5.273c-.635 2.116-2.364 3.95-4.573 3.955z"
          ></path>
          <g clipPath="url(#clip1_8105_77)">
            <path
              fill="#000"
              fillOpacity="0.5"
              d="M36.816 20.46a2.919 2.919 0 110-5.838 2.919 2.919 0 010 5.837zm0-.585a2.335 2.335 0 100-4.67 2.335 2.335 0 000 4.67zm-1.022-2.627a.438.438 0 110-.875.438.438 0 010 .875zm2.043 0a.438.438 0 110-.875.438.438 0 010 .875zm.63.876a1.752 1.752 0 01-3.303 0h3.304z"
            ></path>
          </g>
          <path
            fill="#000"
            fillOpacity="0.5"
            d="M5.81 14.621a2.919 2.919 0 100 5.838 2.919 2.919 0 000-5.838zm0 5.254a2.335 2.335 0 11.001-4.67 2.335 2.335 0 010 4.67zm0-1.751c.512 0 .961.21 1.224.528l-.415.415c-.13-.213-.443-.36-.808-.36-.365 0-.677.147-.809.36l-.414-.415c.263-.318.712-.528 1.223-.528zm-.583-1.313a.449.449 0 01-.438.437.449.449 0 01-.438-.438v-.437l.876.438zm2.043 0a.449.449 0 01-.438.437.449.449 0 01-.437-.438l.875-.437v.438z"
          ></path>

          <Pointer
            value={disabled ? -0.025 : valueRef}
            head={60}
            center={gaugeOrigin}
            disabled={disabled}
            maxAngle={maxAngle}
            minAngle={minAngle}
            tooltip={pointerLabel ? pointerLabel : value}
            pointerFill="#fff"
          />
          <path
            fill="#D9D9D9"
            d="M31 22c0-1.05-.233-2.09-.685-3.061a8.01 8.01 0 00-1.951-2.596 9.15 9.15 0 00-2.92-1.734A9.984 9.984 0 0022 14a9.984 9.984 0 00-3.444.609 9.15 9.15 0 00-2.92 1.734 8.01 8.01 0 00-1.95 2.596A7.236 7.236 0 0013 22h18z"
          ></path>
        </g>
        <defs>
          <linearGradient
            id="paint0_linear_8105_77"
            x1="6.217"
            x2="42.304"
            y1="11.482"
            y2="11.467"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0.123" stopColor="#FF472C"></stop>
            <stop offset="0.328" stopColor="#FD861E"></stop>
            <stop offset="0.522" stopColor="#FCD41A"></stop>
            <stop offset="0.741" stopColor="#80C513"></stop>
          </linearGradient>
          <clipPath id="clip0_8105_77">
            <path fill="#fff" d="M0 0H43V24H0z"></path>
          </clipPath>
          <clipPath id="clip1_8105_77">
            <path fill="#fff" d="M0 0H5.838V5.838H0z" transform="translate(33.895 14.621)"></path>
          </clipPath>
        </defs>

        <circle cx="140" cy="140" r="8.12436" fill="white" stroke="#3D3D3D" strokeWidth="1.64129" />
      </SVGBase>
    </>
  )
}

export default HealthGauge
