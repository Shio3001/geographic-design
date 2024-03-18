import * as React from "react";
const { useContext, useReducer, createContext, useState, useEffect } = React;
import { createRoot } from "react-dom/client";

type Props = {
  preview_width: number;
  preview_height: number;
  svg_data: string;
};
const Preview = (props: Props) => {
  return (
    <div
      className="preview"
      style={{
        width: "90vw",
        height: "90vh",
      }}
    >
      <iframe
        className="preview_iframe"
        srcDoc={props.svg_data}
        style={{
          width: "100%",
          height: "100%",
        }}
      ></iframe>
    </div>
  );
};
export default Preview;
