import axios from "axios";

class AuthService {
  async login(user) {
    try {
      let res = await axios.post("http://localhost:4000/api/auth/login", user);
      const data = res.data;
      return data;
    } catch (e) {
      alert("Error login de usuario");
    }
  }

}

export default AuthService;
