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

const FormCode = () => {
  const [form] = Form.useForm();
  const { setCurrent } = useContext(VerifyContext);

  const onFinish = (values) => {
    if (values.code != 1234) {
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

  return (
    <>
      <div className="w-100 ">
        <h2 className="mb-5 text-center">Verify Code </h2>
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
              Verify Code
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
