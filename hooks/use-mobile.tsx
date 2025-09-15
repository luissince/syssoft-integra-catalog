import * as React from "react"

export function useIsMobile(): boolean {
  const [isMobile, setIsMobile] = React.useState<boolean>(false)

  React.useEffect(() => {
    const checkIfMobileOrTablet = () => {
      if (typeof window !== "undefined") {
        const userAgent = navigator.userAgent.toLowerCase();
        const isMobileOrTabletAgent =
          /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent);
        const isSmallScreen = window.innerWidth <= 1024;
        setIsMobile(isMobileOrTabletAgent || isSmallScreen);
      }
    };

    checkIfMobileOrTablet();
    window.addEventListener("resize", checkIfMobileOrTablet);
    return () => window.removeEventListener("resize", checkIfMobileOrTablet);
  }, []);

  return isMobile
}
