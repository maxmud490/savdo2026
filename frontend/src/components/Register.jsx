import React, { useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./Login.css";
import LoaderButton from "./LoaderButton";
import { useNavigate } from "react-router-dom";

function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    text: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  const changeHandler = (event) => {
    setForm({
      ...form,
      [event.target.name]: event.target.value,
    });
  };

  const registerHandler = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const response = await axios.post(
        "https://savdo2026.onrender.com/api/register",
        form,
        {
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      if (response.data.success) {
        toast.success("Registratsiya muvaffaqiyatli!", {
          position: "top-right",
          autoClose: 3000,
        });

        setForm({
          text: "",
          password: "",
        });

        setTimeout(() => {
          navigate("/");
        }, 1500);
      }
    } catch (error) {
      console.log(error.response?.data || error.message);

      toast.error(
        error.response?.data?.message || "Registratsiyada xatolik yuz berdi!",
        {
          position: "top-right",
          autoClose: 3000,
        },
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <ToastContainer />

      <div className="wrapper pt-5">
        <div id="logreg-forms">
          <form
            className="form-signin d-flex flex-column justify-content-center"
            onSubmit={registerHandler}
          >
            <h1 className="h3 mb-3 font-weight-normal text-center text-white">
              Registratsiya
            </h1>

            <div className="input-group mb-2 mt-3">
              <input
                name="text"
                value={form.text}
                onChange={changeHandler}
                type="text"
                className="form-control"
                placeholder="Login"
                required
              />
            </div>

            <div className="input-group mb-5">
              <input
                name="password"
                value={form.password}
                onChange={changeHandler}
                type="password"
                className="form-control"
                placeholder="Parol"
                required
              />
            </div>

            <div className="input-group">
              <button
                className="btn btn-md btn-rounded btn-block form-control submit"
                type="submit"
                disabled={loading}
              >
                {loading ? (
                  <LoaderButton />
                ) : (
                  <>
                    <i className="fas fa-user-plus"></i> Ro'yxatdan o'tish
                  </>
                )}
              </button>
              <p
                className="text-center text-white mt-3"
                style={{ cursor: "pointer" }}
                onClick={() => navigate("/")}
              >
                Akkauntingiz bormi? <strong>Tizimga kirish</strong>
              </p>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default Register;
