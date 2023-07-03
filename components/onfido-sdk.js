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
  const { userData } = useContext(VerifyContext);

  let Onfido;

  const handleGenerateTokenSdk = async () => {
    const { data } = await axios.post(
      "https://d411-115-73-213-212.ngrok-free.app/api/onfido/generate-token",
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
      "https://d411-115-73-213-212.ngrok-free.app/api/workflow_run/create",
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
      "https://d411-115-73-213-212.ngrok-free.app/api/file/create",
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
          }

          // }
        },
        steps: ["welcome", "document", "face", "complete"],
      });
    }
  };
  // const handleOnVerifyByOnfidoModal = async () => {
  //   if (!Onfido) {
  //     Onfido = await import("onfido-sdk-ui");
  //     setLoading(false);
  //   }
  //   let x;
  //   x = Onfido?.init({
  //     useModal: true,
  //     isModalOpen: open,
  //     onModalRequestClose: function () {
  //       // Update options with the state of the modal
  //       x.setOptions({ isModalOpen: false });
  //     },
  //     token:
  //       "eyJhbGciOiJFUzUxMiJ9.eyJleHAiOjE2ODc4MzgzMDcsInBheWxvYWQiOnsiYXBwIjoiY2M0ODZiZDktZGE3ZS00MDY2LWJkYzMtNGJjNTY1ZjBlZDFiIiwiY2xpZW50X3V1aWQiOiJhNTQ4YmY2ZS04ODY2LTQzYWEtYjM5NS1mMzAyMjZkNzk3MTAiLCJpc19zYW5kYm94Ijp0cnVlLCJpc19zZWxmX3NlcnZpY2VfdHJpYWwiOnRydWUsImlzX3RyaWFsIjpmYWxzZSwic2FyZGluZV9zZXNzaW9uIjoiODQ5OTY2MDktOTQ1NC00ZjYyLWFlMzctOWE1MGY2ZTVkYTcxIiwiaGFzX3VzYWdlX3BsYW4iOmZhbHNlfSwidXVpZCI6InBsYXRmb3JtX3N0YXRpY19hcGlfdG9rZW5fdXVpZCIsInVybHMiOnsiZGV0ZWN0X2RvY3VtZW50X3VybCI6Imh0dHBzOi8vc2RrLm9uZmlkby5jb20iLCJzeW5jX3VybCI6Imh0dHBzOi8vc3luYy5vbmZpZG8uY29tIiwiaG9zdGVkX3Nka191cmwiOiJodHRwczovL2lkLm9uZmlkby5jb20iLCJhdXRoX3VybCI6Imh0dHBzOi8vYXBpLm9uZmlkby5jb20iLCJvbmZpZG9fYXBpX3VybCI6Imh0dHBzOi8vYXBpLm9uZmlkby5jb20iLCJ0ZWxlcGhvbnlfdXJsIjoiaHR0cHM6Ly9hcGkub25maWRvLmNvbSJ9fQ.MIGGAkFH00VVYud760VIWwBUXpKTqmq-ZHcq5Dz4EAO7C1lN9Z6hZiFhSoPsQp2quBdfO4YSDYDrU6AbIoMK4vT1u7mgcwJBLfoacz5zsRmjCZdIQqCzuCD9ug0nlwWCS2SFDd5HkxYaJhmQIVJFzhRvO1UvqHiec2qRguGIHFT49WKD5VYw1n0",
  //     containerId: "onfido-mount",

  //     //    containerEl: <div id="root" />, //ALTERNATIVE to `containerId`
  //     onComplete: function (data) {
  //       console.log("everything is complete", data);
  //     },
  //     steps: ["welcome", "document", "face", "complete"],
  //   });
  // };

  const showModal = () => {
    setOpen(true);
    handleOnVerify();
  };

  const handleCancel = () => {
    setOpen(false);
  };

  const [status, setStatus] = useState("loading");
  useLayoutEffect(() => {
    const handleCheckVerified = async () => {
      const workflowRunId = await handleGenerateWorkflowRunId();
      // const workflowRunId = "3b90820c-a4c7-4635-817b-6c2dc84b75ae";

      const { data } = await getDataReportByWorkflowRunId(workflowRunId);

      const parseData = data.map((item) => JSON.parse(item.resource));
      const filterDataHaveOutput = parseData.filter(
        (item) => Object.keys(item?.resource?.output || {})?.length > 0
      );
      const uniqueReportByIdResource = uniqBy(filterDataHaveOutput, (item) => {
        return item.resource.id;
      });
      console.log(uniqueReportByIdResource);

      if (uniqueReportByIdResource && uniqueReportByIdResource.length > 1) {
        if (uniqueReportByIdResource.length < 8) {
          setStatus("verifying");
        } else {
          setStatus("verified");
        }
      } else {
        setStatus("reverify");
      }
    };
    if (userData) handleCheckVerified();
  }, [userData]);

  if (status === "loading")
    return (
      <div className="text-center">
        <Spin loading={loading} size="large" className="mx-auto" />
      </div>
    );

  if (status === "verifying")
    return (
      <div className="text-center">
        <Result title="Verifying..." />
      </div>
    );

  if (status === "verified")
    return (
      <div className="text-center">
        <Result status={"success"} title="Verified" />
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
export default OnfidoSdk;
