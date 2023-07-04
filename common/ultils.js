import axios from "axios";

export const getDataWorkflowRunResult = async (workflowRunId) => {
  const { data } = await axios.get(
    "https://d2q3u1swggiif7.cloudfront.net/api/workflow_run/get",
    {
      params: {
        workflow_run_id: workflowRunId,
      },
    },
    {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json",
        "ngrok-skip-browser-warning": true,
      },
    }
  );

  return data;
};

export const getDataReportByWorkflowRunId = async (workflowRunId) => {
  const { data } = await axios.get(
    "https://d2q3u1swggiif7.cloudfront.net/api/task/list",
    {
      params: {
        workflow_run_id: workflowRunId,
      },
    },
    {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json",

        "ngrok-skip-browser-warning": true,
      },
    }
  );

  return data;
};
