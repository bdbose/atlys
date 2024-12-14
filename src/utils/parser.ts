type Variables = { [key: string]: number };

export const EquationParser = (
  equation: string,
  variables: Variables
): string => {
  const withMultiplication = equation.replace(/(\d)([a-zA-Z])/g, "$1*$2");
  const replacedEquation = withMultiplication.replace(/[a-zA-Z]+/g, (match) => {
    if (variables[match] === undefined) {
      throw new Error(`Variable "${match}" is not defined.`);
    }
    return variables[match].toString();
  });
  const sanitizedEquation = replacedEquation.replace(/\^/g, "**");

  try {
    return sanitizedEquation;
  } catch (error) {
    throw new Error(`Invalid equation: ${equation}:${error}`);
  }
};
