import axios from "axios";

class OperationsService{

    async getOperations() {
        
        //return Promise.resolve(this.items);
        try {
            const data = await axios
              .get("http://localhost:4000/api/operations/user/clau@gmail.com")
              .then((res) => {
                return (res.data);
              });
            //setLoading(true);
          } catch (e) {
            alert("Error al intentar obtener las operaciones");
          }       
    }

}


export default OperationsService;