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

  const [stateOperations, setStateOperations] = React.useState([]);
  const [checkCat, setCheckCat] = React.useState(false);
  const [stateType, setStateType] = React.useState("all");
  const [stateCategory, setStateCategory] = React.useState(1);

  // guardo la data del props en el useState
  React.useEffect(() => {
    // acordate que aca estan todas las operaciopnes de tipo "ingreso" de egreso no hay.
    setStateOperations(props.operations);
  }, [props.operations]);


  const filter = (e) => {
    if (checkCat) {
      alert("filtra por categoria y tipo");
      console.log("TYPE: " + stateType);
      console.log("CATEGORIA: " + stateCategory);

      // setStateOperations(prev => prev.filter(item => item.category === stateCategory && item.type === stateType));

      const result = stateOperations.filter(function (obj) {
        return obj.type === stateType && obj.category === stateCategory;
      });

      setStateOperations(result);
      console.log(result);

    } else {
      // filtrar solo por type
      alert("filtra solo por tipo");
      console.log("SOLO TYPE: " + stateType);

      const caca = stateOperations.filter(function (obj) {
        return obj.type === stateType;
      });

      setStateOperations(caca);
      console.log(caca);
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
            {stateOperations.map((item) => (
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
