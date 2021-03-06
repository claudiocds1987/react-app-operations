import React from "react";
// axios
import axios from "axios";
import { Table, Form, Spinner } from "react-bootstrap";
// npm install moment --save to format date
import moment from "moment";
// fontawesome
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faEdit, faSyncAlt } from "@fortawesome/free-solid-svg-icons";
import { Fragment } from "react";
// npm i react-datepicker
import DataPicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
// css
import "./OperationsList.css";

const OperationsList = (props) => {
  const currentDate = new Date();
  const [stateFilter, setStateFilter] = React.useState([]);
  const [stateOperations, setStateOperations] = React.useState([]);
  const [checkCat, setCheckCat] = React.useState(false);
  const [stateType, setStateType] = React.useState("all");
  const [stateCategory, setStateCategory] = React.useState("comida");
  const [checkDate, setCheckDate] = React.useState(false);
  const [date1, setDate1] = React.useState(new Date());
  const [date2, setDate2] = React.useState(new Date());
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    getOperations();
  }, []);

  const getOperations = async () => {
    try {
      const data = await axios
        .get("http://localhost:4000/api/operations/user/clau@gmail.com")
        .then((res) => {
          console.log(res);
          setStateOperations(res.data);
          setStateFilter(res.data);
        });
      setLoading(true);
    } catch (e) {
      alert("Error al intentar obtener las operaciones");
    }
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
        alert("entro aca");
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

  let cont = 1;

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

  return (
    <Fragment>
      {loading ? setStateFilter : <Spinner animation="border" />}

      <div id="filter-contain">
        <div id="box-check">
          <div className="d-flex mb-3">
            <Form.Check label="Tipo:" checked className="mt-1" />
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
          <div className="d-flex mb-3">
            <Form.Check
              label="Categoria:"
              checked={checkCat}
              onChange={(e) => {
                setCheckCat(!checkCat);
              }}
            />
            <select
              // se muestra cuando el check category esta checked
              //hidden={!checkCat}
              disabled={!checkCat}
              className="form-select"
              onChange={(e) => {
                const selectedCategory = e.target.value;
                setStateCategory(selectedCategory);
              }}
            >
              {props.categories.map((item) => (
                <option key={item.id} value={item.name}>
                  {item.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div id="box-date-range">
          <Form.Check
            label="Fecha:"
            onChange={(e) => {
              setCheckDate(!checkDate);
            }}
          />
          <div>
            <div className="d-flex">
              <DataPicker
                disabled={!checkDate}
                dateFormat="dd/MM/yyyy"
                selected={date1}
                onChange={onChangeDate1}
                className="form-control"
                name="date1"
              />
              <label>Hasta: </label>
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
        </div>

        <div className="text-center">
          <button
            id="btn-filtrar"
            className="btn my-3 table"
            onClick={filter}
          >
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
                  <button className="btn btn-primary">
                    <FontAwesomeIcon icon={faEdit} />
                  </button>
                  <button className="btn btn-danger">
                    <FontAwesomeIcon icon={faTrash} />
                  </button>
                </div>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    </Fragment>
  );
};

export default OperationsList;
