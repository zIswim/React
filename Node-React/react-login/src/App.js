import Login from "./Login";
import React, {useEffect} from "react";
import axios from "axios";

const apiUrl = 'http://localhost:3000';


function App() {
    useEffect(() => {
        axios.get('/')
            .then(response => {console.log('서버실행',response)})
    },[]);

  return (
      <div>
        <Login />
      </div>
  );
}

export default App;
