import axios from "axios";

// ---Envio de token a http request---------
const token = localStorage.getItem("token");
const apiUrl = "http://localhost:4000/api";
const authAxios = axios.create({
  baseURL: apiUrl,
  headers: {
    Authorization: `Bearer ${token}`,
  },
});
// -----------------------------------------


class OperationsService {

  async getOperation(id) {
    // si no funciona poner id_operation en parametro
    try {
      const { data } = await authAxios({
        method: "get",
        url: `${apiUrl}/operations/${id}`,
        responseType: "json",
      });
      return data;
    } catch (e) {
      alert("Error al intentar obtener la operacion");
    }
  }

  async getOperationsByUser(email) {
    try {
      const { data } = await authAxios({
        method: "get",
        url: `${apiUrl}/operations/user/${email}`,
        responseType: "json",
      });
      return data;
    } catch (e) {
      alert("Error al intentar obtener las operaciones");
    }
  }

  async createOperation(operation) {
    try {
      let res = await authAxios.post(`${apiUrl}/operations`, operation);
      let data = res.data;
      return data;
    } catch (e) {
      alert("Error al guardar la operación");
    }
  }

  async updateOperation(operation) {
    try {
      let res = await authAxios.put(`${apiUrl}/operations/${operation.id_operation}`, operation);
      let data = res.data;
      return data;
    } catch (e) {
      alert("Error al guardar la operación");
    }
  }

  async deleteOperation(id_operation) {
    try {
      const res = await axios.put(`http://localhost:4000/api/operations/delete/${id_operation}`);
      const data = res.data;
      return data;
    } catch (e) {
      alert("Error al eliminar la operación");
    }
  }

  // SIN TOKEN
  // async getOperation(id) {
  //   // si no funciona poner id_operation en parametro
  //   try {
  //     const { data } = await axios({
  //       method: "get",
  //       url: `http://localhost:4000/api/operations/${id}`,
  //       responseType: "json",
  //     });
  //     return data;
  //   } catch (e) {
  //     alert("Error al intentar obtener la operacion");
  //   }
  // }

  // async getOperationsByUser(email) {
  //   try {
  //     const { data } = await axios({
  //       method: "get",
  //       url: `http://localhost:4000/api/operations/user/${email}`,
  //       responseType: "json",
  //     });
  //     return data;
  //   } catch (e) {
  //     alert("Error al intentar obtener las operaciones");
  //   }
  // }

  // async createOperation(operation) {
  //   try {
  //     let res = await axios.post("http://localhost:4000/api/operations", operation);
  //     let data = res.data;
  //     return data;
  //   } catch (e) {
  //     alert("Error al guardar la operación");
  //   }
  // }

  // async updateOperation(operation) {
  //   try {
  //     let res = await axios.put(`http://localhost:4000/api/operations/${operation.id_operation}`, operation);
  //     let data = res.data;
  //     return data;
  //   } catch (e) {
  //     alert("Error al guardar la operación");
  //   }
  // }

}

export default OperationsService;
