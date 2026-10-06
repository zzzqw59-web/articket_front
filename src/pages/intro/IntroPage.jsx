import React from "react";
import IntroComponent from "./IntroComponent";
import IntroLayout from "../../layouts/IntroLayout";
import { useEffect } from "react";

const IntroPage = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <IntroLayout>
        <IntroComponent />
      </IntroLayout>
    </>
  );
};

export default IntroPage;
