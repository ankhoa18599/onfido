import React, { useContext, useEffect, useMemo, useState } from "react";
import VerifyContext from "./context";
import {
  Badge,
  Button,
  Col,
  Collapse,
  Descriptions,
  Image,
  Modal,
  Result,
  Row,
  Space,
  Tag,
  Typography,
} from "antd";
import axios from "axios";
import { uniqBy } from "lodash";
import moment from "moment";
import {
  getDataReportByWorkflowRunId,
  getDataWorkflowRunResult,
} from "common/ultils";

/*** Vendors ***/

/*** components ***/

/*** ========== ***/

/**
 *
 * @param {{
 * }} props Props for the component
 *
 */

const handleDownloadResources = async (dataSend) => {
  const { data, headers, request } = await axios.get(
    "http://192.168.3.20:8080/api/file/download",
    {
      params: dataSend,
    },
    {
      responseType: "arraybuffer",
    }
  );

  return request.responseURL;
};

const StartReport = ({ data }) => {
  if (data) {
    const { input, output, updated_at, created_at } = data.resource;

    return (
      <div>
        <Space direction="vertical" size="middle" className="d-flex">
          <Descriptions title="Result" bordered>
            <Descriptions.Item label="Create at" span={1.5}>
              {moment(created_at).format("HH:mm:ss - DD/MM/YYYY")}
            </Descriptions.Item>
            <Descriptions.Item label="Update at" span={1.5}>
              {moment(updated_at).format("HH:mm:ss - DD/MM/YYYY")}
            </Descriptions.Item>
          </Descriptions>
        </Space>
      </div>
    );
  }
};
const ProfileReport = ({ data }) => {
  if (data) {
    const { input, output, updated_at, created_at } = data.resource;

    return (
      <div>
        <Space direction="vertical" size="middle" className="d-flex">
          <Descriptions title="Result" bordered>
            <Descriptions.Item label="Create at" span={1.5}>
              {moment(created_at).format("HH:mm:ss - DD/MM/YYYY")}
            </Descriptions.Item>
            <Descriptions.Item label="Update at" span={1.5}>
              {moment(updated_at).format("HH:mm:ss - DD/MM/YYYY")}
            </Descriptions.Item>
          </Descriptions>
          <Descriptions title="User Info" bordered>
            {Object.keys(output).map((item) => {
              const value = output[item];
              return (
                <>
                  <Descriptions.Item
                    label={
                      <span className="text-capitalize">
                        {item.split("_").join(" ")}
                      </span>
                    }
                    span={1.5}
                  >
                    {value}
                  </Descriptions.Item>
                </>
              );
            })}
          </Descriptions>
        </Space>
      </div>
    );
  }
};
const DocumentPhotoReport = ({ data }) => {
  if (data) {
    const { input, output, updated_at, created_at } = data.resource;

    return (
      <div>
        <Space direction="vertical" size="middle" className="d-flex">
          <Descriptions title="Result" bordered>
            <Descriptions.Item label="Create at" span={1.5}>
              {moment(created_at).format("HH:mm:ss - DD/MM/YYYY")}
            </Descriptions.Item>
            <Descriptions.Item label="Update at" span={1.5}>
              {moment(updated_at).format("HH:mm:ss - DD/MM/YYYY")}
            </Descriptions.Item>
          </Descriptions>
          <Descriptions title="Documents" bordered>
            <Descriptions.Item label="Document" span={1.5}>
              {output[0].id}
            </Descriptions.Item>
            <Descriptions.Item label="Type" span={1.5}>
              {output[0].type}
            </Descriptions.Item>
            <Descriptions.Item label="Document" span={1.5}>
              {output[1].id}
            </Descriptions.Item>
            <Descriptions.Item label="Type" span={1.5}>
              {output[1].type}
            </Descriptions.Item>
          </Descriptions>
        </Space>
      </div>
    );
  }
};
const KnownFacesCheckReport = ({ data }) => {
  if (data) {
    const { input, output, updated_at, created_at } = data?.resource;
    const { result, status, sub_result, breakdown, properties } = output;

    return (
      <div>
        <Space direction="vertical" size="middle" className="d-flex">
          <Descriptions title="Result" bordered>
            <Descriptions.Item label="Result" span={1.5}>
              {result}
            </Descriptions.Item>
            <Descriptions.Item label="Status" span={1.5}>
              {status}
            </Descriptions.Item>
            <Descriptions.Item label="Create at" span={1.5}>
              {moment(created_at).format("HH:mm:ss - DD/MM/YYYY")}
            </Descriptions.Item>
            <Descriptions.Item label="Update at" span={1.5}>
              {moment(updated_at).format("HH:mm:ss - DD/MM/YYYY")}
            </Descriptions.Item>
          </Descriptions>

          <Descriptions title="Breakdown" bordered>
            {Object.keys(breakdown).map((item) => {
              const value = breakdown[item];
              return (
                <>
                  <Descriptions.Item
                    label={
                      <span className="text-capitalize">
                        {item.split("_").join(" ")}
                      </span>
                    }
                    span={1.5}
                  >
                    {value.result}
                  </Descriptions.Item>
                </>
              );
            })}
          </Descriptions>

          <Descriptions title="Properties" bordered>
            {Object.keys(properties).map((item) => {
              const value = properties[item];

              return (
                <Descriptions.Item
                  key={item}
                  label={
                    <span className="text-capitalize">
                      {item.split("_").join(" ")}
                    </span>
                  }
                  span={3}
                >
                  <Row>
                    {value.map((valueItem) => (
                      <Col span={12} key={valueItem}>
                        <b className="text-capitalize">applicant</b> :
                        {valueItem.applicant_id} <br />
                        <b className="text-capitalize">score</b> :
                        {valueItem.score}
                        <br />
                        <b className="text-capitalize">suspected</b> :
                        {valueItem.suspected.toString()}
                        <br />
                      </Col>
                    ))}
                  </Row>
                </Descriptions.Item>
              );
            })}
          </Descriptions>
        </Space>
      </div>
    );
  }
};
const DocumentCheckWithAddressReport = ({ data }) => {
  if (data) {
    const { input, output, updated_at, created_at } = data.resource;
    const { result, status, sub_result, properties } = output;

    return (
      <div>
        <Space direction="vertical" size="middle" className="d-flex">
          <Descriptions title="Result" bordered>
            <Descriptions.Item label="Result">{result}</Descriptions.Item>
            <Descriptions.Item label="Status">{status}</Descriptions.Item>
            <Descriptions.Item label="Sub result">
              {sub_result}
            </Descriptions.Item>
            <Descriptions.Item label="Create at" span={3}>
              {moment(created_at).format("HH:mm:ss - DD/MM/YYYY")}
            </Descriptions.Item>
            <Descriptions.Item label="Update at" span={2}>
              {moment(updated_at).format("HH:mm:ss - DD/MM/YYYY")}
            </Descriptions.Item>
          </Descriptions>

          <Descriptions title="Document Properties" bordered>
            <Descriptions.Item label="Address" span={3}>
              {properties.address}
            </Descriptions.Item>
            <Descriptions.Item label="Address Line" span={3}>
              Line: {properties.address_lines.line1}
              <br />
              State: {properties.address_lines.state}
              <br />
              Town: {properties.address_lines.town}
              <br />
            </Descriptions.Item>

            <Descriptions.Item label="Bar Code" span={3}>
              <Row>
                {Object.keys(properties.barcode).map((item, index) => {
                  return (
                    <Col key={index} span={12}>
                      <b className="text-capitalize ">
                        {item.split("_").join(" ")}
                      </b>
                      <span>: {properties.barcode[item]}</span>
                    </Col>
                  );
                })}
              </Row>
            </Descriptions.Item>

            {Object.keys(properties).map((item) => {
              const value = properties[item];
              if (typeof value === "string")
                return (
                  <Descriptions.Item
                    label={
                      <span className="text-capitalize">
                        {item.split("_").join(" ")}
                      </span>
                    }
                    span={1.5}
                  >
                    {value}
                  </Descriptions.Item>
                );
            })}
          </Descriptions>
        </Space>
      </div>
    );
  }
};
const FaceVideoReport = ({ data }) => {
  if (data) {
    const { input, output, updated_at, created_at } = data.resource;

    return (
      <div>
        <Space direction="vertical" size="middle" className="d-flex">
          <Descriptions title="Result" bordered>
            <Descriptions.Item label="Create at" span={1.5}>
              {moment(created_at).format("HH:mm:ss - DD/MM/YYYY")}
            </Descriptions.Item>
            <Descriptions.Item label="Update at" span={1.5}>
              {moment(updated_at).format("HH:mm:ss - DD/MM/YYYY")}
            </Descriptions.Item>
            <Descriptions.Item label="Video Detail" span={1.5}>
              {output[0].id}
            </Descriptions.Item>
            <Descriptions.Item label="Video Type" span={1.5}>
              {output[0].type}
            </Descriptions.Item>
          </Descriptions>
        </Space>
      </div>
    );
  }
};
const FaceCheckReport = ({ data }) => {
  if (data) {
    const { input, output, updated_at, created_at } = data.resource;
    const { result, status, sub_result, breakdown } = output;

    return (
      <div>
        <Space direction="vertical" size="middle" className="d-flex">
          <Descriptions title="Result" bordered>
            <Descriptions.Item label="Result" span={1.5}>
              {result}
            </Descriptions.Item>
            <Descriptions.Item label="Status" span={1.5}>
              {status}
            </Descriptions.Item>
            <Descriptions.Item label="Create at" span={1.5}>
              {moment(created_at).format("HH:mm:ss - DD/MM/YYYY")}
            </Descriptions.Item>
            <Descriptions.Item label="Update at" span={1.5}>
              {moment(updated_at).format("HH:mm:ss - DD/MM/YYYY")}
            </Descriptions.Item>
          </Descriptions>

          <Descriptions title="Breakdown" bordered>
            {Object.keys(breakdown).map((item) => {
              const value = breakdown[item].breakdown;
              if (item === "face_comparison") {
                return (
                  <>
                    <Descriptions.Item
                      label={
                        <span className="text-capitalize">
                          {item.split("_").join(" ")} : Face Match
                        </span>
                      }
                      span={1.5}
                    >
                      {value.face_match.result}
                    </Descriptions.Item>
                    <Descriptions.Item
                      label={<span className="text-capitalize">Score</span>}
                      span={1.5}
                    >
                      {value.face_match.properties.score}
                    </Descriptions.Item>
                  </>
                );
              }

              if (item === "image_integrity") {
                return (
                  <>
                    <Descriptions.Item
                      label={
                        <span className="text-capitalize">
                          {item.split("_").join(" ")} : Face Detected
                        </span>
                      }
                      span={1.5}
                    >
                      {value.face_detected.result}
                    </Descriptions.Item>
                    <Descriptions.Item
                      label={<span className="text-capitalize">Score</span>}
                      span={1.5}
                    >
                      {value.face_detected.properties.score || "nothing"}
                    </Descriptions.Item>
                  </>
                );
              }

              if (item === "visual_authenticity") {
                return (
                  <>
                    <Descriptions.Item
                      label={
                        <span className="text-capitalize">
                          {item.split("_").join(" ")} : Visual Authenticity
                        </span>
                      }
                      span={1.5}
                    >
                      {value.liveness_detected.result}
                    </Descriptions.Item>
                    <Descriptions.Item
                      label={<span className="text-capitalize">Score</span>}
                      span={1.5}
                    >
                      {value.liveness_detected.properties.score || "nothing"}
                    </Descriptions.Item>
                    <Descriptions.Item
                      label={
                        <span className="text-capitalize">
                          {item.split("_").join(" ")} : Spoofing Detection
                        </span>
                      }
                      span={1.5}
                    >
                      {value.spoofing_detection.result}
                    </Descriptions.Item>
                    <Descriptions.Item
                      label={<span className="text-capitalize">Score</span>}
                      span={1.5}
                    >
                      {value.spoofing_detection.properties.score || "nothing"}
                    </Descriptions.Item>
                  </>
                );
              }
            })}
          </Descriptions>
        </Space>
      </div>
    );
  }
};
const DeviceIntelligenceCheckReport = ({ data }) => {
  if (data) {
    const { input, output, updated_at, created_at } = data.resource;
    const { result, status, sub_result, breakdown, properties } = output;

    return (
      <div>
        <Space direction="vertical" size="middle" className="d-flex">
          <Descriptions title="Result" bordered>
            <Descriptions.Item label="Result" span={1.5}>
              {result}
            </Descriptions.Item>
            <Descriptions.Item label="Status" span={1.5}>
              {status}
            </Descriptions.Item>
            <Descriptions.Item label="Create at" span={1.5}>
              {moment(created_at).format("HH:mm:ss - DD/MM/YYYY")}
            </Descriptions.Item>
            <Descriptions.Item label="Update at" span={1.5}>
              {moment(updated_at).format("HH:mm:ss - DD/MM/YYYY")}
            </Descriptions.Item>
          </Descriptions>

          <Descriptions title="Breakdown" bordered>
            {Object.keys(breakdown).map((item) => {
              const value = breakdown[item].breakdown;
              return (
                <>
                  <Descriptions.Item
                    label={
                      <span className="text-capitalize">
                        {item.split("_").join(" ")} : Application Authenticity
                      </span>
                    }
                    span={1.5}
                  >
                    {value.application_authenticity.result}
                  </Descriptions.Item>
                  <Descriptions.Item
                    label={
                      <span className="text-capitalize">
                        {item.split("_").join(" ")} : Device Integrity
                      </span>
                    }
                    span={1.5}
                  >
                    {value.device_integrity.result}
                  </Descriptions.Item>
                  <Descriptions.Item
                    label={
                      <span className="text-capitalize">
                        {item.split("_").join(" ")} : Device Reputation
                      </span>
                    }
                    span={1.5}
                  >
                    {value.device_reputation.result}
                  </Descriptions.Item>
                </>
              );
            })}
          </Descriptions>
          <Descriptions title="Properties" bordered>
            {Object.keys(properties).map((item) => {
              const value = properties[item];

              return (
                <Descriptions.Item
                  key={item}
                  label={
                    <span className="text-capitalize">
                      {item.split("_").join(" ")}
                    </span>
                  }
                  span={3}
                >
                  <Row>
                    {Object.keys(value).map((valueItem) => (
                      <Col span={12} key={valueItem}>
                        <b className="text-capitalize">
                          {valueItem.split("_").join(" ")}
                        </b>
                        : {value[valueItem].toString()}
                      </Col>
                    ))}
                  </Row>
                </Descriptions.Item>
              );
            })}
          </Descriptions>
        </Space>
      </div>
    );
  }
};
const generateItemAccordion = (data) => {
  const findData = (type) =>
    data.find((item) => item.resource.task_def_id.includes(type));

  const tagColor = (type) => {
    if (findData(type)?.resource.output.result === "clear") return "success";
    if (findData(type)?.resource.output.result === "consider") return "error";
    if (findData(type)?.object.status === "completed") return "blue";
    if (findData(type)?.object.status === "cancelled") return "error";
    if (findData(type)?.object.status === "withdrawn") return "orange";
    if (findData(type)?.object.status === "cancelled") return "purple";
    return "default";
  };

  return [
    {
      key: "1",
      label: <Tag color={tagColor("start")}>Start</Tag>,
      children: <StartReport data={findData("start")} />,
    },
    {
      key: "2",
      label: <Tag color={tagColor("profile")}>Profile</Tag>,
      children: <ProfileReport data={findData("profile")} />,
    },
    {
      key: "3",
      label: <Tag color={tagColor("document_photo")}>Document Photo</Tag>,
      children: <DocumentPhotoReport data={findData("document_photo")} />,
    },
    {
      key: "4",
      label: <Tag color={tagColor("known_faces_check")}>Known Faces Check</Tag>,
      children: <KnownFacesCheckReport data={findData("known_faces_check")} />,
    },
    {
      key: "5",
      label: (
        <Tag color={tagColor("document_check_with_address_information")}>
          Document Check With Address Information
        </Tag>
      ),
      children: (
        <DocumentCheckWithAddressReport
          data={findData("document_check_with_address_information")}
        />
      ),
    },
    {
      key: "6",
      label: <Tag color={tagColor("face_video")}>Face Video</Tag>,
      children: <FaceVideoReport data={findData("face_video")} />,
    },
    {
      key: "7",
      label: <Tag color={tagColor("face_check_video")}>Face Check Video</Tag>,
      children: <FaceCheckReport data={findData("face_check_video")} />,
    },
    {
      key: "8",
      label: (
        <Tag color={tagColor("device_intelligence_check")}>
          Device Intelligence Check
        </Tag>
      ),
      children: (
        <DeviceIntelligenceCheckReport
          data={findData("device_intelligence_check")}
        />
      ),
    },
  ];
};

const ImageResource = ({ dataImg }) => {
  const [visible, setVisible] = useState(false);
  const [imgSrc, setImgSrc] = useState(null);
  return (
    <div>
      <Tag
        color="blue"
        bordered={false}
        className="mb-2"
        style={{ cursor: "pointer" }}
        onClick={async () => {
          const dataSend = {
            id: dataImg.file_id || dataImg.id,
            type: dataImg.type,
          };

          const data = await handleDownloadResources(dataSend);

          if (data) {
            setVisible(true);
            setImgSrc(data);
          }
        }}
      >
        {dataImg.name || "Document  (click to view)"}
      </Tag>
      {visible && imgSrc && (
        <Image
          alt={dataImg.name}
          src={imgSrc}
          height={350}
          className="w-100"
          fallback="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMIAAADDCAYAAADQvc6UAAABRWlDQ1BJQ0MgUHJvZmlsZQAAKJFjYGASSSwoyGFhYGDIzSspCnJ3UoiIjFJgf8LAwSDCIMogwMCcmFxc4BgQ4ANUwgCjUcG3awyMIPqyLsis7PPOq3QdDFcvjV3jOD1boQVTPQrgSkktTgbSf4A4LbmgqISBgTEFyFYuLykAsTuAbJEioKOA7DkgdjqEvQHEToKwj4DVhAQ5A9k3gGyB5IxEoBmML4BsnSQk8XQkNtReEOBxcfXxUQg1Mjc0dyHgXNJBSWpFCYh2zi+oLMpMzyhRcASGUqqCZ16yno6CkYGRAQMDKMwhqj/fAIcloxgHQqxAjIHBEugw5sUIsSQpBobtQPdLciLEVJYzMPBHMDBsayhILEqEO4DxG0txmrERhM29nYGBddr//5/DGRjYNRkY/l7////39v///y4Dmn+LgeHANwDrkl1AuO+pmgAAADhlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAAqACAAQAAAABAAAAwqADAAQAAAABAAAAwwAAAAD9b/HnAAAHlklEQVR4Ae3dP3PTWBSGcbGzM6GCKqlIBRV0dHRJFarQ0eUT8LH4BnRU0NHR0UEFVdIlFRV7TzRksomPY8uykTk/zewQfKw/9znv4yvJynLv4uLiV2dBoDiBf4qP3/ARuCRABEFAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghgg0Aj8i0JO4OzsrPv69Wv+hi2qPHr0qNvf39+iI97soRIh4f3z58/u7du3SXX7Xt7Z2enevHmzfQe+oSN2apSAPj09TSrb+XKI/f379+08+A0cNRE2ANkupk+ACNPvkSPcAAEibACyXUyfABGm3yNHuAECRNgAZLuYPgEirKlHu7u7XdyytGwHAd8jjNyng4OD7vnz51dbPT8/7z58+NB9+/bt6jU/TI+AGWHEnrx48eJ/EsSmHzx40L18+fLyzxF3ZVMjEyDCiEDjMYZZS5wiPXnyZFbJaxMhQIQRGzHvWR7XCyOCXsOmiDAi1HmPMMQjDpbpEiDCiL358eNHurW/5SnWdIBbXiDCiA38/Pnzrce2YyZ4//59F3ePLNMl4PbpiL2J0L979+7yDtHDhw8vtzzvdGnEXdvUigSIsCLAWavHp/+qM0BcXMd/q25n1vF57TYBp0a3mUzilePj4+7k5KSLb6gt6ydAhPUzXnoPR0dHl79WGTNCfBnn1uvSCJdegQhLI1vvCk+fPu2ePXt2tZOYEV6/fn31dz+shwAR1sP1cqvLntbEN9MxA9xcYjsxS1jWR4AIa2Ibzx0tc44fYX/16lV6NDFLXH+YL32jwiACRBiEbf5KcXoTIsQSpzXx4N28Ja4BQoK7rgXiydbHjx/P25TaQAJEGAguWy0+2Q8PD6/Ki4R8EVl+bzBOnZY95fq9rj9zAkTI2SxdidBHqG9+skdw43borCXO/ZcJdraPWdv22uIEiLA4q7nvvCug8WTqzQveOH26fodo7g6uFe/a17W3+nFBAkRYENRdb1vkkz1CH9cPsVy/jrhr27PqMYvENYNlHAIesRiBYwRy0V+8iXP8+/fvX11Mr7L7ECueb/r48eMqm7FuI2BGWDEG8cm+7G3NEOfmdcTQw4h9/55lhm7DekRYKQPZF2ArbXTAyu4kDYB2YxUzwg0gi/41ztHnfQG26HbGel/crVrm7tNY+/1btkOEAZ2M05r4FB7r9GbAIdxaZYrHdOsgJ/wCEQY0J74TmOKnbxxT9n3FgGGWWsVdowHtjt9Nnvf7yQM2aZU/TIAIAxrw6dOnAWtZZcoEnBpNuTuObWMEiLAx1HY0ZQJEmHJ3HNvGCBBhY6jtaMoEiJB0Z29vL6ls58vxPcO8/zfrdo5qvKO+d3Fx8Wu8zf1dW4p/cPzLly/dtv9Ts/EbcvGAHhHyfBIhZ6NSiIBTo0LNNtScABFyNiqFCBChULMNNSdAhJyNSiECRCjUbEPNCRAhZ6NSiAARCjXbUHMCRMjZqBQiQIRCzTbUnAARcjYqhQgQoVCzDTUnQIScjUohAkQo1GxDzQkQIWejUogAEQo121BzAkTI2agUIkCEQs021JwAEXI2KoUIEKFQsw01J0CEnI1KIQJEKNRsQ80JECFno1KIABEKNdtQcwJEyNmoFCJAhELNNtScABFyNiqFCBChULMNNSdAhJyNSiECRCjUbEPNCRAhZ6NSiAARCjXbUHMCRMjZqBQiQIRCzTbUnAARcjYqhQgQoVCzDTUnQIScjUohAkQo1GxDzQkQIWejUogAEQo121BzAkTI2agUIkCEQs021JwAEXI2KoUIEKFQsw01J0CEnI1KIQJEKNRsQ80JECFno1KIABEKNdtQcwJEyNmoFCJAhELNNtScABFyNiqFCBChULMNNSdAhJyNSiECRCjUbEPNCRAhZ6NSiAARCjXbUHMCRMjZqBQiQIRCzTbUnAARcjYqhQgQoVCzDTUnQIScjUohAkQo1GxDzQkQIWejUogAEQo121BzAkTI2agUIkCEQs021JwAEXI2KoUIEKFQsw01J0CEnI1KIQJEKNRsQ80JECFno1KIABEKNdtQcwJEyNmoFCJAhELNNtScABFyNiqFCBChULMNNSdAhJyNSiEC/wGgKKC4YMA4TAAAAABJRU5ErkJggg=="
        />
      )}
    </div>
  );
};
const DocumentResources = ({ data }) => {
  if (data.length === 0) return <div> Document Checking...</div>;
  return (
    <div className="d-flex flex-column gap-3">
      <div>
        <Typography.Title level={5} color="gold">
          Document
        </Typography.Title>
      </div>
      <div className="">
        <Row gutter={16}>
          {data?.map((item, index) => (
            <Col
              span={12}
              key={item.id}
              className="d-flex flex-column gap-2 mb-3"
            >
              <ImageResource dataImg={item} />
              {index === 0 && (
                <div>
                  <Tag>Front</Tag>
                </div>
              )}
              {index === 1 && (
                <div>
                  <Tag>Back</Tag>
                </div>
              )}
            </Col>
          ))}
        </Row>
      </div>
    </div>
  );
};
const FaceResources = ({ data }) => {
  const [visible, setVisible] = useState(false);
  const [imgSrc, setImgSrc] = useState(null);

  return (
    <div className="d-flex flex-column gap-3">
      <div>
        <Typography.Title level={5} color="magenta">
          Face
        </Typography.Title>
      </div>
      <div className="d-flex gap-4 flex-wrap">
        {data?.map((item) => (
          <div key={item.id} className="d-flex flex-column gap-2">
            <Tag
              style={{ cursor: "pointer" }}
              color="magenta"
              bordered={false}
              onClick={async () => {
                const dataSend = {
                  id: item.file_id,
                  type: item.type,
                };

                const data = await handleDownloadResources(dataSend);
                if (data) {
                  setVisible(true);
                  setImgSrc(data);
                }
              }}
            >
              {item.name}
            </Tag>
            {visible && (
              <video width="100%" controls>
                <source src={imgSrc} />
              </video>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
const ReportResources = ({ data, workflowRunId }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [workflowRunResult, setWorkflowRunResult] = useState();

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  useEffect(() => {
    const getDataResult = async () => {
      const data = await getDataWorkflowRunResult(workflowRunId);
      if (data) setWorkflowRunResult(data);
    };

    if (workflowRunId) getDataResult();
  }, [workflowRunId]);

  console.log(workflowRunResult);
  return (
    <div className="d-flex flex-column gap-3">
      <div>
        <Typography.Title level={5} color="gold">
          Report
        </Typography.Title>
      </div>

      <div>
        <Button type="dashed" onClick={showModal}>
          Show report detail
        </Button>
        {data?.length > 0 && (
          <Modal
            title={
              <div>
                Report Details{" "}
                {workflowRunResult && (
                  <Tag
                    color={
                      workflowRunResult.status === "approved"
                        ? "success"
                        : "default"
                    }
                  >
                    {workflowRunResult.status}
                  </Tag>
                )}
              </div>
            }
            open={isModalOpen}
            onOk={handleOk}
            onCancel={handleCancel}
            width="90vw"
          >
            <Collapse
              bordered={false}
              accordion
              items={generateItemAccordion(data)}
            />
          </Modal>
        )}
      </div>
    </div>
  );
};

const Resources = () => {
  const [dataResources, setDataResources] = useState([]);
  const [dataReports, setDataReports] = useState([]);
  const [workflowRunId, setWorkflowRunId] = useState();
  const [workflowResult, setWorkflowResult] = useState();

  const { userData, setCurrent } = useContext(VerifyContext);

  useEffect(() => {
    const dataStorage = localStorage.getItem("data_verify");
    if (dataStorage) setDataResources(JSON.parse(dataStorage));
  }, []);

  useEffect(() => {
    const getDataReport = async () => {
      const workflowResult = await getDataWorkflowRunResult(workflowRunId);
      setWorkflowResult(workflowResult);
      const { data } = await getDataReportByWorkflowRunId(workflowRunId);

      const parseData = data.map((item) => JSON.parse(item.resource));
      const filterDataHaveOutput = parseData.filter(
        (item) => Object.keys(item?.resource?.output || {})?.length > 0
      );

      const uniqueReportByIdResource = uniqBy(filterDataHaveOutput, (item) => {
        return item.resource.id;
      });

      setDataReports(uniqueReportByIdResource);

      // setDataReports(JSON.parse(localStorage.getItem("consider")));
      console.log(uniqueReportByIdResource);
    };
    if (workflowRunId) getDataReport();
  }, [workflowRunId]);

  useEffect(() => {
    const dataStorage = localStorage.getItem("workflow_run");
    const parsingData = JSON.parse(dataStorage);
    if (dataStorage && parsingData.done)
      setWorkflowRunId(parsingData.workflow_run_id);
  }, []);

  // const dataDocument = useMemo(() => {
  //   const filterApplicant = dataResources.filter(
  //     (item) => item.applicant_id == userData.applicant_id
  //   );
  //   return filterApplicant
  //     .at(-1)
  //     ?.Files?.filter((item) => item.type === "document");
  // }, [dataResources, userData]);

  const dataDocument = useMemo(() => {
    // const filterApplicant = dataResources.filter(
    //   (item) => item.applicant_id == userData.applicant_id
    // );
    // return filterApplicant
    //   .at(-1)
    //   ?.Files?.filter((item) => item.type === "document");
    const filterDocument = dataReports.find(
      (item) =>
        item.object.task_def_id === "document_check_with_address_information"
    );

    return filterDocument?.resource.input.document_ids || [];
    // }, [dataReports,dataResources, userData]);
  }, [dataReports]);

  const datFace = useMemo(() => {
    const filterApplicant = dataResources.filter(
      (item) => item.applicant_id == userData.applicant_id
    );
    return filterApplicant
      .at(-1)
      ?.Files?.filter((item) => item.type !== "document");
  }, [dataResources, userData]);

  if (workflowRunId && workflowResult?.status !== "approved")
    return (
      <div className="w-100 h-100">
        <div className="d-flex flex-column gap-4">
          <DocumentResources data={dataDocument} />
          <FaceResources data={datFace} />
          <Typography.Title level={5} color="gold">
            Webhook Checking...
          </Typography.Title>
        </div>
      </div>
    );

  if (workflowRunId)
    return (
      <div className="w-100 h-100">
        <div className="d-flex flex-column gap-4">
          <DocumentResources data={dataDocument} />
          <FaceResources data={datFace} />
          <ReportResources data={dataReports} workflowRunId={workflowRunId} />
        </div>
      </div>
    );

  return (
    <Result
      status="404"
      title="Report"
      subTitle="Nothing to report"
      extra={
        <Button
          type="primary"
          onClick={() => {
            setCurrent((prev) => prev - 1);
          }}
        >
          Back to Verify
        </Button>
      }
    />
  );
};

export default Resources;
