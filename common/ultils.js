import axios from "axios";

export const getDataWorkflowRunResult = async (workflowRunId) => {
  const { data } = await axios.get(
    "https://d411-115-73-213-212.ngrok-free.app/api/workflow_run/get",
    {
      params: {
        workflow_run_id: workflowRunId,
      },
    },
    {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json",
      },
    }
  );

  return data;
};

export const getDataReportByWorkflowRunId = async (workflowRunId) => {
  const { data } = await axios.get(
    "https://d411-115-73-213-212.ngrok-free.app/api/task/list",
    {
      params: {
        workflow_run_id: workflowRunId,
      },
    },
    {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json",
      },
    }
  );

  return data;
};
