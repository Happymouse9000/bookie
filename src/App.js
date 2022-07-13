import React, { useState, useEffect } from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import { UserProvider } from "./UserContext";
import "bootstrap/dist/css/bootstrap.min.css";
import "react-datepicker/dist/react-datepicker.css";
import "./assets/css/global.css";

import Records from "./pages/Records";
import Login from "./pages/Login";
import Categories from "./pages/Categories";
import Insights from "./pages/Insights";
import Logout from "./pages/Logout";

export default function MyApp(props) {
  const [records, setRecords] = useState([]);
  const [categories, setCategories] = useState([]);
  const [filter, setFilter] = useState("");
  const [search, setSearch] = useState("");
  const [deleteRecord, setDeleteRecord] = useState("");
  const [user, setUser] = useState({
    id: null,
  });

  const unsetUser = () => {
    localStorage.clear();

    setUser({
      id: null,
    });
  };

  useEffect(() => {
    fetch(`https://dry-caverns-57051.herokuapp.com/api/user/details`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((res) => res.json())
      .then((res) => {
        if (res._id) {
          setUser({
            id: res._id,
          });
        } else {
          setUser({
            id: null,
          });
        }
      });
  }, []);

  useEffect(() => {
    if (localStorage.getItem("token") !== null) {
      fetch(`https://dry-caverns-57051.herokuapp.com/api/user/details`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
        .then((res) => res.json())
        .then((res) => {
          setCategories(
            res.categories.map((element) => {
              return element;
            })
          );
          setRecords(
            res.records.map((element) => {
              return element;
            })
          );
        });
    }
  }, []);

  return (
    <UserProvider
      value={{
        user,
        setUser,
        unsetUser,
        records,
        setRecords,
        categories,
        setCategories,
        filter,
        setFilter,
        search,
        setSearch,
        deleteRecord,
        setDeleteRecord,
      }}
    >
      <BrowserRouter>
        <Switch>
          <Route exact path="/" render={(props) => <Login {...props} />} />
          <Route
            exact
            path="/records"
            render={(props) => <Records {...props} />}
          />
          <Route
            exact
            path="/categories"
            render={(props) => <Categories {...props} />}
          />
          <Route
            exact
            path="/insights"
            render={(props) => <Insights {...props} />}
          />
          <Route
            exact
            path="/logout"
            render={(props) => <Logout {...props} />}
          />
        </Switch>
      </BrowserRouter>
    </UserProvider>
  );
}
