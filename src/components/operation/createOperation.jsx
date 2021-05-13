import React from "react";
import axios from "axios";
// npm install react-hook-form
import { useForm } from "react-hook-form";
// npm install @hookform/resolvers yup (para las validaciones)
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
// npm i react-datepicker
import DataPicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

// components
import OperationsList from "./OperationsList";

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

const CreateOperation = () => {

  const currentDate = new Date();
  const [stateCategories, setStateCategories] = React.useState([]);
  const [stateCategory, setStateCategory] = React.useState();
  const [date, setDate] = React.useState(new Date());
  const [type, setType] = React.useState("ingreso");

  React.useEffect(() => {
    getCategories();
  }, []);

  const getCategories = async () => {
    const data = await fetch("http://localhost:4000/api/categories");
    const categoriesData = await data.json();
    setStateCategories(categoriesData);
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
    operation.userEmail = "clau@gmail.com";
    operation.concept = formData.concept;
    operation.amount = formData.amount;
    operation.date = date;
    operation.category = stateCategory;
    operation.type = type;

    console.log(operation);
    reset(); // reset viene del useForm

    // POST con axios
    axios
      .post("http://localhost:4000/api/operations", operation)
      .then((resp) => {
        alert("La operación fue guardada exitosamente!");
      })
      .catch((err) => {
        alert("Error al intentar guardar la operación");
      });
  };

  const onChangeDate = (date) => {

    if(date > currentDate){
      alert('No puede elegir una fecha mayor a la fecha actual')
    }else{
      setDate(date);
    }  
  };

  return (
    <div className="container">
      <div className="row">
        <div className="col-md-5 mt-5">
          <div className="card p-4">
            <div className="card-body">
              <h5 className="text-center mb-3">NEW OPERATION</h5>
              <form onSubmit={handleSubmit(onSubmit)}>
                <input
                  type="text"
                  name="concept"
                  {...register("concept")}
                  placeholder="Concepto..."
                  className="form-control"
                />
                <p className="text-danger">{errors.concept?.message}</p>

                <input
                  type="text"
                  name="amount"
                  {...register("amount")}
                  placeholder="Monto"
                  className="form-control"
                />
                <p className="text-danger">{errors.amount?.message}</p>

                <DataPicker
                  selected={date}
                  onChange={onChangeDate}
                  className="form-control"
                  name="date"
                />

                <select
                  className="form-select mt-3"
                  value={type}
                  onChange={(e) => {
                    const selectedType = e.target.value;
                    setType(selectedType);
                  }}
                >
                  <option value="ingreso">Ingreso</option>
                  <option value="egreso">Egreso</option>
                </select>

                <select
                  className="form-select mt-3"
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

                <div className="d-grid gap-2">
                  <button type="submit" className="btn btn-primary mt-5">
                    Enviar
                  </button>
                </div>
              </form>
              {/* {JSON.stringify(currentDate)} */}
            </div>
          </div>
        </div>
        <div className="col-md-7 mt-5">
          <OperationsList categories={stateCategories}/>
        </div>
      </div>
    </div>
  );
};

export default CreateOperation;
