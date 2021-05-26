import axios from "axios";

class OperationsService {
 
  async getOperations(email) {
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
}

export default OperationsService;
