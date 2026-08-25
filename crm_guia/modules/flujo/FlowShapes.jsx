export function FRect({ x, y, w, h, lines, fill, stroke, textColor = "#111827" }) {
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx={8} fill={fill} stroke={stroke} strokeWidth={1.6} />
      <text x={x + w / 2} y={y + h / 2} textAnchor="middle" dominantBaseline="middle" fontFamily="Inter, Arial, sans-serif" fontSize="13" fontWeight="600" fill={textColor}>
        {lines.map((l, idx) => <tspan key={idx} x={x + w / 2} dy={idx === 0 ? -((lines.length - 1) * 8) : 16}>{l}</tspan>)}
      </text>
    </g>
  );
}

export function FDiamond({ cx, cy, w, h, lines, fill, stroke, textColor = "#7C2D12" }) {
  const pts = `${cx},${cy - h / 2} ${cx + w / 2},${cy} ${cx},${cy + h / 2} ${cx - w / 2},${cy}`;
  return (
    <g>
      <polygon points={pts} fill={fill} stroke={stroke} strokeWidth={1.6} />
      <text x={cx} y={cy} textAnchor="middle" dominantBaseline="middle" fontFamily="Inter, Arial, sans-serif" fontSize="12.5" fontWeight="600" fill={textColor}>
        {lines.map((l, idx) => <tspan key={idx} x={cx} dy={idx === 0 ? -((lines.length - 1) * 8) : 16}>{l}</tspan>)}
      </text>
    </g>
  );
}

export function FPill({ cx, cy, w, h, label, fill, stroke, textColor = "#14532D" }) {
  return (
    <g>
      <rect x={cx - w / 2} y={cy - h / 2} width={w} height={h} rx={h / 2} fill={fill} stroke={stroke} strokeWidth={1.6} />
      <text x={cx} y={cy} textAnchor="middle" dominantBaseline="middle" fontFamily="Inter, Arial, sans-serif" fontSize="13" fontWeight="700" fill={textColor}>{label}</text>
    </g>
  );
}

export function FArrow({ d, label, labelX, labelY }) {
  return (
    <g>
      <path d={d} fill="none" stroke="#334155" strokeWidth={1.8} markerEnd="url(#arrowhead)" />
      {label && (
        <text x={labelX} y={labelY} textAnchor="middle" fontFamily="Inter, Arial, sans-serif" fontSize="11.5" fontWeight="700" fill="#475569" style={{ paintOrder: "stroke", stroke: "#ffffff", strokeWidth: 4 }}>
          {label}
        </text>
      )}
    </g>
  );
}
