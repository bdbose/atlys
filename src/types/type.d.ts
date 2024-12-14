interface InputProps {
  type: "text" | "select";
  title: string;
  value: string;
  onChange: ChangeEvent<HTMLInputElement>;
  placeholder?: string;
  options?: string[];
  disabled?: boolean;
}

interface CardProps {
  id: number;
  input: string | number;
  output: string | number;
  equation: string;
  nextFuncId?: number;
  options: string[];
  equationChangeHandler: (id: number, v: string) => void;
}

interface FuncObject {
  id: number;
  nextFunc: number | "final";
  prevFunc: number | "init";
  equation: string;
}
