export const BarChartActiveDot = (props: any) => {
  const fill = props?.fill === 'fill' && props?.payload?.fill ? props?.payload?.fill : props.fill

  return (
    <g>
      <circle cx={props.cx} cy={props.cy} r="6.5" fill={fill} stroke={fill} strokeWidth="3.5" />
      <circle cx={props.cx} cy={props.cy} r="5" fill={fill} stroke="white" strokeWidth="3.5" />
    </g>
  )
}

export const AreaChartActiveDot = (props: any) => {
  const fill = props?.fill === 'fill' && props?.payload?.fill ? props?.payload?.fill : props.fill

  return (
    <g>
      <circle cx={props.cx} cy={props.cy} r="5" fill={fill} />
    </g>
  )
}
