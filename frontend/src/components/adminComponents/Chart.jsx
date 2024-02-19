import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts";

function ChartUi({ details }) {
  const aggregateData = () => {
    const aggregatedData = [];

    // Check if details is defined and is an object
    if (!details || typeof details !== "object") {
      return aggregatedData; // Return empty array if details is not valid
    }

    const currentMonth = new Date().getMonth(); // Get the current month (0-indexed)

    // Aggregate data for current month
    const aggregated = {};
    Object.keys(details).forEach((key) => {
      const data = details[key];
      data.forEach((item) => {
        const date = new Date(item.createdAt);
        const monthName = date.toLocaleString("en-US", { month: "long" });
        if (date.getMonth() === currentMonth) {
          if (!aggregated[key]) {
            aggregated[key] = { name: `${key}`, count: 0 };
          }
          aggregated[key].count++;
        }
      });
    });

    // Push aggregated data to the aggregatedData array
    Object.values(aggregated).forEach((entry) => aggregatedData.push(entry));

    return aggregatedData;
  };

  const data = aggregateData();

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

  const renderCustomizedLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
    index,
  }) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * (Math.PI / 180));
    const y = cy + radius * Math.sin(-midAngle * (Math.PI / 180));

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor={x > cx ? "start" : "end"}
        dominantBaseline="central"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <ResponsiveContainer
      width="100%"
      height={400}
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={renderCustomizedLabel}
          outerRadius={200}
          fill="#8884d8"
          dataKey="count"
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
      </PieChart>
    </ResponsiveContainer>
  );
}

export default ChartUi;
