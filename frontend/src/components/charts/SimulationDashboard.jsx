import {
  LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine
} from 'recharts'
import { useChartColors } from '../../utils/themeColors'
import ChartCard from './ChartCard'
import CustomTooltip from './CustomTooltip'
import GlowingDot from './GlowingDot'

export default function SimulationDashboard({ chartData, regenCap = 0 }) {
  const COLORS = useChartColors()

  return (
    <>
      <div className="grid gap-6 lg:grid-cols-2">
        <ChartCard title="Speed Profile" subtitle="MPC = emerald, STD = grey">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} syncId="simulatorCharts" margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
              <defs>
                <linearGradient id="colorSpeedMpc" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={COLORS.cyan} stopOpacity={0.4}/>
                  <stop offset="95%" stopColor={COLORS.cyan} stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorSpeedStd" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={COLORS.white} stopOpacity={0.3}/>
                  <stop offset="95%" stopColor={COLORS.white} stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="4 4" vertical={false} stroke={COLORS.grid} />
              <XAxis dataKey="time" tick={{ fill: COLORS.tick, fontSize: 11, fontWeight: 600 }} tickLine={false} axisLine={false} minTickGap={30} />
              <YAxis tick={{ fill: COLORS.tick, fontSize: 11, fontWeight: 600 }} tickLine={false} axisLine={false} domain={['auto', 'auto']} />
              <Tooltip content={<CustomTooltip unit="km/h" />} cursor={{ stroke: COLORS.tick, strokeWidth: 1.5, strokeDasharray: '4 4' }} />
              <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', fontWeight: 'bold', paddingTop: '14px' }} />
              <Area type="monotone" dataKey="speedStd" name="STD" stroke={COLORS.white} fill="url(#colorSpeedStd)" strokeWidth={3} activeDot={<GlowingDot />} />
              <Area type="monotone" dataKey="speedMpc" name="MPC" stroke={COLORS.cyan} fill="url(#colorSpeedMpc)" strokeWidth={3} activeDot={<GlowingDot />} />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="SOC over Time" subtitle="MPC = green, STD = orange">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} syncId="simulatorCharts" margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
              <defs>
                <linearGradient id="colorSocMpc" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={COLORS.lime} stopOpacity={0.4}/>
                  <stop offset="95%" stopColor={COLORS.lime} stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorSocStd" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={COLORS.orange} stopOpacity={0.3}/>
                  <stop offset="95%" stopColor={COLORS.orange} stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="4 4" vertical={false} stroke={COLORS.grid} />
              <XAxis dataKey="time" tick={{ fill: COLORS.tick, fontSize: 11, fontWeight: 600 }} tickLine={false} axisLine={false} minTickGap={30} />
              <YAxis tick={{ fill: COLORS.tick, fontSize: 11, fontWeight: 600 }} tickLine={false} axisLine={false} domain={['auto', 'auto']} />
              <Tooltip content={<CustomTooltip unit="%" />} cursor={{ stroke: COLORS.tick, strokeWidth: 1.5, strokeDasharray: '4 4' }} />
              <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', fontWeight: 'bold', paddingTop: '14px' }} />
              <Area type="monotone" dataKey="socStd" name="STD" stroke={COLORS.orange} fill="url(#colorSocStd)" strokeWidth={3} activeDot={<GlowingDot />} />
              <Area type="monotone" dataKey="socMpc" name="MPC" stroke={COLORS.lime} fill="url(#colorSocMpc)" strokeWidth={3} activeDot={<GlowingDot />} />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      <div className="grid gap-6 lg:grid-cols-2 mt-6">
        <ChartCard title="Battery Current (A)" subtitle="Dashed lines show the regen cap">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} syncId="simulatorCharts" margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="4 4" vertical={false} stroke={COLORS.grid} />
              <XAxis dataKey="time" tick={{ fill: COLORS.tick, fontSize: 11, fontWeight: 600 }} tickLine={false} axisLine={false} minTickGap={30} />
              <YAxis tick={{ fill: COLORS.tick, fontSize: 11, fontWeight: 600 }} tickLine={false} axisLine={false} />
              <Tooltip content={<CustomTooltip unit="A" />} cursor={{ stroke: COLORS.tick, strokeWidth: 1.5, strokeDasharray: '4 4' }} />
              <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', fontWeight: 'bold', paddingTop: '14px' }} />
              <ReferenceLine y={regenCap} stroke={COLORS.accent} strokeDasharray="6 6" strokeWidth={2} />
              <ReferenceLine y={-regenCap} stroke={COLORS.accent} strokeDasharray="6 6" strokeWidth={2} />
              <Line type="monotone" dataKey="currentStd" name="STD" stroke={COLORS.white} dot={false} strokeWidth={2.5} strokeDasharray="5 5" activeDot={<GlowingDot />} />
              <Line type="monotone" dataKey="currentMpc" name="MPC" stroke={COLORS.cyan} dot={false} strokeWidth={3} activeDot={<GlowingDot />} />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Following Distance (Meters)" subtitle="MPC increases the gap when battery limits tighten">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} syncId="simulatorCharts" margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="4 4" vertical={false} stroke={COLORS.grid} />
              <XAxis dataKey="time" tick={{ fill: COLORS.tick, fontSize: 11, fontWeight: 600 }} tickLine={false} axisLine={false} minTickGap={30} />
              <YAxis tick={{ fill: COLORS.tick, fontSize: 11, fontWeight: 600 }} tickLine={false} axisLine={false} />
              <Tooltip content={<CustomTooltip unit="m" />} cursor={{ stroke: COLORS.tick, strokeWidth: 1.5, strokeDasharray: '4 4' }} />
              <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', fontWeight: 'bold', paddingTop: '14px' }} />
              <Line type="monotone" dataKey="gapStd" name="STD" stroke={COLORS.white} dot={false} strokeWidth={3} activeDot={<GlowingDot />} />
              <Line type="monotone" dataKey="gapMpc" name="MPC" stroke={COLORS.cyan} dot={false} strokeWidth={3} activeDot={<GlowingDot />} />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>
    </>
  )
}
