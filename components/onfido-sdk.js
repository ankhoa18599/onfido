import { Button, Modal, Result, Spin } from "antd";
import axios from "axios";
import { useContext, useEffect, useLayoutEffect, useState } from "react";
import VerifyContext from "./context";
import moment from "moment/moment";
import { getDataReportByWorkflowRunId } from "../common/ultils";
import { uniqBy } from "lodash";

const isObjectEmpty = (obj) => Object.keys(obj).length === 0;

const isVerifyExisted = (data) => {
  const dataVerifyLocal = JSON.parse(
    localStorage.getItem("data_verify") || "[]"
  );

  const filterApplicant = dataVerifyLocal?.find(
    (item) => item.applicant_id === data.applicant_id
  );

  return data.document_back.id === filterApplicant?.document_back?.id;
};
const OnfidoSdk = () => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const { setCurrent } = useContext(VerifyContext);
  let Onfido;

  const [userData, setUserData] = useState();

  useEffect(() => {
    setUserData(JSON.parse(localStorage.getItem("customer_onfido") || "{}"));
  }, []);

  const [workFlowRun, setWorkFlowRun] = useState();

  useEffect(() => {
    const dataLocal = JSON.parse(localStorage.getItem("workflow_run") || "{}");

    setWorkFlowRun(dataLocal);
  }, []);

  if (workFlowRun?.done) {
    return (
      <div className="text-center">
        <Result
          status={"success"}
          title="Update Document Success"
          extra={[
            <Button
              type="primary"
              key="console"
              onClick={() => {
                setCurrent((prev) => prev + 1);
              }}
            >
              Go to Verify Result
            </Button>,
          ]}
        />
      </div>
    );
  }

  const handleGenerateTokenSdk = async () => {
    const { data } = await axios.post(
      "https://d2q3u1swggiif7.cloudfront.net/api/onfido/generate-token",
      {
        applicant_id: userData.applicant_id,
      },
      {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Content-Type": "application/json",
        },
      }
    );
    return data.token;
  };

  const handleGenerateWorkflowRunId = async () => {
    const { data } = await axios.post(
      "https://d2q3u1swggiif7.cloudfront.net/api/workflow_run/create",
      {
        applicant_id: userData.applicant_id,
      },
      {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Content-Type": "application/json",
        },
      }
    );
    return data.workflow_run_id;
  };

  const handleSendDataCompleteToBackend = async (dataSend) => {
    const { data } = await axios.post(
      "https://d2q3u1swggiif7.cloudfront.net/api/file/create",
      dataSend,
      {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Content-Type": "application/json",
        },
      }
    );
    return data;
  };

  const storageTokenLocal = async () => {
    const token = await handleGenerateTokenSdk();

    const dataStorage = {
      token,
      expired: moment().add(90, "minutes"),
    };
    localStorage.setItem("verify_token", JSON.stringify(dataStorage));

    return token;
  };

  const storageWorkflowRunIdLocal = async () => {
    const workflowRunId = await handleGenerateWorkflowRunId();

    const dataStorage = {
      workflow_run_id: workflowRunId,
      done: false,
    };
    localStorage.setItem("workflow_run", JSON.stringify(dataStorage));

    return workflowRunId;
  };

  const getTokenSDK = async () => {
    const sdkLocalStorage = JSON.parse(
      localStorage.getItem("verify_token") || "{}"
    );

    let token = null;

    if (isObjectEmpty(sdkLocalStorage)) {
      token = await storageTokenLocal();
      return token;
    }

    const tokenExpired = moment().isAfter(moment(sdkLocalStorage.expired));
    if (tokenExpired) {
      token = await storageTokenLocal();
      return token;
    }

    return sdkLocalStorage.token;
  };

  const getWorkflowRunId = async () => {
    const workflowLocalStorage = JSON.parse(
      localStorage.getItem("workflow_run") || "{}"
    );

    let workflowRunId = null;

    if (isObjectEmpty(workflowLocalStorage)) {
      workflowRunId = await storageWorkflowRunIdLocal();
      return workflowRunId;
    }

    if (workflowLocalStorage.done) {
      workflowRunId = await storageWorkflowRunIdLocal();
      return workflowRunId;
    }

    return workflowLocalStorage.workflow_run_id;
  };

  const handleOnVerify = async () => {
    if (!Onfido) {
      Onfido = await import("onfido-sdk-ui");
      setLoading(false);
    }

    const token = await getTokenSDK();
    if (token) {
      const workflowRunId = await getWorkflowRunId();
      Onfido?.init({
        token,
        workflowRunId: workflowRunId,
        containerId: "onfido-mount",
        //    containerEl: <div id="root" />, //ALTERNATIVE to `containerId`
        onComplete: async function (dataOnfido) {
          console.log("everything is complete", dataOnfido);

          if (isObjectEmpty(dataOnfido)) return;

          const dataVerify = {
            ...dataOnfido,
            applicant_id: userData.applicant_id,
          };

          const { data } = await handleSendDataCompleteToBackend(dataVerify);

          // if (!isVerifyExisted(dataVerify)) {
          const dataVerifyLocal = JSON.parse(
            localStorage.getItem("data_verify") || "[]"
          );
          const dataVerifyStorage = [...dataVerifyLocal, data];
          localStorage.setItem(
            "data_verify",
            JSON.stringify(dataVerifyStorage)
          );

          const workflowRunLocal = JSON.parse(
            localStorage.getItem("workflow_run")
          );
          if (workflowRunLocal) {
            const dataWorkflowStorage = {
              ...workflowRunLocal,
              done: true,
            };

            localStorage.setItem(
              "workflow_run",
              JSON.stringify(dataWorkflowStorage)
            );
            setWorkFlowRun(dataWorkflowStorage);
          }

          // }
        },
        steps: ["welcome", "document", "face", "complete"],
      });
    }
  };

  const showModal = () => {
    setOpen(true);
    handleOnVerify();
  };

  const handleCancel = () => {
    setOpen(false);
  };

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
export default OnfidoSdk;
