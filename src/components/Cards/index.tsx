import { DragIcon } from "@/assets/drag";
import InputWrapper from "../Inputs";
import "./style.scss";
import { ChangeEvent } from "react";

const Cards = (props: CardProps) => {
  return (
    <div className="card-wrapper">
      <div className="card-title">
        <DragIcon /> Function: {props.id}
      </div>
      <InputWrapper
        type="text"
        title="Equation"
        value={props.equation}
        onChange={(e: ChangeEvent<HTMLInputElement>) => {
          props.equationChangeHandler(props.id, e.target.value);
        }}
      />
      <InputWrapper
        disabled={true}
        type="select"
        title="Next function"
        options={props.options}
        value={
          props?.output === "final"
            ? "-"
            : "Function " + props.output?.toString()
        }
        onChange={() => {}}
      />
      <div className="connect-wrapper">
        <div className="link-wrapper">
          <div className={`box input-${props.id}`}></div>input
        </div>
        <div className="link-wrapper">
          output<div className={`box output-${props.id}`}></div>
        </div>
      </div>
    </div>
  );
};

export default Cards;
