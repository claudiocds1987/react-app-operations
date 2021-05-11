import React from "react";
import { Table } from "react-bootstrap";
// npm install moment --save to format date
import moment from "moment";

const Home = () => {

  const [income, setIncome] = React.useState();
  const [expenses, setExpenses] = React.useState();
  const [users, setUsers] = React.useState([]);

  let cont = 1;

  React.useEffect(() => {
    getUsers();
    getOperations();
  }, []);

  const getUsers = async () => {
    const data = await fetch("http://localhost:4000/api/users");
    const usersData = await data.json();
    // console.log(usersData);
    setUsers(usersData);
  };

  const getOperations = async () => {
    const data = await fetch("http://localhost:4000/api/operations");
    const operationsData = await data.json();
    
    // getting amount by type 'ingreso
    const totalIncome = operationsData
      .filter((item) => item.type === "ingreso")
      .reduce((count, item) => count + parseFloat(item.amount), 0);
   
    // getting amount by type 'egreso'
    const totalExpenses = operationsData
      .filter((item) => item.type === "egreso")
      .reduce((count, item) => count + parseFloat(item.amount), 0);
  
    setIncome(totalIncome);
    setExpenses(totalExpenses);
    
  };

  return (
    <div className="container">
      <div className="row">
        <div className="col-12 col-sm-12 col-md-4">
          <h4>Total de ingresos de usuarios: ${income}</h4>
          <h4>Total de egresos de usuarios: ${expenses}</h4>
        </div>
        <div className="col-12 col-sm-12 col-md-8">
          <div className="table-responsive mt-3">
            <Table striped bordered hover size="sm">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Email</th>
                  <th>Fecha registro</th>
                </tr>
              </thead>
              <tbody>
                {users.map((item) => (
                  <tr key={item.email}>
                    <td>{cont++}</td>
                    <td>{item.email}</td>

                    <td>
                      {moment(item.registration_date)
                        .subtract(10, "days")
                        .calendar()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
