import React from "react";
import PropTypes from "prop-types";
import { DateTime } from "luxon";

const RelativeTime = ({ value }) => {
  const now = DateTime.now();
  const createdAt = DateTime.fromISO(value);

  const diffInSeconds = Math.floor((now - createdAt) / 1000);

  let relativeTime;
  if (diffInSeconds < 60) relativeTime = "just now";
  else if (diffInSeconds < 3600)
    relativeTime = `${Math.floor(diffInSeconds / 60)} min ago`;
  else if (diffInSeconds < 86400)
    relativeTime = `${Math.floor(diffInSeconds / 3600)} hours ago`;
  else relativeTime = `${Math.floor(diffInSeconds / 86400)} days ago`;

  return <span>{relativeTime}</span>;
};

RelativeTime.propTypes = {
  value: PropTypes.string.isRequired,
};

export default RelativeTime;
