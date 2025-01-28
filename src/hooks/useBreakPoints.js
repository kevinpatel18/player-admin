import useMediaQuery from "@mui/material/useMediaQuery";

const useBreakPoints = () => {
  let mobileBreakPoint = "600px";
  let tabletBreakPoint = "768px";
  let laptopBreakPoint = "1024px";

  const isMobile = useMediaQuery(`(max-width:${mobileBreakPoint})`);
  const isTablet = useMediaQuery(`(max-width:${tabletBreakPoint})`);
  const isLaptop = useMediaQuery(`(max-width:${laptopBreakPoint})`);

  return {
    tabletBreakPoint,
    mobileBreakPoint,
    isMobile,
    isTablet,
    isLaptop,
  };
};

export default useBreakPoints;
