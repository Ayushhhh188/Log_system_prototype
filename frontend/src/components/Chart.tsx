import {
  LineChart,
  Line,
  XAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function Chart({ data }: any) {
  return (
    <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-4 rounded-2xl h-[200px]">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <XAxis dataKey="time" hide />
          <Tooltip />
          <Line
            type="monotone"
            dataKey="logs"
            stroke="#60a5fa"
            strokeWidth={2}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}