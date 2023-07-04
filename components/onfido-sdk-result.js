import { Button, Modal, Result, Spin } from "antd";
import { useContext, useEffect, useState } from "react";
import VerifyContext from "./context";
import {
  getDataReportByWorkflowRunId,
  getDataWorkflowRunResult,
} from "../common/ultils";

const OnfidoSdkResult = () => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const { setCurrent } = useContext(VerifyContext);

  const [status, setStatus] = useState("verifying");

  useEffect(() => {
    const handleCheckVerified = async () => {
      const dataLocal = JSON.parse(localStorage.getItem("workflow_run"));
      // const workflowRunId = "3b90820c-a4c7-4635-817b-6c2dc84b75ae";
      const workflowRunId = dataLocal.workflow_run_id;
      if (dataLocal.done) {
        const data = await getDataWorkflowRunResult(workflowRunId);
        // const { data } = await getDataReportByWorkflowRunId(workflowRunId);

        // const parseData = data.map((item) => JSON.parse(item.resource));
        // const filterDataHaveOutput = parseData.filter(
        //   (item) => Object.keys(item?.resource?.output || {})?.length > 0
        // );
        // // const uniqueReportByIdResource = uniqBy(
        // //   filterDataHaveOutput,
        // //   (item) => {
        // //     return item.resource.id;
        // //   }
        // // );
        // // console.log(uniqueReportByIdResource);

        // const uniqueReportByIdResource = filterDataHaveOutput;
        console.log(data);
        if (data) {
          setStatus(data.status);
        }
      }
    };
    const userData = JSON.parse(
      localStorage.getItem("customer_onfido") || "{}"
    );
    if (userData) handleCheckVerified();
  }, []);

  if (status === "loading")
    return (
      <div className="text-center">
        <Spin loading={loading} size="large" className="mx-auto" />
      </div>
    );

  if (status === "inprogress" || status === null) {
    return (
      <div className="text-center">
        <Result status={"error"} title="Document have not upload yet..." />
      </div>
    );
  }

  if (status === "verifying")
    return (
      <div className="text-center">
        <Result title="Verifying..." />
      </div>
    );

  if (status === "approved")
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
    <div className="text-center">
      <Result status={"error"} title="Document have not upload yet..." />
    </div>
  );
};
export default OnfidoSdkResult;
