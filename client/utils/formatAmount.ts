export const formatAmount = (val: number) => {
  const valStr = val.toString();
  if (valStr.length <= 3) {
    return valStr;
  } else if (valStr.length === 4) {
    return `${valStr[0]}.${valStr[1]}${valStr[2]} k`;
  } else if (valStr.length === 5) {
    return `${valStr[0]}${valStr[1]}.${valStr[2]} k`;
  } else if (valStr.length === 6) {
    return `${valStr[0]}.${valStr[1]}${valStr[2]} L`;
  } else {
    return `${valStr[0]}${valStr[1]}.${valStr[2]} L`;
  }
};
