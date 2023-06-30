import { Button, Checkbox, Form, Input, Result, Select, Spin } from "antd";
import { useContext, useEffect, useState } from "react";
import OnfidoSdk from "./onfido-sdk";
import axios from "axios";
import VerifyContext from "./context";
const { Option } = Select;

const formItemLayout = {
  labelCol: {
    xs: {
      span: 24,
    },
    sm: {
      span: 8,
    },
  },
  wrapperCol: {
    xs: {
      span: 24,
    },
    sm: {
      span: 16,
    },
  },
};
const tailFormItemLayout = {
  wrapperCol: {
    xs: {
      span: 24,
      offset: 0,
    },
    sm: {
      span: 16,
      offset: 8,
    },
  },
};

const FormRegister = () => {
  const [form] = Form.useForm();
  const { setCurrent } = useContext(VerifyContext);

  const onFinish = (values) => {
    const dataStorage = { ...values };

    console.log("Received values of form: ", dataStorage);

    console.log(
      "Calling Api to create applicant from first name and last name"
    );

    axios
      .post(
        "http://192.168.3.20:8080/api/customer/create",
        {
          first_name: dataStorage.first_name,
          last_name: dataStorage.last_name,
          email: dataStorage.email,
        },
        {
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Content-Type": "application/json",
          },
        }
      )
      .then((res) => {
        console.log("Create Completed:", res);
        const dataResponse = res.data?.data || null;
        dataStorage.applicant_id = dataResponse.applicant_id;
        console.log("dataStorage", dataStorage);
        localStorage.setItem("customer_onfido", JSON.stringify(dataStorage));
        setCurrent((prev) => prev + 1);
      });
  };

  return (
    <>
      <div className="w-100 ">
        <h2 className="mb-5 text-center">Form Register </h2>
        <Form
          {...formItemLayout}
          form={form}
          name="register"
          onFinish={onFinish}
          initialValues={{
            residence: ["zhejiang", "hangzhou", "xihu"],
            prefix: "86",
          }}
          style={{
            maxWidth: 600,
          }}
          className="mx-auto"
          scrollToFirstError
        >
          <Form.Item
            name="email"
            label="E-mail"
            rules={[
              {
                type: "email",
                message: "The input is not valid E-mail!",
              },
              {
                required: true,
                message: "Please input your E-mail!",
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="first_name"
            label="First Name"
            tooltip="What do you want others to call you?"
            rules={[
              {
                required: true,
                message: "Please input your first name!",
                whitespace: true,
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="last_name"
            label="Last Name"
            tooltip="What do you want others to call you?"
            rules={[
              {
                required: true,
                message: "Please input your last name!",
                whitespace: true,
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="password"
            label="Password"
            rules={[
              {
                required: true,
                message: "Please input your password!",
              },
            ]}
            hasFeedback
          >
            <Input.Password />
          </Form.Item>

          <Form.Item
            name="agreement"
            valuePropName="checked"
            rules={[
              {
                validator: (_, value) =>
                  value
                    ? Promise.resolve()
                    : Promise.reject(new Error("Should accept agreement")),
              },
            ]}
            {...tailFormItemLayout}
          >
            <Checkbox>
              I have read the <a href="">agreement</a>
            </Checkbox>
          </Form.Item>

          <Form.Item {...tailFormItemLayout}>
            <Button type="primary" htmlType="submit">
              Register
            </Button>
          </Form.Item>
        </Form>
      </div>
    </>
  );
};

const FormLogin = () => {
  const [form] = Form.useForm();
  const onFinish = (values) => {
    const dataCustomer = localStorage.getItem("customer");
  };

  return (
    <>
      <div className="w-100 ">
        <h2 className="mb-5 text-center">Form Login </h2>
        <Form
          {...formItemLayout}
          form={form}
          name="register"
          onFinish={onFinish}
          initialValues={{
            residence: ["zhejiang", "hangzhou", "xihu"],
            prefix: "86",
          }}
          style={{
            maxWidth: 600,
          }}
          className="mx-auto"
          scrollToFirstError
        >
          <Form.Item
            name="email"
            label="E-mail"
            rules={[
              {
                type: "email",
                message: "The input is not valid E-mail!",
              },
              {
                required: true,
                message: "Please input your E-mail!",
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="password"
            label="Password"
            rules={[
              {
                required: true,
                message: "Please input your password!",
              },
            ]}
            hasFeedback
          >
            <Input.Password />
          </Form.Item>

          <Form.Item {...tailFormItemLayout}>
            <Button type="primary" htmlType="submit">
              Login
            </Button>
          </Form.Item>
        </Form>
      </div>
    </>
  );
};

const FormBegin = () => {
  const [dataCustomer, setDataCustomer] = useState({});
  const [loading, setLoading] = useState(true);
  const { setCurrent } = useContext(VerifyContext);

  useEffect(() => {
    const dataLocal = localStorage.getItem("customer_onfido");

    if (dataLocal) {
      setDataCustomer(dataLocal);
    }
    setLoading(false);
  }, []);

  if (loading)
    return (
      <div className="text-center">
        <Spin loading={loading} size="large" className="mx-auto" />
      </div>
    );

  if (Object.keys(dataCustomer).length > 0)
    return (
      <Result
        status="success"
        title="Successfully Create Applicant Onfido"
        extra={[
          <Button
            type="primary"
            key="console"
            onClick={() => {
              setCurrent((prev) => prev + 1);
            }}
          >
            Go to verify
          </Button>,
        ]}
      />
    );
  return <FormRegister />;
};
export default FormBegin;
