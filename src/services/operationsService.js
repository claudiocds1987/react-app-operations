import axios from "axios";

class OperationsService {

  async getOperation(id) {
    // si no funciona poner id_operation en parametro
    try {
      const { data } = await axios({
        method: "get",
        url: `http://localhost:4000/api/operations/${id}`,
        responseType: "json",
      });
      return data;
    } catch (e) {
      alert("Error al intentar obtener la operacion");
    }
  }

  async getOperationsByUser(email) {
    try {
      const { data } = await axios({
        method: "get",
        url: `http://localhost:4000/api/operations/user/${email}`,
        responseType: "json",
      });
      return data;
    } catch (e) {
      alert("Error al intentar obtener las operaciones");
    }
  }

  async createOperation(operation) {
    try {
      let res = await axios.post("http://localhost:4000/api/operations", operation);
      let data = res.data;
      return data;
    } catch (e) {
      alert("Error al guardar la operación");
    }
  }
}

export default OperationsService;
