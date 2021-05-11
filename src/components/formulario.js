import React, { Component } from "react";
// npm install react-hook-form
import { useForm } from "react-hook-form";
// npm install @hookform/resolvers yup (para las validaciones)
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
// npm i react-datepicker
import DataPicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const schema = yup.object().shape({
  concept: yup.string().required("Campo obligatorio"),
  amount: yup.number().required("Campo obligatorio"),
});

class Formulario extends Component {
  constructor(props) {
    super(props);

    this.state = {
      concept: "",
      amount: "",
      name: "",
      date: new Date(),
      type: "ingreso"
    };
  }

  changeHandler = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };


  
  submitHandler = (e) => {
    e.preventDefault();
    console.log(this.state);
  };

  render() {
    const { concept, amount, name, date, type } = this.state;


    return (
      <form onSubmit={this.submitHandler}>
        <input
          type="text"
          name="concept"
          value={concept}
          placeholder="Concepto..."
          className="form-control"
          onChange={this.changeHandler}
        />

        <input
          type="text"
          name="amount"
          value={amount}
          placeholder="monto..."
          className="form-control"
          onChange={this.changeHandler}
        />

        <input
          type="text"
          name="name"
          value={name}
          placeholder="name"
          className="form-control"
          onChange={this.changeHandler}
        />

        <DataPicker
          name="date"
          selected={date}
          value={date}
          // onChange={this.changeHandler}
          className="form-control"
         
        />

        <select
          className="form-select mt-3"
          value={type}
          onChange={this.changeHandler}
          className="form-control"
          name="type"
          // onChange={(e) => {
          //   const selectedType = e.target.value;
          //   setType(selectedType);
          // }}
        >
          <option value="ingreso">Ingreso</option>
          <option value="egreso">Egreso</option>
        </select>

        <button type="submit" className="btn btn-primary">
          Enviar
        </button>
      </form>
    );
  }
}

export default Formulario;
