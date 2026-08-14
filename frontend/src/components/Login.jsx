import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./Login.css";
import LoaderButton from "./LoaderButton";

function Login({ onLogin }) {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    text: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  const changeHandler = (event) => {
    setForm({ ...form, [event.target.name]: event.target.value });
  };

  const login = (token, userId) => {
    console.log("Login successful!");
    console.log("Token:", token);
    console.log("User ID:", userId);
  };

  const loginHandler = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const response = await axios.post(
        "http://localhost:5000/api/login",
        { ...form },
        {
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      if (response.data.success) {
        const { token, userId } = response.data;

        localStorage.setItem("token", token);
        localStorage.setItem("userId", userId);

        login(token, userId);
        onLogin(token, userId);

        toast.success("Muvafaqqiyatli !.", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        window.location.href = "/";
      }
    } catch (error) {
      console.log(error.message);
      toast.error("Login yoki parolni to'gri kiriting !", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    } finally {
      setLoading(false); // Set loading back to false after login attempt
    }
  };

  return (
    <>
      <ToastContainer />
      <div className="wrapper pt-5">
        <div id="logreg-forms">
          <form
            className="form-signin d-flex flex-column justify-content-center"
            onSubmit={loginHandler}
          >
            <h1 className="h3 mb-3 font-weight-normal text-center text-white">
              Tizimga kirish
            </h1>
            <div className="input-group mb-2 mt-3">
              <input
                name="text"
                value={form.text}
                onChange={changeHandler}
                type="text"
                id="inputEmail"
                className="form-control"
                placeholder=""
                required=""
              />
            </div>

            <div className="input-group">
              <input
                name="password"
                value={form.password}
                onChange={changeHandler}
                required
                type="password"
                className="form-control"
                id="inputPassword"
              />
            </div>

            <div className="input-group mb-5">
              <button
                id="submit"
                className="btn btn-md btn-rounded btn-block form-control submit"
                type="submit"
                disabled={loading} // Disable the button during loading
              >
                {loading ? (
                  <LoaderButton />
                ) : (
                  <>
                    <i className="fas fa-sign-in-alt"></i> Tizimga kirish
                  </>
                )}
              </button>
            </div>
            <div className="social-login">
              <button className="btn facebook-btn social-btn" type="button">
                <span>
                  <i className="fab fa-facebook-f"></i> Facebook
                </span>
              </button>
              <button className="btn google-btn social-btn" type="button">
                <span>
                  <i className="fab fa-google-plus-g"></i> Telegram
                </span>
              </button>
            </div>
            <button
  type="button"
  onClick={() => navigate("/register")}
>
  Ro'yxatdan o'tish
</button>
          </form>
        </div>
      </div>
    </>
  );
}

export default Login;
