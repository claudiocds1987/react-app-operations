import React from "react";
// axios
import axios from "axios";
// npm i lodash desinstalarla
//import _ from "lodash";

// React pagination npm i react-paginate
import ReactPaginate from "react-paginate";

import { Table, Form, Spinner } from "react-bootstrap";
// npm install react-router-dom
import { useHistory } from "react-router-dom";
// npm install moment --save to format date
import moment from "moment";
// fontawesome
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faEdit, faThumbsDown, faThumbsUp } from "@fortawesome/free-solid-svg-icons";
// npm i react-datepicker
import DataPicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
// css
import "./Home.css";
// services
import OperationsService from "./../../services/operationsService";
import CategoryService from "./../../services/categoryService";

const Home = () => {
  let cont = 1;
  const currentDate = new Date();
  const [categories, setCategories] = React.useState([]);
  const [stateFilter, setStateFilter] = React.useState([]);
  const [stateOperations, setStateOperations] = React.useState([]);
  const [incomeAmount, setIncomeAmount] = React.useState(0); // ?
  const [expensesAmount, setExpensesAmount] = React.useState(0); // ?
  const [showIncomeAmount, setShowIncomeAmount] = React.useState(0); // ?
  const [showExpensesAmount, setShowExpensesAmount] = React.useState(0); // ?
  const [checkCat, setCheckCat] = React.useState(false);
  const [stateType, setStateType] = React.useState("all");
  const [stateCategory, setStateCategory] = React.useState("comida");
  const [checkDate, setCheckDate] = React.useState(false);
  const [date1, setDate1] = React.useState(new Date());
  const [date2, setDate2] = React.useState(new Date());
  // para el Spinner/loader
  const [loading, setLoading] = React.useState(false);
  // ******************* pagination ***************************
  const [pageNumber, setPageNumber] = React.useState(0);
  const itemsPerPage = 7;
  const pagesVisited = pageNumber * itemsPerPage;
  const pageCount = Math.ceil(stateFilter.length / itemsPerPage);
  // ******************* ********** ***************************
  let operationsService = new OperationsService();
  let categoryService = new CategoryService();
  let history = useHistory();
  let user = "";

  // React.useEffect(() => {
  //   if (localStorage.getItem("user") !== null) {
  //     user = localStorage.getItem("user");
  //     getOperations();
  //     getCategories();
  //   }
  // }, []);

  const getCategories = async () => {
    const data = await categoryService.getCategories();
    setCategories(data);
    setLoading(true);
  };

  const getOperations = async () => {
    const data = await operationsService.getOperationsByUser(user);
    setStateOperations(data);
    setStateFilter(data);
    calculateAmounts(data);
    setLoading(true);
  };

  const calculateAmounts = (operations) => {
    let income = 0;
    let expenses = 0;
    operations.forEach(op => {
      let num = parseFloat(op.amount.toString());  
      // let num = parseInt(op.amount.toString());  // !
      if(op.type === 'ingreso'){   
        income += num;
      }else{
        // total amount type egreso
        expenses += num;
      }
    });
    setIncomeAmount(income);
    setExpensesAmount(expenses);
    setShowIncomeAmount(currencyFormat(income));
    setShowExpensesAmount(currencyFormat(expenses));
  }

  const currencyFormat = (num) => {
    return Intl.NumberFormat('es-AR',{style:'currency',currency:'ARS'}).format(num);
  }
    
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

  const Delete = async (id_operation, amountOp, typeOp) => {
    const confirm = window.confirm("??Realmente quiere eliminar la operaci??n?");
    if (confirm) {
      const data = await operationsService.deleteOperation(id_operation);
      // quito la operacion eliminada en operations
      const result = stateOperations.filter(function (obj) {
        return obj.id_operation !== id_operation;
      });

      // recalculating new IncomeAmount or expensesAmount
      let newTotal = 0;
      const amount = parseFloat(amountOp);
      if(typeOp === 'ingreso'){
        newTotal = incomeAmount - amount;
        setIncomeAmount(newTotal);
        setShowIncomeAmount(currencyFormat(newTotal));
      }else{
        newTotal = expensesAmount - amount;
        setExpensesAmount(newTotal);
        setShowExpensesAmount(currencyFormat(newTotal));
      }
      // setting operations and stateFilter
      setStateOperations(result);
      setStateFilter(result);
      alert(data);
    }
  };

  // "{ selected }"" is a variable native from react-paginate
  const changePage = ({ selected }) => {
    setPageNumber(selected);
  };

  React.useEffect(() => {
    if (localStorage.getItem("user") !== null) {
      user = localStorage.getItem("user");
      getOperations();
      getCategories();
    }
  }, []);

  return (
    <div className="container">
      {loading ? setStateFilter : <Spinner animation="border" />}

      <div id="filter-container">
        <div className="d-flex justify-content-between my-3">
          <span className="text-white text-center">
           <FontAwesomeIcon icon={faThumbsUp} color="#5eba7d" />{" "}
            Total ingresos: {showIncomeAmount}
          </span>
          <span className="text-white text-center">
            <FontAwesomeIcon icon={faThumbsDown} color="red" />{" "}
            Total egresos: {showExpensesAmount}
          </span>
        </div>
          
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
            {stateFilter
              .slice(pagesVisited, pagesVisited + itemsPerPage)
              .map((item) => (
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
                        Delete(item.id_operation, item.amount, item.type);
                      }}
                    >
                      <FontAwesomeIcon icon={faTrash} />
                    </button>
                  </div>
                </tr>
              ))}
          </tbody>
        </Table>
        <div className="d-flex justify-content-center">
          <ReactPaginate
            previousLabel={"Previous"}
            nextLabel={"Next"}
            pageCount={pageCount}
            onPageChange={changePage}
            containerClassName={"paginationBttns"}
            previousLinkClassName={"previousBttn"}
            nextLinkClassName={"nextBttn"}
            disabledClassName={"paginationDisabled"}
            activeClassName={"paginationActive"}
          />
        </div>
      </div>
    </div>
  );
};

export default Home;
