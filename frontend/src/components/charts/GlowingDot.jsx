export default function GlowingDot(props) {
  const { cx, cy, stroke } = props;
  return (
    <g>
      <circle cx={cx} cy={cy} r={12} stroke="none" fill={stroke} opacity={0.25} />
      <circle cx={cx} cy={cy} r={5} stroke="none" fill={stroke} />
      <circle cx={cx} cy={cy} r={2} stroke="none" fill="#ffffff" />
    </g>
  )
}
