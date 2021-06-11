import React from "react";
// npm install react-router-dom
import { useHistory } from "react-router-dom";
// spinner loader
import { Spinner } from "react-bootstrap";
// npm install react-hook-form
import { useForm } from "react-hook-form";
// npm install @hookform/resolvers yup (para las validaciones)
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
// npm i react-datepicker
import DataPicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
// "Currency mask" npm i react-currency-input-field 
import CurrencyInput from "react-currency-input-field";
// npm install moment --save to format date
import moment from "moment";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPen,
  faHandHoldingUsd,
  faCalendarDay,
} from "@fortawesome/free-solid-svg-icons";

// css
import "./createOperation.css";

// services
import OperationsService from "./../../../services/operationsService";

// const schema = yup.object().shape({
//   concept: yup.string().required("Campo obligatorio"),
//   amount: yup.number().required("Campo obligatorio"),
//   dateOp: yup.string().required(),
//   typeOp:yup.string().required(),
//   categoryOp: yup.string().required(),
// });

const operation = {
  userEmail: "",
  concept: "",
  amount: "",
  date: "",
  category: "",
  type: "",
  state: true,
};

const CreateOperation = () => {
  const currentDate = new Date();
  const [stateCategories, setStateCategories] = React.useState([]);
  const [stateCategory, setStateCategory] = React.useState(1);
  const [date, setDate] = React.useState(new Date());
  const [type, setType] = React.useState("ingreso");
  const [user, setUser] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  let history = useHistory();

  // React.useEffect(() => {
  //   if (localStorage.getItem("user") !== null) {
  //     setUser(localStorage.getItem("user"));
  //   }
  //   getCategories();
  // }, []);

  const getCategories = async () => {
    const data = await fetch("http://localhost:4000/api/categories");
    const categoriesData = await data.json();
    setStateCategories(categoriesData);
  };

  // const {
  //   register,
  //   handleSubmit,
  //   reset,
  //   formState: { errors },
  // } = useForm({
  //   resolver: yupResolver(schema),
  // });

  React.useEffect(() => {
    if (localStorage.getItem("user") !== null) {
      setUser(localStorage.getItem("user"));
    }
    getCategories();
  }, []);

  const schema = yup.object().shape({
    concept: yup.string().required("Campo obligatorio"),
    amount: yup.number().required("Campo obligatorio"),
    dateOp: yup.string().default(moment(date).format("MM/DD/YYYY")).required(),
    typeOp:yup.string().default(type).required(),
    // por default(1) = al id de "comida"
    categoryOp: yup.number().default(1).required(),
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = (formData, e) => {
    e.preventDefault(); // evita que haga refresh
    // charge data in operation object
    setLoading(true);
    operation.userEmail = user;
    operation.concept = formData.concept;
    operation.amount = formData.amount;
    operation.date = date;
    operation.category = stateCategory;
    operation.type = type;
    let operationsService = new OperationsService();
    const data = operationsService.createOperation(operation);
    data.then((res) => {
      setLoading(false);
      const confirm = window.confirm(
        "¡La operación fue guardada exitosamente!. ¿Desea agregar otra operación?"
      );
      if (!confirm) {
        window.location.reload(history.push("/home"));
      } else {
        reset(); // reset form viene del useForm
      }
    });
  };

  const onChangeDate = (date) => {
    if (date > currentDate) {
      alert("No puede elegir una fecha mayor a la fecha actual");
    } else {
      setDate(date);
    }
  };

  return (
    <div className="container">
      <div className="d-flex justify-content-center">
        <div className="col-md-5 mt-5">
          <div className="card p-4">
            <div className="card-body">
              <h5 className="text-center mb-3">NEW OPERATION</h5>
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="d-flex align-items-center">
                  <div className="icon">
                    <FontAwesomeIcon icon={faPen} />
                  </div>
                  <input
                    type="text"
                    name="concept"
                    {...register("concept")}
                    placeholder="Concepto..."
                    className="form-control"
                  />
                </div>

                <p className="text-center">
                  <span className="small text-danger">
                    {errors.concept?.message}
                  </span>
                </p>

                <div className="d-flex align-items-center">
                  <div className="icon">
                    <FontAwesomeIcon icon={faHandHoldingUsd} />
                  </div>
                  {/* <input
                    type="text"
                    name="amount"
                    {...register("amount")}
                    placeholder="Monto"
                    className="form-control"
                  /> */}
                  <CurrencyInput
                    id="input-example"
                    name="amount"
                    {...register("amount")}
                    placeholder="$"
                    // defaultValue={800}
                    allowNegativeValue={false}
                    decimalSeparator="," 
                    groupSeparator="."
                    decimalsLimit={2}
                    className="form-control"
                    onValueChange={(value, name) => console.log(value, name)}
                  />
                </div>

                <p className="text-center">
                  <span className="small text-danger">
                    {errors.amount?.message}
                  </span>
                </p>

                <div className="d-flex align-items-center">
                  <div className="icon">
                    <FontAwesomeIcon icon={faCalendarDay} />
                  </div>
                  <DataPicker
                    selected={date}
                    dateFormat="dd/MM/yyyy"
                    onChange={onChangeDate}
                    className="form-control"
                    name="dateOp"
                  />
                </div>

                <p className="">
                  <span className="small text-danger">
                    {errors.dateOp?.message}
                  </span>
                </p> 

                <div className="d-flex align-items-center mt-3">
                  <label className="text-muted">Tipo:</label>
                  <select
                    name="typeOp"
                    className="form-select"
                    value={type}
                    onChange={(e) => {
                      const selectedType = e.target.value;
                      setType(selectedType);
                    }}
                  >
                    <option value="ingreso">Ingreso</option>
                    <option value="egreso">Egreso</option>
                  </select>
                </div>

                <p className="text-center">
                  <span className="small text-danger">
                    {errors.typeOp?.message}
                  </span>
                </p>

                <div className="d-flex align-items-center mt-3">
                  <label className="text-muted">Categoria:</label>
                  <select
                    name="categoryOp"
                    className="form-select"
                    onChange={(e) => {
                      const selectedCategory = e.target.value;
                      setStateCategory(selectedCategory);
                    }}
                  >
                    {stateCategories.map((item) => (
                      <option key={item.id} value={item.id}>
                        {item.name}
                      </option>
                    ))}
                  </select>
                </div>

                <p className="text-center">
                  <span className="small text-danger">
                    {errors.categoryOp?.message}
                  </span>
                </p>

                <div className="d-grid gap-2">
                  <button type="submit" className="btn btn-primary mt-5">
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
                    Save
                  </button>
                </div>
              </form>
              {/* {JSON.stringify(currentDate)} */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateOperation;
