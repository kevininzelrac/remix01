export const pxToVw = (width: number) => {
  return {
    number: ((width * 100) / window.innerWidth).toFixed(2),
    vw: ((width * 100) / window.innerWidth).toFixed(2) + "vw",
  };
};
export const pxToVh = (height: number) => {
  return {
    number: ((height * 100) / window.innerHeight).toFixed(2),
    vh: ((height * 100) / window.innerHeight).toFixed(2) + "vh",
  };
};

export const pxTo100 = (width: number, parent: number) => {
  return ((width * 100) / parent).toFixed(2) + "%";
};
