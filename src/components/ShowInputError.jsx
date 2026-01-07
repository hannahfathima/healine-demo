import React from "react";

const ShowInputError = (props: any) => {
  // console.log(props);
  return (
    <p style={{ color: "red", padding: "5px" }} className="help is-danger">
      {props.children}
    </p>
  );
};

export default ShowInputError;
