import React, { useEffect, useState } from "react";

const TimeAgo = ({ createdAt }) => {
  const [timeAgo, setTimeAgo] = useState("");

  useEffect(() => {
    const calculateTimeAgo = () => {
      const currentDate = new Date();
      const postDate = new Date(createdAt);
      const timeDifference = currentDate - postDate;

      // Convert milliseconds to seconds, minutes, hours, and days
      const seconds = Math.floor(timeDifference / 1000);
      const minutes = Math.floor(seconds / 60);
      const hours = Math.floor(minutes / 60);
      const days = Math.floor(hours / 24);

      // Format the time ago string
      let result = "";
      if (days > 0) {
        result = `${days} day${days > 1 ? "s" : ""} ago`;
      } else if (hours > 0) {
        result = `${hours} hour${hours > 1 ? "s" : ""} ago`;
      } else if (minutes > 0) {
        result = `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
      } else {
        result = `${seconds} second${seconds > 1 ? "s" : ""} ago`;
      }

      setTimeAgo(result);
    };

    calculateTimeAgo();

    // Update time every minute (60,000 milliseconds)
    const intervalId = setInterval(calculateTimeAgo, 60000);

    // Clear interval on component unmount
    return () => clearInterval(intervalId);
  }, [createdAt]);

  return timeAgo;
};

export default TimeAgo;
