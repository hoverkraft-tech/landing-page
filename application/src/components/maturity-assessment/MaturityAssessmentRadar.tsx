import React, { useMemo } from 'react';

import type { MaturityAssessmentAxis } from '~/data/maturity-assessment';

type Props = {
  id: string;
  axes: MaturityAssessmentAxis[];
  axisValues: Record<string, number>;
};

const cx = 250;
const cy = 250;
const radius = 180;
const levels = 5;

const buildPolygonPoints = (axesCount: number, factor: number) => {
  const angleSlice = (Math.PI * 2) / axesCount;
  const points: string[] = [];

  for (let i = 0; i < axesCount; i += 1) {
    const angle = i * angleSlice - Math.PI / 2;
    const x = cx + radius * factor * Math.cos(angle);
    const y = cy + radius * factor * Math.sin(angle);
    points.push(`${x},${y}`);
  }

  return points.join(' ');
};

const MaturityAssessmentRadar = ({ id, axes, axisValues }: Props) => {
  const angleSlice = useMemo(() => (axes.length > 0 ? (Math.PI * 2) / axes.length : 0), [axes.length]);

  const gridPolygons = useMemo(() => {
    if (!axes.length) return [];
    return Array.from({ length: levels }, (_, index) => {
      const level = index + 1;
      return buildPolygonPoints(axes.length, level / levels);
    });
  }, [axes.length]);

  const axesLines = useMemo(() => {
    if (!axes.length) return [];
    return axes.map((axis, index) => {
      const angle = index * angleSlice - Math.PI / 2;
      const x2 = cx + radius * Math.cos(angle);
      const y2 = cy + radius * Math.sin(angle);
      const labelRadius = radius + 28;
      const lx = cx + labelRadius * Math.cos(angle);
      const ly = cy + labelRadius * Math.sin(angle);

      const labelParts = String(axis.label ?? '')
        .split(' ')
        .filter(Boolean);

      return { axisId: axis.id, x2, y2, lx, ly, labelParts };
    });
  }, [axes, angleSlice]);

  const dataPoints = useMemo(() => {
    if (!axes.length) return [];
    return axes.map((axis, index) => {
      const angle = index * angleSlice - Math.PI / 2;
      const value = axisValues[axis.id] ?? 0;
      const factor = value / 5;
      const x = cx + radius * factor * Math.cos(angle);
      const y = cy + radius * factor * Math.sin(angle);
      return { x, y, id: axis.id };
    });
  }, [axes, angleSlice, axisValues]);

  const dataPolygonPoints = dataPoints.map((point) => `${point.x},${point.y}`).join(' ');

  return (
    <div className="mx-auto mt-4 w-full max-w-[420px]">
      <svg
        data-radar
        viewBox="0 0 500 500"
        className="h-auto w-full text-secondary"
        role="img"
        aria-label="Radar de maturité"
        tabIndex={0}
        focusable="true"
      >
        <defs>
          <linearGradient id={`${id}-polyGradient`} x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="currentColor" stopOpacity="0.55" />
            <stop offset="100%" stopColor="currentColor" stopOpacity="0.15" />
          </linearGradient>
        </defs>

        {gridPolygons.map((points, index) => (
          <polygon
            key={`grid-${index}`}
            points={points}
            fill="none"
            stroke="var(--aw-color-text-muted)"
            strokeOpacity="0.35"
            strokeWidth="1"
          />
        ))}

        {axesLines.map((line) => (
          <g key={line.axisId}>
            <line
              x1={cx}
              y1={cy}
              x2={line.x2}
              y2={line.y2}
              stroke="var(--aw-color-text-muted)"
              strokeOpacity="0.35"
              strokeWidth="1"
            />
            <text
              x={line.lx}
              y={line.ly}
              textAnchor="middle"
              dominantBaseline="middle"
              fill="var(--aw-color-text-muted)"
              fontSize="11px"
              fontWeight={600}
            >
              {line.labelParts.length > 1
                ? line.labelParts.map((part, idx) => (
                    <tspan key={part} x={line.lx} dy={idx === 0 ? '-0.4em' : '1.1em'}>
                      {part}
                    </tspan>
                  ))
                : line.labelParts[0]}
            </text>
          </g>
        ))}

        {dataPolygonPoints ? (
          <polygon
            points={dataPolygonPoints}
            fill={`url(#${id}-polyGradient)`}
            stroke="currentColor"
            strokeWidth="2"
            opacity={0.95}
          />
        ) : null}

        {dataPoints.map((point) => (
          <circle
            key={`point-${point.id}`}
            cx={point.x}
            cy={point.y}
            r={4}
            fill="var(--aw-color-bg-page)"
            stroke="currentColor"
            strokeWidth="2"
          />
        ))}
      </svg>
    </div>
  );
};

export default MaturityAssessmentRadar;
