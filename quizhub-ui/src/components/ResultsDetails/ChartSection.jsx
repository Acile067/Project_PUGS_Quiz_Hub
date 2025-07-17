import React from "react";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const ChartSection = ({ attempts }) => {
  return (
    <div className="w-full h-72">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={attempts}>
          <CartesianGrid stroke="#ccc" />
          <XAxis
            dataKey="time"
            label={{
              value: "Time (s)",
              position: "insideBottomRight",
              offset: -5,
            }}
          />
          <YAxis
            label={{
              value: "Correct Answers",
              angle: -90,
              position: "insideLeft",
            }}
            allowDecimals={false}
          />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="correctAnswers" stroke="#8884d8" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ChartSection;
