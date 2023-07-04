import { Button, FloatButton, message, Steps, theme } from "antd";
import { useEffect, useMemo, useState } from "react";
import FormBegin from "./form-verify";
import OnfidoSdk from "./onfido-sdk";
import VerifyContext from "./context";
import Resources from "./resources";
import FormCheckCode from "./form-code";
import OnfidoSdkResult from "./onfido-sdk-result";
const steps = [
  {
    title: "Check Code",
    content: <FormCheckCode />,
  },
  {
    title: "Verify KYC",
    content: <OnfidoSdk />,
  },
  {
    title: "Verify Result",
    content: <OnfidoSdkResult />,
  },
  {
    title: "Resources",
    content: <Resources />,
  },
];
const StepVerify = () => {
  const { token } = theme.useToken();
  const [current, setCurrent] = useState(0);
  const [userData, setUserData] = useState({});

  const next = () => {
    setCurrent(current + 1);
  };
  const prev = () => {
    setCurrent(current - 1);
  };
  const items = steps.map((item) => ({
    key: item.title,
    title: item.title,
  }));
  const contentStyle = {
    backgroundColor: token.colorFillAlter,
    borderRadius: token.borderRadiusLG,
    border: `1px dashed ${token.colorBorder}`,
    marginTop: 16,
    width: "100%",
    padding: "20px",
  };

  useEffect(() => {
    setUserData(JSON.parse(localStorage.getItem("customer_onfido")));
  }, [current]);

  return (
    <div className="container">
      <VerifyContext.Provider value={{ userData, current, setCurrent }}>
        <Steps current={current} items={items} />

        <div style={contentStyle} className="d-flex flex-column gap-4 ">
          {steps[current].title === "Verify" && (
            <div className="">
              <b>{userData?.first_name}</b> <b>{userData?.last_name}</b>
            </div>
          )}
          <div className="w-100">{steps[current].content}</div>
        </div>
        <div
          style={{
            marginTop: 24,
          }}
        >
          {current > 0 && (
            <Button
              style={{
                margin: "0 8px",
              }}
              onClick={() => prev()}
            >
              Previous
            </Button>
          )}
          {current < steps.length - 1 && (
            <Button type="primary" onClick={() => next()}>
              Next
            </Button>
          )}

          {current === steps.length - 1 && (
            <Button
              type="primary"
              onClick={() => message.success("Processing complete!")}
            >
              Done
            </Button>
          )}
        </div>
        <FloatButton
          onClick={() => {
            localStorage.clear();
          }}
          tooltip={<div>Clear all Data</div>}
        ></FloatButton>
      </VerifyContext.Provider>
    </div>
  );
};
export default StepVerify;
