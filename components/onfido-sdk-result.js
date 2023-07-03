import { Button, Modal, Result, Spin } from "antd";
import { useContext, useState } from "react";
import VerifyContext from "./context";

const OnfidoSdkResult = () => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const { userData, setCurrent } = useContext(VerifyContext);


  const [status, setStatus] = useState("verifying");

  if (status === "verifying")
    return (
      <div className="text-center">
        <Result title="Verifying..." />
      </div>
    );

  if (status === "verified")
    return (
      <div className="text-center">
        <Result
          status={"success"}
          title="Verified"
          extra={[
            <Button
              type="primary"
              key="console"
              onClick={() => {
                setCurrent((prev) => prev + 1);
              }}
            >
              Go to Resources
            </Button>,
          ]}
        />
      </div>
    );

  return (
    <>
      <Button type="default" onClick={showModal}>
        Verify
      </Button>
      <Modal
        title="Verifying"
        open={open}
        footer={true}
        onCancel={handleCancel}
        width={"fit-content"}
      >
        <div
          className="d-flex flex-column justify-content-center align-items-center"
          style={{ minWidth: "500px", minHeight: "650px" }}
        >
          <div className="w-100">
            <Spin spinning={loading} tip="Loading" size="large">
              <div id="onfido-mount"></div>
            </Spin>
          </div>
        </div>
      </Modal>
    </>
  );
};
export default OnfidoSdkResult;
