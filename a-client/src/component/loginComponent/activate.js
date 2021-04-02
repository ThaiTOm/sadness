import React, { useState, useEffect } from "react";
import jwt from "jsonwebtoken";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";
import { Redirect } from "react-router-dom";
import { isAuth, authenicate } from "../../helpers/auth";

function ActivatePage(props) {
  const [formData, setFormData] = useState({
    name: "",
    token: "",
  });

  useEffect(() => {
    let token = props.match.params.token;
    let name = jwt.decode(token);
    if (token) {
      setFormData({ ...formData, name, token });
    }
  }, [formData, props.match.params.token]);

  const { token } = formData;
  const hanldeSubmit = (e) => {
    e.preventDefault();
    axios
      .post("http://localhost:2704/api/activision", {
        token,
      })
      .then((res) => {
        toast.success(res.data.message);
        authenicate(res);
      })
      .catch((err) => {
        toast.error("Something went wrong please try again");
      });
  };
  return (
    <>
      {isAuth() ? <Redirect to="/" /> : null}
      <ToastContainer />
      <form className="active_page" onSubmit={hanldeSubmit}>
        <p>Active page</p>
        <button
          type="submit"
          style={{ backgroundColor: "rgba(46, 229, 156, 0.788)" }}
          className="facebook_login"
        >
          Xác nhận
        </button>
      </form>
    </>
  );
}

export default ActivatePage;
