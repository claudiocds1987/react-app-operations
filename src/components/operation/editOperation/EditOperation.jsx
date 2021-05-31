import React from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Spinner } from "react-bootstrap";
// npm install react-hook-form
import { useForm } from "react-hook-form";
// npm install @hookform/resolvers yup (para las validaciones)
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
// npm i react-datepicker
import DataPicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPen,
  faHandHoldingUsd,
  faCalendarDay,
} from "@fortawesome/free-solid-svg-icons";

// services
import OperationsService from "./../../../services/operationsService";
import CategoryService from "./../../../services/categoryService";

const schema = yup.object().shape({
  concept: yup.string().required("Campo obligatorio"),
  amount: yup.number().required("Campo obligatorio"),
});

const operation = {
  userEmail: "",
  concept: "",
  amount: "",
  date: "",
  category: "",
  type: "",
  state: true,
};

const EditOperation = () => {
  const currentDate = new Date();
  const [stateCategories, setStateCategories] = React.useState([]);
  const [idCategory, setIdCategory] = React.useState("");
  const [date, setDate] = React.useState(new Date());
  const [type, setType] = React.useState("ingreso");
  const [user, setUser] = React.useState("");
  const [operation, setOperation] = React.useState([]);
  // para el Spinner/loader
  const [loading, setLoading] = React.useState(false);
  //getting id_operation from url
  const { id } = useParams();
  const [catName, setCatName] = React.useState("");
  let operationService = new OperationsService();
  let categoryService = new CategoryService();

  React.useEffect(() => {
    console.log("URL id_operation: " + id);
    if (localStorage.getItem("user") !== null) {
      setUser(localStorage.getItem("user"));
      getOperation();
    }
  }, []);

  const getOperation = () => {
    const data = operationService.getOperation(id);
    data.then((res) => {
      console.log("OPERATION DATA:");
      console.log(res);
      setOperation(res);
      // setIdCategory(res[0].category);
      getCategories(res[0].category);
      /////////////////NO BORRAR HASTA QUE FUNCIONE BIEN EL EDITAR/////////////////////////////
      // const idCat = res[0].category;
      // const data = categoryService.getCategories();
      // data.then((res) => {
      //   //console.log(res);
      //   let categories = res;

      //   categories.forEach((item) => {
      //     if (item.id === idCat) {
      //       console.log("Nombre de categoria: " + item.name);
      //       setCatName(item.name);
      //     }
      //   });
      //   // in this way i fix the problem about having the two categories repeated in <select>
      //   // returning the objects with the condition
      //   const result = categories.filter(function (obj) {
      //     return obj.id !== idCat;
      //   });
      //   setStateCategories(result);
      //   //setLoading(true);
      // });
      ////////////////////////////////////////////////
    });
  };

  const getCategories = (idCategory) => {
    setIdCategory(idCategory);
    const data = categoryService.getCategories();
    console.log("idCategory hook: " + idCategory);
    data.then((res) => {
      let categories = res;
      setStateCategories(categories);
      categories.forEach((item) => {
        if (item.id === idCategory) {
          console.log("Nombre de categoria " + item.name);
          setCatName(item.name);
        }
      });
      // returning the objects with the condition
      const result = categories.filter(function (obj) {
        return obj.id !== idCategory;
      });
      setStateCategories(result);
      //setLoading(true);
    });
  };

  

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
    operation.userEmail = user;
    operation.concept = formData.concept;
    operation.amount = formData.amount;
    operation.date = date;
    operation.category = idCategory;
    operation.type = type;

    console.log("antes de editar: " + operation.category);
    reset(); // reset viene del useForm

    // PUT con axios
    // axios
    //   .post("http://localhost:4000/api/operations", operation)
    //   .then((resp) => {
    //     alert("La operación fue guardada exitosamente!");
    //   })
    //   .catch((err) => {
    //     alert("Error al intentar guardar la operación");
    //   });
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
              <h5 className="text-center mb-3">EDIT OPERATION</h5>
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
                    value={operation.map((item) => item.concept)}
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
                  <input
                    type="text"
                    name="amount"
                    {...register("amount")}
                    placeholder="Monto"
                    className="form-control"
                    value={operation.map((item) => item.amount)}
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
                    selected={Date.parse(operation.map((item) => item.date))}
                    dateFormat="dd/MM/yyyy"
                    onChange={onChangeDate}
                    className="form-control"
                    name="date"
                  />
                </div>

                <div className="d-flex align-items-center mt-3">
                  <label className="text-muted">Tipo:</label>
                  <select
                    className="form-select"
                    value={operation.map((item) => item.type)}
                    onChange={(e) => {
                      const selectedType = e.target.value;
                      setType(selectedType);
                    }}
                  >
                    <option value="ingreso">Ingreso</option>
                    <option value="egreso">Egreso</option>
                  </select>
                </div>

                <div className="d-flex align-items-center mt-3">
                  <label className="text-muted">Categoria:</label>
                  <select
                    className="form-select"
                    onChange={(e) => {
                      const selectedCategory = e.target.value;
                      setIdCategory(selectedCategory);
                    }}
                  >
                    <option
                      selected
                      key={operation.map((item) => item.category)}
                      value={operation.map((item) => item.category)}
                    >
                      {catName}
                    </option>

                    {stateCategories.map((item) => (
                      <option key={item.id} value={item.id}>
                        {item.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="d-grid gap-2">
                  <button 
                    type="submit" 
                    className="btn btn-primary mt-5"
                  >
                    Editar
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditOperation;
