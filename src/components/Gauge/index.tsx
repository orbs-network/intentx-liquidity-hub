import React, { useCallback, useMemo } from 'react'
import { scaleLinear } from 'd3'
import SVGBase from './SVGBase'
import GaugeArc from './GaugeArc'
import Pointer from './Pointer'
import TextArc from './TextArc'

const defaultSize = 250

const Gauge = ({
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
    x: 140,
    y: 140,
  }

  const valueScale = useCallback(scaleLinear().domain([min, max]).range([0, 1]), [min, max])

  /** Value scaled to [0,1] */
  const valueRef = useMemo(() => valueScale(value), [value, valueScale])

  return (
    <>
      <SVGBase
        className="gauge"
        width={width ? width : height ? height : defaultSize}
        height={height ? height : width ? width : defaultSize}
        viewBox={'0 0 280 170'}
        style={{
          transition: 'all 0.25s 0.25s',
        }}
        {...props}
      >
        <TextArc center={gaugeOrigin} maxAngle={maxAngle} minAngle={minAngle} opacity={disabled ? 0.25 : undefined} />
        {arcSegments.map(({ min, max, color, node }: any, idx: any) => (
          <g key={`arcsegment-${idx}`}>
            {typeof node === 'function' ? node(disabled) : node}
            <GaugeArc
              key={`gauge-arcsegment-${idx}`}
              inset={12}
              min={min}
              max={max}
              stroke={disabled && !node ? `rgba(${idx * 15},${idx * 15},${idx * 15}, ${idx * 0.1 + 0.1})` : color}
              strokeWidth={28}
              center={gaugeOrigin}
              maxAngle={maxAngle}
              minAngle={minAngle}
            />
          </g>
        ))}
        <Pointer
          value={disabled ? -0.025 : valueRef}
          head={60}
          center={gaugeOrigin}
          disabled={disabled}
          maxAngle={maxAngle}
          minAngle={minAngle}
          tooltip={pointerLabel ? pointerLabel : value}
        />
        <circle cx="140" cy="140" r="8.12436" fill="white" stroke="#3D3D3D" strokeWidth="1.64129" />
      </SVGBase>
    </>
  )
}

export default Gauge
