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

class CategoryService {
  async getCategories() {
    try {
      // si no funciona quitar authAxios y poner "axios"
      const { data } = await authAxios({
        method: "get",
        url: `${apiUrl}/categories`,
        responseType: "json",
      });
      return data;
    } catch (e) {
      alert("Error al intentar obtener las categorias");
    }
  }

  // sin token
  // async getCategories() {
  //   try {
  //     const { data } = await axios({
  //       method: "get",
  //       url: "http://localhost:4000/api/categories",
  //       responseType: "json",
  //     });
  //     return data;
  //   } catch (e) {
  //     alert("Error al intentar obtener las categorias");
  //   }
  // }
}

export default CategoryService;
