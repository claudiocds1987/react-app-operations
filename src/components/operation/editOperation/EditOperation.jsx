import React from "react";
import { useParams } from "react-router-dom";
// npm install react-router-dom
import { useHistory } from "react-router-dom";
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

//import Prueba from "./prueba"; // ??

const schema = yup.object().shape({
  concept: yup.string().required("Campo obligatorio"),
  amount: yup.number().required("Campo obligatorio"),
});

const EditOperation = () => {
  //??????????????????????????????????????????????????????????????????? */
  // const [opObject, setOpObject] = React.useState({
  //   id_operation: "",  
  //   userEmail: "",
  //   concept: "",
  //   amount: "",
  //   date: "",
  //   category: "",
  //   type: "",
  //   state: true,
  // });
  //??????????????????????????????????????????????????????????????????? */
 
  const [stateCategories, setStateCategories] = React.useState([]);
  const [idCategory, setIdCategory] = React.useState("");
  const [date, setDate] = React.useState("");
  const [type, setType] = React.useState("");
  const [user, setUser] = React.useState("");
  const [operation, setOperation] = React.useState([]);
  // para el Spinner/loader
  const [loading, setLoading] = React.useState(false);
  //getting id_operation from url
  const { id } = useParams();
  const [catName, setCatName] = React.useState("");
  let history = useHistory();
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
      setOperation(res);
      setType(res[0].type);
      setDate(res[0].date);
      // setting default values in inputs of the form
      setValue("concept", res[0].concept);
      setValue("amount", res[0].amount);

      getCategories(res[0].category);
    });
  };

  const getCategories = (idCategory) => {
    setIdCategory(idCategory);
    const data = categoryService.getCategories();
    data.then((res) => {
      let categories = res;
      setStateCategories(categories);
      categories.forEach((item) => {
        if (item.id === idCategory) {
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
    setValue,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    // defaultValues: {
    //   concept: ""
    //   amount: "amountDefault",
    // }
  });

  const onSubmit = (formData, e) => {
    e.preventDefault(); // evita que haga refresh
    // charge data in operation object
    const operation = {
      id_operation: id,
      userEmail: user,
      concept: formData.concept,
      amount: formData.amount,
      date: date,
      category: idCategory,
      type: type,
      state: true,
    };
    //activating spinner/loader
    setLoading(true); 

    let operationsService = new OperationsService();
    const data = operationsService.updateOperation(operation);
    data.then(res => {
      setLoading(false);
      alert(res);
      reset(); // reset viene del useForm
      window.location.reload(history.push("/home"));
    })
  };

  const onChangeDate = (date) => {
    const currentDate = new Date();
    if (date > currentDate) {
      alert("No puede elegir una fecha mayor a la fecha actual");
    } else {
      setDate(date);
      //console.log(date);
    }
  };

  return (
    <div className="container">
      <div className="d-flex justify-content-center">
      {/* {loading === true ? <Spinner animation="border"/> : ""} */}
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
                    selected={Date.parse(date)}
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
                    onChange={(e) => {
                      const selectedType = e.target.value;
                      setType(selectedType);
                    }}
                  >
                    <option selected={type}>{type}</option>
                    {
                      type === "egreso" ? <option value="ingreso">ingreso</option> : <option value="egreso">egreso</option>
                    }
                    
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
                  <button type="submit" className="btn btn-primary mt-5">
                  {loading === true ? 
                    <Spinner
                      as="span"
                      animation="border"
                      size="sm"
                      role="status"
                      aria-hidden="true"
                    /> 
                    : 
                    ""
                  }
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
