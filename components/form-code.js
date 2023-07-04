import { Button, Form, Input, Select, FloatButton, notification } from "antd";
import { useContext, useEffect, useRef, useState } from "react";
import VerifyContext from "./context";

import emailjs from "@emailjs/browser";

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

const FormCode = () => {
  const [form] = Form.useForm();
  const { setCurrent } = useContext(VerifyContext);
  const [api, contextHolder] = notification.useNotification();
  const [dataLocal, setDataLocal] = useState({});
  const ref = useRef();
  useEffect(() => {
    setDataLocal(JSON.parse(localStorage.getItem("customer_onfido")));
  }, []);

  const [code, setCode] = useState(Math.floor(Math.random() * 9000) + 1000);

  const onFinish = (values) => {
    if (values.code != code) {
      form.setFields([
        {
          name: "code", // required
          errors: ["Invalid code"],
        },
      ]);
    } else {
      setCurrent((prev) => prev + 1);
    }
  };

  const handleSendCode = () => {
    emailjs
      .sendForm(
        "service_ti5qjg6",
        "template_61pm64e",
        ref.current,
        "xIOILLZdpBdLmHzYU"
      )
      .then(
        function (response) {
          api["success"]({
            message: `Send Email to ${dataLocal.email} Completed`,
            description: "Please check your email to get verification link",
          });
        },
        function (error) {
          api["success"]({
            message: "Send Email Error",
            description: error,
          });
        }
      );
  };
  return (
    <>
      {contextHolder}
      <div className="w-100 ">
        <h2 className="mb-5 text-center">Verify Code </h2>
        <div className="text-center mb-5">
          <Button onClick={handleSendCode}>Send Code to your email</Button>
        </div>
        {dataLocal && (
          <div className="d-none">
            <form ref={ref}>
              <div>
                <label htmlFor="email">email:</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={dataLocal.email}
                />
              </div>
              <div>
                <label htmlFor="message">code:</label>
                <input
                  id="message"
                  name="message"
                  type="message"
                  value={`Your code for verify: ${code}`}
                />
              </div>
            </form>
          </div>
        )}

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
            name="code"
            label="Code"
            rules={[
              {
                required: true,
                message: "Please input Code",
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item {...tailFormItemLayout}>
            <Button type="primary" htmlType="submit">
              Verify
            </Button>
          </Form.Item>
        </Form>
      </div>
    </>
  );
};

const FormCheckCode = () => {
  const [dataCustomer, setDataCustomer] = useState({});
  const [loading, setLoading] = useState(true);
  const { setCurrent } = useContext(VerifyContext);
  return <FormCode />;
};
export default FormCheckCode;
