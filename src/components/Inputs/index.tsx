import "./style.scss";

const InputWrapper = (props: InputProps) => {
  return (
    <div className="input-wrapper">
      <span>{props.title}</span>
      {props.type === "text" && (
        <input
          placeholder={props.placeholder}
          value={props.value}
          onChange={props.onChange}
        />
      )}
      {props.type === "select" && (
        <select
          value={props.value}
          onChange={props.onChange}
          disabled={props.disabled}
        >
          <option value={""}>-</option>
          {props?.options?.map((e: string) => {
            return <option key={e}>{e}</option>;
          })}
        </select>
      )}
    </div>
  );
};

export default InputWrapper;
