import React, { useEffect, useRef, useState } from 'react';
import emailjs from "@emailjs/browser";
import { FloatButton, notification } from 'antd';

const SendMail = () => {
  const [api, contextHolder] = notification.useNotification();
  const [dataLocal,setDataLocal] = useState();
  const ref=useRef()
  useEffect(()=>{
    setDataLocal(JSON.parse(localStorage.getItem("customer_info")))
  },[])
  const handleOnClickSendMail = () =>{
    if (dataLocal){
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
              message: 'Send Email Completed',
              description:
                'Please check your email to get verification link',
            });
          },
          function (error) {
            api["success"]({
              message: 'Send Email Error',
              description:
                error,
            });
          }
        );
    }
    
  }
  return (
    <>
    
    {contextHolder}
    
    <FloatButton onClick={()=>{handleOnClickSendMail()}} tooltip={<div>Send Link KYC</div>} />
      {dataLocal &&(
        <div className='d-none'>
          
            <form ref={ref}>
            <div>
              <label htmlFor="email">email:</label>
              <input
                id="email"
                name='email'
                type="email"
                value={dataLocal.email}
              />
            </div>
           <div>
              <label htmlFor="name">name:</label>
              <input
                id="name"
                name="name"
                type="text"
                value={dataLocal.first_name + " " + dataLocal.last_name}
              />
           </div>
           <div>

              <label htmlFor="message">message:</label>
              <input
                id="message"
                name="message"
                type="text"
                value={"https://onfido-demo.web.app/link-verify.html"}
              />
           </div>
            </form>

        </div>
      )}
    
    </>
  )
}

export default SendMail