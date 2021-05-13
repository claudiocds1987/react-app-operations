import React from "react";
import { Table, Form } from "react-bootstrap";
// npm install moment --save to format date
import moment from "moment";
// fontawesome
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faEdit } from "@fortawesome/free-solid-svg-icons";
import { Fragment } from "react";

// css
import "./OperationList.css";

const OperationsList = (props) => {

  const [stateFilter, setStateFilter] = React.useState([]);
  const [stateOperations, setStateOperations] = React.useState([]);
  const [checkCat, setCheckCat] = React.useState(false);
  const [stateType, setStateType] = React.useState("all");
  const [stateCategory, setStateCategory] = React.useState(1);

  React.useEffect(() => {
    getOperations();
  }, []);

  const getOperations = async () => {
    const data = await fetch(
      'http://localhost:4000/api/operations/user/clau@gmail.com'
    );
    const operationsData = await data.json();
    console.log(operationsData);
    setStateOperations(operationsData);
    setStateFilter(operationsData);
  };

  const filter = (e) => {
    if (checkCat) {
      // filter by type and category
      let result;

      if(stateType === 'all'){
        result = stateOperations.filter(function (obj) {
          return obj.category === stateCategory;
        });
      }else{
        result = stateOperations.filter(function (obj) {
          return obj.type === stateType && obj.category === stateCategory;
        });
      }

      setStateFilter(result);
      console.log(result);

    } else {
      // filter only by type

      if(stateType === 'all'){
        setStateFilter(stateOperations);
      }else{
        const result = stateOperations.filter(function (obj) {
          return obj.type === stateType;
        });
        setStateFilter(result);
      }

      // const result = stateOperations.filter(function (obj) {
      //   return obj.type === stateType;
      // });
      // setStateFilter(result);
      // console.log(result);
    }
  };

  let cont = 1;

  return (
    <Fragment>
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
        <div className="d-flex">
          <Form.Check
            className="mt-1"
            label="Categoria:"
            checked={checkCat}
            onChange={(e) => {
              setCheckCat(!checkCat);
            }}
          />
          <select
            // se muestra cuando el check category esta checked
            hidden={!checkCat}
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
        <button className="btn btn-info" onClick={filter}>
          search
        </button>
      </div>

      <div className="table-responsive">
        <Table striped bordered hover size="sm">
          <thead>
            <tr>
              <th>Fecha</th>
              <th>Concepto</th>
              <th>Monto</th>
              <th>Tipo</th>
              <th>Categoria</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {stateFilter.map((item) => (
              <tr key={cont++}>
                <td>
                  {moment(item.registration_date)
                    .subtract(10, "days")
                    .calendar()}
                </td>
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
