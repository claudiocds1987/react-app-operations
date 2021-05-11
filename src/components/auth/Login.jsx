import React from "react";
// npm install react-hook-form
import { useForm } from "react-hook-form";
// npm install @hookform/resolvers yup (para las validaciones)
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
// css
import "./Login.css";

const schema = yup.object().shape({
  email: yup.string().email("formato no valido").required("Campo obligatorio"),
  password: yup
    .string()
    .required("Campo obligatorio")
    .min(5, "La contraseña es corta")
    .max(15, "contraseña muy larga"),
});

const Login = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = (data, e) => {
    e.preventDefault(); // evita comportamiento por defecto, que no haga refresh
    console.log(data);
  };

  return (
    <div className="card p-4 mt-5">
      <div className="card-body">
        LOGIN
        <form onSubmit={handleSubmit(onSubmit)}>
          <input
            type="text"
            name="email"
            {...register("email")}
            placeholder="@email"
            className="form-control"
          />
          <p className="text-danger">{errors.email?.message}</p>

          <input
            type="password"
            name="password"
            {...register("password")}
            placeholder="Contraseña"
            className="form-control"
          />
          <p className="text-danger">{errors.password?.message}</p>

          <div className="d-grid gap-2">
            <button
              type="submit"
              className="btn btn-primary mt-5"
              disabled={errors.email || errors.password}
            >
              Enviar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
