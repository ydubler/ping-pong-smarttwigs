import React, { useState, useEffect } from "react";
import regeneratorRuntime from "regenerator-runtime";
//import "../../public/css/App.css";

function App() {
  const [fetched, setFetched] = useState("Haven't Fetched Yet");
  const [name, setName] = useState("Megan");

  // Login Button
  let getRequest = async () => {
    await fetch("http://localhost:3000/get/sample/all", {
      method: "GET",
      credentials: "include", // required to send cookies (for express-session)
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    })
      .then((response) => {
        console.log(`Response arrived...`);
        return response.json();
      })
      .then((data) => {
        console.log(JSON.stringify(data));
        let dataString = data.text + "\n\n" + JSON.stringify(data.data);
        setFetched(dataString);
      });
  };

  // Login Button
  let postRequest = async (nameIn) => {
    await fetch("http://localhost:3000/post/sample/", {
      method: "POST",
      credentials: "include", // required to send cookies (for express-session)
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        name: nameIn,
        date: new Date(),
      }),
    })
      .then((response) => {
        console.log(`Response arrived...`);
        return response.json();
      })
      .then((data) => {
        console.log(JSON.stringify(data));
        console.log("data.success = " + data.success);
      });
  };

  return (
    <>
      <div>
        Sample App
        <br />
        <input
          type="text"
          id="name"
          name="name"
          defaultValue={name}
          minLength="1"
          maxLength="32"
          size="32"
          onChange={(e) => setName(e.target.value)}
        ></input>{" "}
        {name}
        <button onClick={() => postRequest(name)}>
          Submit Name to Database
        </button>
        <br />
        <button className="font-fondamento" onClick={() => getRequest()}>
          Get Data
        </button>
        <br />
        {fetched}
        <br />
        <img src="/public/images/coffee.jpg"></img>
        <br />
      </div>
    </>
  );
}

export default App;
