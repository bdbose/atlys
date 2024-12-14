import Cards from "@/components/Cards";
import { EquationParser } from "@/utils/parser";
import { ChangeEvent, useCallback, useEffect, useRef, useState } from "react";

import "@/styles/home.scss";
import Head from "next/head";

export default function Home() {
  const [value, setValue] = useState<string>("2");
  const [result, setResult] = useState<number>(0);
  const [error, setError] = useState("");

  const svgRef = useRef<SVGSVGElement>(null);

  const [funcArr, setFuncArr] = useState<FuncObject[]>([
    {
      id: 1,
      nextFunc: 2,
      prevFunc: "init",
      equation: "x^2",
    },
    {
      id: 2,
      nextFunc: 4,
      prevFunc: 1,
      equation: "2x+4",
    },
    {
      id: 3,
      nextFunc: "final",
      prevFunc: 5,
      equation: "x^2+20",
    },
    {
      id: 4,
      nextFunc: 5,
      prevFunc: 2,
      equation: "x-2",
    },
    {
      id: 5,
      nextFunc: 3,
      prevFunc: 4,
      equation: "x/2",
    },
  ]);

  const calculateResult = useCallback((): void => {
    try {
      setError("");
      setResult(0);
      let currentFunc = funcArr.find(
        (func: FuncObject) => func.prevFunc === "init"
      );
      let x = parseInt(value);

      if (currentFunc) {
        while (currentFunc?.nextFunc !== "final") {
          const equation = EquationParser(currentFunc?.equation || "", {
            x: x,
          });

          x = eval(equation);
          currentFunc = funcArr.find(
            (func) => func.id === currentFunc?.nextFunc
          );
        }

        if (currentFunc) {
          const finalEquation = EquationParser(currentFunc.equation, {
            x: x,
          });
          x = eval(finalEquation);
        }
      }

      setResult(x);
    } catch (err) {
      setError(`Invalid Equation: ${err}`);
    }
  }, [value, funcArr]);

  const equationChangeHandler = useCallback(
    (id: number, equa: string) => {
      const temp = funcArr.map((e) => {
        if (e.id == id) {
          return { ...e, equation: equa };
        }
        return e;
      });

      setFuncArr([...temp]);
    },
    [funcArr, value]
  );

  useEffect(() => {
    calculateResult();
  }, [value, funcArr]);

  const drawConnections = useCallback(() => {
    const svg = svgRef.current;
    if (!svg) return;

    while (svg.firstChild) {
      svg.removeChild(svg.firstChild);
    }
    const createHalfCircularPath = (
      startX: number,
      startY: number,
      endX: number,
      endY: number
    ): string => {
      const radiusX = Math.abs(startX - endX) <= 20 ? 10 : 30;
      const radiusY = Math.abs(startY - endY) <= 20 ? 10 : 50;

      const largeArcFlag = 0;
      const sweepFlag = 0;

      return `
    M ${startX},${startY}
    A ${radiusX},${radiusY} 0 ${largeArcFlag},${sweepFlag} ${endX},${endY}
  `;
    };
    const createCurvedPath = (
      startX: number,
      startY: number,
      endX: number,
      endY: number,
      id: string | number
    ) => {
      const controlX1 = startX + (endX - startX) * 0.35;
      const controlY1 = startY;
      const controlX2 = startX + (endX - startX) * 0.65;
      const controlY2 = endY;

      if (
        (Math.abs(startX - endX) <= 20 || Math.abs(startY - endY) <= 20) &&
        typeof id != "string"
      ) {
        return createHalfCircularPath(startX, startY, endX, endY);
      }

      return `
      M ${startX},${startY} 
      C ${controlX1},${controlY1} 
        ${controlX2},${controlY2} 
        ${endX},${endY}
    `;
    };

    const initBox = document.querySelector(".box.output-init");
    const firstNode = funcArr.find((func) => func.prevFunc === "init");

    if (initBox && firstNode) {
      const firstNodeInput = document.querySelector(
        `.box.input-${firstNode.id}`
      );

      if (firstNodeInput) {
        const initRect = initBox.getBoundingClientRect();
        const firstNodeRect = firstNodeInput.getBoundingClientRect();

        const pathData = createCurvedPath(
          initRect.left + initRect.width / 2,
          initRect.top + initRect.height / 2,
          firstNodeRect.left + firstNodeRect.width / 2,
          firstNodeRect.top + firstNodeRect.height / 2,
          "init"
        );

        const path = document.createElementNS(
          "http://www.w3.org/2000/svg",
          "path"
        );
        path.setAttribute("d", pathData);
        path.setAttribute("stroke", "black");
        path.setAttribute("fill", "none");
        path.setAttribute("stroke-width", "2");
        svg.appendChild(path);
      }
    }

    let currentFunc = firstNode;

    while (currentFunc && currentFunc.nextFunc !== "final") {
      const inputElement = document.querySelector(
        `.box.input-${currentFunc.nextFunc}`
      );
      const outputElement = document.querySelector(
        `.box.output-${currentFunc.id}`
      );

      if (inputElement && outputElement) {
        const inputRect = inputElement.getBoundingClientRect();
        const outputRect = outputElement.getBoundingClientRect();

        const pathData = createCurvedPath(
          outputRect.left + outputRect.width / 2,
          outputRect.top + outputRect.height / 2,
          inputRect.left + inputRect.width / 2,
          inputRect.top + inputRect.height / 2,
          currentFunc.id
        );

        const path = document.createElementNS(
          "http://www.w3.org/2000/svg",
          "path"
        );
        path.setAttribute("d", pathData);
        path.setAttribute("stroke", "black");
        path.setAttribute("fill", "none");
        path.setAttribute("stroke-width", "2");
        svg.appendChild(path);
      }

      currentFunc = funcArr.find((func) => func.id === currentFunc?.nextFunc);
    }

    const finalBox = document.querySelector(".box.output-final");
    const lastNode = funcArr.find((func) => func.nextFunc === "final");

    if (finalBox && lastNode) {
      const lastNodeOutput = document.querySelector(
        `.box.output-${lastNode.id}`
      );

      if (lastNodeOutput) {
        const finalRect = finalBox.getBoundingClientRect();
        const lastNodeRect = lastNodeOutput.getBoundingClientRect();

        const pathData = createCurvedPath(
          lastNodeRect.left + lastNodeRect.width / 2,
          lastNodeRect.top + lastNodeRect.height / 2,
          finalRect.left + finalRect.width / 2,
          finalRect.top + finalRect.height / 2,
          "final"
        );

        const path = document.createElementNS(
          "http://www.w3.org/2000/svg",
          "path"
        );
        path.setAttribute("d", pathData);
        path.setAttribute("stroke", "black");
        path.setAttribute("fill", "none");
        path.setAttribute("stroke-width", "2");
        svg.appendChild(path);
      }
    }
  }, [funcArr]);

  const valueHandler = (e: ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  };

  useEffect(() => {
    drawConnections();
    window.addEventListener("resize", drawConnections);
    return () => window.removeEventListener("resize", drawConnections);
  }, [drawConnections, result]);

  return (
    <div className="home-wrapper">
      <Head>
        <title>Atlys Assignment</title>
      </Head>
      <div className="card-container">
        {funcArr.map((e) => {
          return (
            <div className="card-cover" key={e.id}>
              {e.prevFunc === "init" && (
                <div className="input-box init">
                  <span>Initial value of x</span>
                  <div className="box-wrapper">
                    <input value={value} onChange={valueHandler} />
                    <div className={`box output-init`}></div>
                  </div>
                </div>
              )}
              <Cards
                id={e.id}
                equation={e.equation}
                input={e.prevFunc}
                output={e.nextFunc}
                equationChangeHandler={equationChangeHandler}
                options={funcArr.map((e) => {
                  return "Function " + e.id?.toString();
                })}
              />
              {e.nextFunc === "final" && (
                <div className="input-box output">
                  <span>Final Output y</span>
                  <div className="box-wrapper">
                    <div className={`box output-final`}></div>
                    {error || result}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
      <svg
        ref={svgRef}
        className="connection-svg"
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          pointerEvents: "none",
        }}
      ></svg>
    </div>
  );
}
