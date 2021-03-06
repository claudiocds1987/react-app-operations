import React from "react";
import { debounce } from "lodash";
// axios
import axios from "axios";
// spinner loader
import { Spinner } from "react-bootstrap";
// npm install react-hook-form
import { useForm } from "react-hook-form";
// npm install react-router-dom
import { useHistory } from "react-router-dom";
// npm install @hookform/resolvers yup (para las validaciones)
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
// fontawesome
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEnvelope,
  faKey,
  faUnlockAlt,
} from "@fortawesome/free-solid-svg-icons";
// css
import "./SignUp.css";
// services
import AuthService from "./../../../services/authService";

const schema = yup.object().shape({
  email: yup.string().email("formato no valido").required("campo obligatorio"),
  password: yup
    .string()
    .required("Campo obligatorio")
    .min(5, "La contraseña es corta")
    .max(15, "contraseña muy larga"),
  confirmPassword: yup
  .string().oneOf([yup.ref('password'), null], 'Las contraseñas deben ser iguales')
  .required('Confirme la contraseña'),
    // .string()
    // .required("Campo obligatorio")
    // .min(5, "La contraseña es corta")
    // .max(15, "contraseña muy larga"),
});

const SignUp = () => {
  let history = useHistory();
  const [loading, setLoading] = React.useState(false);
  const [password, setPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [userExist, setUserExist] = React.useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const debounceOnChange = React.useCallback(debounce(checkUser, 400), []); // ??

  async function checkUser(email) {
    console.log("value: " + email);
    try {
      const result = await axios
        .get(`http://localhost:4000/api/users/check/${email}`)
        // .then(res => console.log(res.data))
        .then((res) => {
          // res.data tiene true or false
          if (res.data) {
            console.log("YA EXISTE UN USUARIO CON EL MISMO EMAIL");
            setUserExist(true)
          } else {
            console.log("EMAIL ACEPTADO");
            setUserExist(false);
          }
        });
    } catch (e) {
      console.log("Error al ckeckear email de usuario");
    }
  }

  const onSubmit = async (data, e) => {
    e.preventDefault();
    // comparando contraseñas
    if (password !== confirmPassword) {
      alert("las contraseñas no son iguales");
    } else {
      const user = {
        email: data.email,
        password: data.password,
        registration_date: new Date(),
      };
      // se activa el spinner/loader
    setLoading(true);
    let authService = new AuthService();
      const result = await authService.signUp(user);
      if(result !== undefined){
        alert("¡Sus datos fueron guardados exitosamente!");
        setLoading(false);
        history.push("/login");
      }
      setLoading(false);
      // try {
      //   const result = await axios
      //     .post("http://localhost:4000/api/auth/signup", user)
      //     .then((res) => {
      //       alert("¡Sus datos fueron guardados exitosamente!");
      //       history.push("/login");
      //     });
      // } catch (e) {
      //   alert("Error al registrar usuario");
      // }
    }
  };

  return (
    <div id="box-sign-up">
      SIGN UP
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
            className={`form-control ${errors.email ? 'is-invalid' : ''}`}
            onChange={(e) => debounceOnChange(e.target.value)}
          />    
        </div>

        <p className="text-danger">{errors.email?.message}</p>
        {userExist ? 
          <p className="text-danger">Ya existe el usuario</p>
          :
          ''
        }

        <div className="d-flex align-items-center">
          <div className="icon">
            <FontAwesomeIcon icon={faKey} />
          </div>
          <input
            type="password"
            name="password"
            {...register("password")}
            placeholder="Contraseña"
            // className="form-control"
            className={`form-control ${errors.password ? 'is-invalid' : ''}`}
            onChange={(e) => {
              const value = e.target.value;
              console.log(value);
              setPassword(value);
            }}
          />
        </div>

        <p className="text-danger">{errors.password?.message}</p>

        <div className="d-flex align-items-center">
          <div className="icon">
            <FontAwesomeIcon icon={faUnlockAlt} />
          </div>
          <input
            type="password"
            name="confirmPassword"
            {...register("confirmPassword")}
            placeholder="Confirmar contraseña"
            className={`form-control ${errors.confirmPassword ? 'is-invalid' : ''}`}
            onChange={(e) => {
              const value = e.target.value;
              console.log(value);
              setConfirmPassword(value);
            }}
          />
        </div>

        <p className="text-danger">{errors.confirmPassword?.message}</p>

        <div className="d-grid gap-2">
          <button
            type="submit"
            className="btn btn-primary mt-2"
            // disabled={errors.email || errors.password}
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
            Registrarse
          </button>
        </div>
      </form>
    </div>
  );
};

export default SignUp;
