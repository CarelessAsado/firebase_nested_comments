import { useEffect, useState } from "react";

type IProps = { options?: IntersectionObserverInit };

export const useIntersectionObserver = ({ options }: IProps = {}) => {
  //ARRAY DE ENTRIES Q ME DEVUELVE USEREF.CURRENT
  const [entriesCB, setEntriesCB] = useState<IntersectionObserverEntry[]>([]);
  const [observer] = useState(
    new IntersectionObserver(function (entries) {
      setEntriesCB(entries);
    }, options)
  );

  //ELEMENTOS Q QUIERO OBSERVAR
  const [HTMLelementsObserved, setHTMLElementsObserved] = useState<
    HTMLDivElement[]
  >([]);

  useEffect(() => {
    if (HTMLelementsObserved.length > 0) {
      HTMLelementsObserved.forEach((e) => {
        observer.observe(e);
      });
    }
    return () => {
      if (HTMLelementsObserved.length > 0) {
        HTMLelementsObserved.forEach((e) => {
          observer.unobserve(e);
        });
      }
    };
  }, [HTMLelementsObserved, observer]);
  return { observer, setHTMLElementsObserved, entriesCB };
};
