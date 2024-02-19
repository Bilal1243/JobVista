import React from "react";
import { Chart, LineAdvance, Legend, Tooltip } from "bizcharts";

const MainChartui = ({ details }) => {
  // Function to extract the month from a date string (e.g., "2022-03-15")
  const getMonthFromDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString("en-US", { month: "long" });
  };

  // Get a list of all months
  const allMonths = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  // Convert the details object into an array of objects suitable for the chart
  const data = allMonths.flatMap((month) =>
    Object.keys(details).map((key) => ({
      month,
      type: key,
      count: details[key].filter(
        (item) => getMonthFromDate(item.createdAt) === month
      ).length,
    }))
  );

  return (
    <>
      <Chart padding={[10, 20, 50, 40]} autoFit height={300} data={data} scale={{ month: { range: [0, 1] } }}>
        <Tooltip shared />
        <Legend position="bottom" offsetY={20} />
        <LineAdvance
          shape="smooth"
          point
          area
          position="month*count"
          color="type"
        />
      </Chart>
    </>
  );
};

export default MainChartui;
