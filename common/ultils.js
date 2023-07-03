import axios from "axios";

export const getDataWorkflowRunResult = async (workflowRunId) => {
  const { data } = await axios.get(
    "http://192.168.3.20:8080/api/workflow_run/get",
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
    "http://192.168.3.20:8080/api/task/list",
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
