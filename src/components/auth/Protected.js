import React, { useEffect } from "react";
import { useHistory } from "react-router-dom";

function Protected(props) {
  let Cmp = props.Cmp;
  const history = useHistory();

  useEffect(() => {
    // if(localStorage.getItem("user") === null && localStorage.getItem("token") === null){
    //   alert('no existe user o token')
    //   history.push("/login")
    // }
    if(!localStorage.getItem("user") && !localStorage.getItem("token")){
        // alert('no existe user o token')
        history.push("/login")
    }
  }, []);

  return (
    <div>
      <Cmp />
    </div>
  );
}

export default Protected;
