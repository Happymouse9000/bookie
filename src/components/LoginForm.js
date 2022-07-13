import { useState, useContext } from "react";
import { Form, Container, Row, Col, Card } from "react-bootstrap";
import UserContext from "../UserContext";
import Swal from "sweetalert2";
import { GoogleLogin } from "react-google-login";
import { Redirect } from "react-router-dom";

import RegisterForm from "./RegisterForm";

export default function LoginForm() {
  const { setUser, setCategories, setRecords } = useContext(UserContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [willRedirect, setWillRedirect] = useState(false);

  function authenticate(e) {
    e.preventDefault();

    fetch(`https://dry-caverns-57051.herokuapp.com/api/user/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email,
        password: password,
      }),
    })
      .then((res) => res.json())
      .then((res) => {
        console.log(res);
        if (res.access) {
          localStorage.setItem("token", res.access);
          fetch(`https://dry-caverns-57051.herokuapp.com/api/user/details`, {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${res.access}`,
            },
          })
            .then((res) => res.json())
            .then((res) => {
              setUser({
                id: res._id,
              });
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
              Swal.fire({
                icon: "success",
                title: "Logged in successfully",
              });
              setWillRedirect(true);
            });
        } else {
          Swal.fire({
            icon: "error",
            title: "Invalid input",
          });
        }
      });
  }

  const authenticateGoogleToken = (response) => {
    console.log(response);
    const payload = {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        tokenId: response.tokenId,
      }),
    };
    fetch(
      "https://dry-caverns-57051.herokuapp.com/api/user/verify-google-id-token",
      payload
    )
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        if (typeof data.access !== "undefined") {
          localStorage.setItem("token", data.access);
          fetch("https://dry-caverns-57051.herokuapp.com/api/user/details", {
            headers: {
              Authorization: `Bearer ${data.access}`,
            },
          })
            .then((res) => {
              return res.json();
            })
            .then((res) => {
              setUser({
                id: res._id,
              });
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
              Swal.fire({
                icon: "success",
                title: "Logged in successfully",
              });
              setWillRedirect(true);
            });
        } else {
          if (data.error === "google-auth-error") {
            Swal.fire({
              icon: "error",
              title: "Google Authentication Error.",
              text:
                "Google Authentication Procedure has failed, try again or contact your web admin.",
            });
          } else if (data.error === "login-type-error") {
            Swal.fire({
              icon: "error",
              title: "Login Type Error",
              text:
                "You may have registered using a different login procedure. Try alternative login procedures.",
            });
          }
        }
      });
  };

  return willRedirect === true ? (
    <Redirect to="/records" />
  ) : (
    <>
      <section>
        <Container className="py-3">
          <Row className="justify-content-center align-items-center">
            <Col xs="10" sm="8" lg="7">
              <div className="text-white text-center text-lg-left p-lg-5">
                <h1 className="brand-name mb-4">BOOKIE</h1>
                <p className="brand-description">
                  Helps you get on top of your money. Track your{" "}
                  <span className="text-teal">expenses</span>, manage your
                  <span className="text-teal"> finances</span> , run{" "}
                  <span className="text-teal">reports</span> and more - all in
                  one place.
                </p>
              </div>
            </Col>
            <Col xs="10" sm="8" lg="4" className="offset-lg-1">
              <Card className="shadow border-0 card-container">
                <Card.Header className="bg-white">
                  <GoogleLogin
                    clientId="832716342650-4g78a8e35br96buh2h9ff53oqv9ssruv.apps.googleusercontent.com"
                    buttonText="Login using Google"
                    cookiePolicy={"single_host_origin"}
                    onSuccess={authenticateGoogleToken}
                    onFailure={authenticateGoogleToken}
                    className="w-100 text-center d-flex justify-content-center"
                  />
                </Card.Header>
                <Card.Body className="px-5 py-5 bg-grey">
                  <Form onSubmit={(e) => authenticate(e)}>
                    <Form.Group controlId="emailLogin">
                      <Form.Control
                        className="input"
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => {
                          setEmail(e.target.value);
                        }}
                      ></Form.Control>
                    </Form.Group>
                    <Form.Group controlId="passworLogin">
                      <Form.Control
                        className="input"
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => {
                          setPassword(e.target.value);
                        }}
                      ></Form.Control>
                    </Form.Group>
                    <div className="text-center">
                      <button
                        type="submit"
                        className="button blue"
                        id="loginBtn"
                      >
                        Sign In
                      </button>
                    </div>
                  </Form>
                </Card.Body>
                <Card.Footer className="bg-white py-4">
                  <div className="text-center">
                    <RegisterForm />
                  </div>
                </Card.Footer>
              </Card>
            </Col>
          </Row>
        </Container>
      </section>
    </>
  );
}
