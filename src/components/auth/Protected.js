import React, {useEffect} from "react";
import { Redirect, useHistory } from "react-router-dom"

function Protected(props){
    let Cmp = props.Cmp;
    const history = useHistory();

    useEffect(() => {
        if(!localStorage.getItem("user")){
            history.push("/login")
        }
    }, [])

    return(
        <div>
           <Cmp />
        </div>    
    );
}

// function Profile({authorized}){
//     if(!authorized){
//         return <Redirect to="login" />
//     }
//     else{
//         return <Redirect to="home" />
//     }
// }

export default Protected;