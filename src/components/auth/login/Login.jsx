import React, { useEffect } from "react";
// spinner loader
import { Spinner } from "react-bootstrap";
// npm install react-hook-form
import { useForm } from "react-hook-form";
// npm install @hookform/resolvers yup (para las validaciones)
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
// fontawesome
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope, faKey } from "@fortawesome/free-solid-svg-icons";
// css
import "./Login.css";

// npm install react-router-dom
import { Link, useHistory } from "react-router-dom";
// services
import AuthService from "./../../../services/authService";

const schema = yup.object().shape({
  email: yup.string().email("formato no valido").required("campo obligatorio"),
  password: yup
    .string()
    .required("campo obligatorio")
    .min(5, "la contraseña es corta")
    .max(15, "contraseña muy larga"),
});

const Login = () => {
  const [loading, setLoading] = React.useState(false);

  useEffect(() => {
    // borrando localStorage
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  });

  let history = useHistory();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  // USING SERVICE
  const onSubmit = async (data, e) => {
    e.preventDefault();
    let authService = new AuthService();
    // se activa el spinner/loader
    setLoading(true);
    const result = await authService.login(data);
    if(result !== undefined){
      const token = result.token;
      const email = result.email;
      localStorage.setItem("token", token);
      localStorage.setItem("user", email);
      window.location.reload(history.push("/home"));
    }
    setLoading(false);
    
  };

  // sin service
  // const onSubmit = async (data, e) => {
  //   e.preventDefault();
  //   // se activa el spinner/loader
  //   setLoading(true);
  //   try {
  //     const result = await axios
  //       .post("http://localhost:4000/api/auth/login", data)
  //       .then((res) => {
  //         const email = data.email; // value del input email
  //         const token = res.data.token;
  //         // alert('TOKEN: ' + token);
  //         localStorage.setItem("token", token);
  //         localStorage.setItem("user", email);
  //         window.location.reload(history.push("/home"));
  //       });
  //   } catch (e) {
  //     setLoading(false);
  //     alert("Error login de usuario");
  //   }
  // };

  return (
    <div id="box">
      <h4>LOGIN</h4>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="d-flex align-items-center">
          <div className="icon">
            <FontAwesomeIcon icon={faEnvelope} />
          </div>
          <input
            type="text"
            name="email"
            {...register("email")}
            placeholder="@email"
            className="form-control"
          />
        </div>

        <p className="text-center">
          <span className="text-danger small">{errors.email?.message}</span>
        </p>

        <div className="d-flex align-items-center">
          <div className="icon">
            <FontAwesomeIcon icon={faKey} />
          </div>
          <input
            type="password"
            name="password"
            {...register("password")}
            placeholder="Contraseña"
            className="form-control"
          />
        </div>

        <p className="text-center">
          <span className="text-danger small">{errors.password?.message}</span>
        </p>

        <div className="d-grid gap-2">
          <button
            type="submit"
            className="btn btn-primary mt-2"
            disabled={errors.email || errors.password}
          >
            {loading === true ? (
              <Spinner
                as="span"
                animation="border"
                size="sm"
                role="status"
                aria-hidden="true"
              />
            ) : (
              ""
            )}
            Login
          </button>
        </div>
      </form>
      <div className="text-center">
        <p>
          ¿No tiene cuenta?{" "}
          <Link to="/SignUp" style={{ color: "#FFF" }}>
            registrarse
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
