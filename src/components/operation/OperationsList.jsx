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

  const [checkCat, setCheckCat] = React.useState(false);
  const [type, setType] = React.useState("ingreso");
  const [stateCategory, setStateCategory] = React.useState();

  let cont = 1;

  return (
    <Fragment>
      <div id="box-check">
        <div className="d-flex mb-3">
          <Form.Check label="Tipo:" checked className="mt-1" />
          <select
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
              <option key={item.id} value={item.id}>
                {item.name}
              </option>
            ))}
          </select>
        </div>
        {type} - {stateCategory}
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
            {props.operations.map((item) => (
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
