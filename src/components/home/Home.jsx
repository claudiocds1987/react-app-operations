import React from "react";
// axios
import axios from "axios";
import { Table, Form, Spinner } from "react-bootstrap";
// npm install react-router-dom
import { Link, useHistory } from "react-router-dom";
// npm install moment --save to format date
import moment from "moment";
// fontawesome
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faEdit, faSyncAlt } from "@fortawesome/free-solid-svg-icons";
// npm i react-datepicker
import DataPicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
// css
import "./Home.css";
// services
import OperationsService from "./../../services/operationsService"

const Home = () => {
  const currentDate = new Date();
  const [categories, setCategories] = React.useState([]);
  const [stateFilter, setStateFilter] = React.useState([]);
  const [stateOperations, setStateOperations] = React.useState([]);
  const [checkCat, setCheckCat] = React.useState(false);
  const [stateType, setStateType] = React.useState("all");
  const [stateCategory, setStateCategory] = React.useState("comida");
  const [checkDate, setCheckDate] = React.useState(false);
  const [date1, setDate1] = React.useState(new Date());
  const [date2, setDate2] = React.useState(new Date());
  const [loading, setLoading] = React.useState(false);
  let history = useHistory();
  let cont = 1;
  let user = '';

  React.useEffect(() => {
    if(localStorage.getItem("user") !== null){
      user = localStorage.getItem('user');
    }
    getOperations();
    getCategories();
  }, []);

  const getCategories = async () => {
    const data = await fetch("http://localhost:4000/api/categories");
    const categoriesData = await data.json();
    setCategories(categoriesData);
  };

  const getOperations = async () => {
    let operationsService = new OperationsService();
    const data = operationsService.getOperationsByUser(user);
    data.then(res => {
      console.log(res);
      setStateOperations(res);
      setStateFilter(res);
      setLoading(true);
    })
    //setLoading(true);
    // data.then(res => console.log(res));
    //console.log(data);
    // try {
    //   const data = await axios
    //   .get(`http://localhost:4000/api/operations/user/${user}`)
    //     // .get("http://localhost:4000/api/operations/user/clau@gmail.com")
    //     .then((res) => {
    //      // console.log(res);
    //       setStateOperations(res.data);
    //       setStateFilter(res.data);
    //     });
    //   setLoading(true);
    // } catch (e) {
    //   alert("Error al intentar obtener las operaciones");
    // }
  };

  const filter = () => {
    let result;
    if (checkDate) {
      // format dates from useState to shortDate
      let startDate = moment(date1).format("MM/DD/YYYY");
      let endDate = moment(date2).format("MM/DD/YYYY");
      // format dates from stateOperations array to shortDate
      const formatedDates = stateOperations.map((elem) => ({
        amount: elem.amount,
        category: elem.category,
        concept: elem.concept,
        date: moment(elem.date).format("MM/DD/YYYY"),
        id_operation: elem.id_operation,
        type: elem.type,
      }));

      if (checkCat) {
        if (stateType === "all") {
          // filter by date range and category
          result = formatedDates.filter(function (obj) {
            return (
              obj.category === stateCategory &&
              obj.date >= startDate &&
              obj.date <= endDate
            );
          });
        } else {
          // filter date range and type and category
          result = formatedDates.filter(function (obj) {
            return (
              obj.type === stateType &&
              obj.category === stateCategory &&
              obj.date >= startDate &&
              obj.date <= endDate
            );
          });
        }
      } else {
        if (stateType === "all") {
          // filter only by date range
          result = formatedDates.filter(function (obj) {
            return obj.date >= startDate && obj.date <= endDate;
          });
        } else {
          // filter by date range and type
          result = formatedDates.filter(function (obj) {
            return (
              obj.type === stateType &&
              obj.date >= startDate &&
              obj.date <= endDate
            );
          });
        }
      }
    } else if (!checkDate && checkCat) {
      // filter by only by category
      if (stateType === "all") {
        result = stateOperations.filter(function (obj) {
          return obj.category === stateCategory;
        });
      } else {
        result = stateOperations.filter(function (obj) {
          return obj.type === stateType && obj.category === stateCategory;
        });
      }
    } else {
      // filter only by type
      if (stateType === "all") {
        result = stateOperations;
      } else {
        result = stateOperations.filter(function (obj) {
          return obj.type === stateType;
        });
      }
    }
    setStateFilter(result);
  };

  const onChangeDate1 = (date) => {
    if (date > currentDate) {
      alert("No puede elegir una fecha mayor a la fecha actual");
    } else if (date > date2) {
      alert("La fecha no puede ser mayor a la fecha 2");
    } else {
      setDate1(date);
    }
  };

  const onChangeDate2 = (date) => {
    if (date < date1) {
      alert("No puede elegir una fecha menora la fecha 1");
    } else if (date > currentDate) {
      alert("La fecha no puede ser mayor a la actual");
    } else {
      setDate2(date);
    }
  };

  const Delete = async (id_operation) => {
    const confirm = window.confirm("¿Realmente quiere eliminar la operación?");
    if (confirm) {
      try {
        const data = await axios
          .put(`http://localhost:4000/api/operations/delete/${id_operation}`)
          .then((res) => {
            alert("La operación fue eliminada");
            getOperations();
          });
        setLoading(true);
      } catch (e) {
        alert("Error al eliminar la operación");
      }
    }
  };

  return (
    <div className="container">
     
      {loading ? setStateFilter : <Spinner animation="border" />}

      <div id="filter-container">
        <div id="secondary-container">
          <div id="box-check">
            <div className="d-flex mb-3 align-items-center">
              <Form.Check label="Tipo:" checked />
              <select
                className="form-select"
                value={stateType}
                onChange={(e) => {
                  const selectedType = e.target.value;
                  setStateType(selectedType);
                }}
              >
                <option value="all">Todas</option>
                <option value="ingreso">Ingreso</option>
                <option value="egreso">Egreso</option>
              </select>
            </div>
            <div className="d-flex mb-3 align-items-center" id="box-category">
              <Form.Check
                label="Categoria:"
                checked={checkCat}
                onChange={(e) => {
                  setCheckCat(!checkCat);
                }}
              />
              <select
                // se habilita cuando el check category esta checked
                disabled={!checkCat}
                className="form-select"
                onChange={(e) => {
                  const selectedCategory = e.target.value;
                  setStateCategory(selectedCategory);
                }}
              >
                {categories.map((item) => (
                  <option key={item.id} value={item.name}>
                    {item.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div id="box-date-range" className="d-flex mb-3 align-items-center">
            <Form.Check
              label="Fecha:"
              onChange={(e) => {
                setCheckDate(!checkDate);
              }}
            />

            <DataPicker
              disabled={!checkDate}
              dateFormat="dd/MM/yyyy"
              selected={date1}
              onChange={onChangeDate1}
              className="form-control"
              name="date1"
            />
            <label className="mx-2">Hasta: </label>
            <DataPicker
              disabled={!checkDate}
              dateFormat="dd/MM/yyyy"
              selected={date2}
              onChange={onChangeDate2}
              className="form-control"
              name="date2"
            />
          </div>
        </div>

        <div className="text-center">
          <button id="btn-filtrar" className="btn my-3 table" onClick={filter}>
            Filtrar
          </button>
        </div>
      </div>

      <div className="table-responsive">
        <Table striped bordered hover variant="dark" size="sm">
          <thead>
            <tr className="text-center">
              <th>
                <button id="btn-refreshTable">
                  <FontAwesomeIcon icon={faSyncAlt} onClick={getOperations} />
                </button>
                <span className="mx-2">Fecha</span>
              </th>
              <th>Concepto</th>
              <th>Monto</th>
              <th>Tipo</th>
              <th>Categoria</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {stateFilter.map((item) => (
              <tr key={cont++} className="text-center align-middle">
                <td>{moment(item.date).format("DD/MM/YYYY")}</td>
                <td>{item.concept}</td>
                <td>{item.amount}</td>
                <td>{item.type}</td>
                <td>{item.category}</td>
                <div className="text-center">
                  <button 
                    className="btn btn-primary"
                    //to="/EditOperation" 
                    onClick={() => {
                      history.push(`/editOperation/${item.id_operation}`);
                    }}
                    >
                    <FontAwesomeIcon icon={faEdit} />
                  </button>
                  <button
                    className="btn btn-danger"
                    onClick={() => {
                      Delete(item.id_operation);
                    }}
                  >
                    <FontAwesomeIcon icon={faTrash} />
                  </button>
                </div>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    </div>
  );
};

export default Home;
