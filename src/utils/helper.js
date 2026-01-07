// import moment from "moment";
import React from "react";
import { monthListData } from "./jsonData";

export const DisplayFormikState = (props) => (
  <div style={{ margin: "1rem 0" }}>
    <pre
      style={{
        background: "#f6f8fa",
        fontSize: ".65rem",
        padding: ".5rem",
      }}
    >
      <strong>props</strong> = {JSON.stringify(props, null, 2)}
    </pre>
  </div>
);

export const getSPecialityTyre = (tier) => {
  switch (tier) {
    case 1:
      return "Tier 1";
    case 2:
      return "Tier 2";
    case 3:
      return "Tier 3";
    default:
      return "";
  }
};

export const getYearList = () => {
  return Array.from(Array(new Date().getFullYear() - 1949), (_, i) =>
    (i + 1950).toString()
  );
};

export const getMonthName = (monthInNumber) => {
  const month = monthListData.filter((month) => month.id == monthInNumber);
  if (month.length > 0) {
    return month[0]["name"];
  } else {
    return "";
  }
};
