import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts";

function PieChartUi({ details }) {
  console.log(details);
  const aggregateData = () => {
    const aggregatedData = [];
  
    // Check if details is defined and is an object
    if (!details || typeof details !== "object") {
      return aggregatedData; // Return empty array if details is not valid
    }
  
    const currentMonth = new Date().getMonth(); // Get the current month (0-indexed)
  
    // Create a map to store aggregated counts for each category
    const aggregatedCounts = {
      users: 0,
      recruiters: 0,
      posts: 0,
      jobs: 0,
    };
  
    // Aggregate data for current month
    Object.keys(details).forEach((key) => {
      const data = details[key];
      data.forEach((item) => {
        const date = new Date(item.createdAt);
        if (date.getMonth() === currentMonth) {
          aggregatedCounts[key]++;
        }
      });
    });
  
    // Convert aggregated counts map to an array of objects
    Object.keys(aggregatedCounts).forEach((key) => {
      // Always include the category, even if count is 0
      aggregatedData.push({ name: key, count: aggregatedCounts[key] });
    });
  
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

export default PieChartUi;
