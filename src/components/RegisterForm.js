import { useState, useEffect } from "react";

import { Form, Col, Row, Container } from "react-bootstrap";
import Swal from "sweetalert2";

export default function RegisterForm() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [mobileNo, setMobileNo] = useState("");
  const [isActive, setIsActive] = useState(false);
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  useEffect(() => {
    if (
      firstName !== "" &&
      lastName !== "" &&
      email !== "" &&
      password !== "" &&
      password2 !== "" &&
      mobileNo !== "" &&
      password2 === password
    ) {
      setIsActive(true);
    } else {
      setIsActive(false);
    }
  }, [email, password, password2, mobileNo, firstName, lastName]);

  function registerUser(e) {
    e.preventDefault();
    console.log(e);
    fetch(`https://dry-caverns-57051.herokuapp.com/api/user/email-exists`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email: email }),
    })
      .then((res) => res.json())
      .then((res) => {
        console.log(res);
        if (res === false) {
          fetch(`https://dry-caverns-57051.herokuapp.com/api/user/`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              firstName: firstName,
              lastName: lastName,
              email: email,
              password: password,
              mobileNo: mobileNo,
            }),
          })
            .then((res) => res.json())
            .then((res) => {
              if (res === true) {
                Swal.fire({
                  icon: "success",
                  title: "Registration Successful",
                });
              } else {
                Swal.fire({
                  icon: "error",
                  title: "Registration Failed",
                });
              }
            });
        } else {
          Swal.fire({
            icon: "error",
            title: "Email Already Exists",
          });
        }
      });

    setFirstName("");
    setLastName("");
    setEmail("");
    setPassword("");
    setPassword2("");
    setMobileNo("");
  }

  return (
    <>
      <button
        type="submit"
        className="button"
        onClick={(e) => {
          handleShow();
        }}
      >
        Create Account
      </button>

      <div className={show ? "modal modal-show" : "modal"}>
        <div className="modal-content bg-grey">
          <Form onSubmit={(e) => registerUser(e)}>
            <Row className="modal-body py-4 px-5">
              <Container>
                <Row>
                  <Col>
                    <h5 className="modal-title mb-4 text-muted">
                      Create an Account
                    </h5>
                  </Col>
                </Row>
                <Row>
                  <Col xs={12} lg={6}>
                    <Form.Group controlId="firstName">
                      <Form.Control
                        className="input"
                        type="text"
                        placeholder="First name"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        required
                      />
                    </Form.Group>
                  </Col>
                  <Col xs={12} lg={6}>
                    <Form.Group controlId="lastName">
                      <Form.Control
                        className="input"
                        type="text"
                        placeholder="Last name"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        required
                      />
                    </Form.Group>
                  </Col>
                </Row>
                <Row>
                  <Col xs={12}>
                    <Form.Group controlId="email">
                      <Form.Control
                        className="input"
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </Form.Group>
                  </Col>
                </Row>
                <Row>
                  <Col xs={12}>
                    <Form.Group controlId="password">
                      <Form.Control
                        className="input"
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                    </Form.Group>
                  </Col>
                  <Col xs={12}>
                    <Form.Group controlId="password2">
                      <Form.Control
                        className="input"
                        type="password"
                        placeholder="Verify Password"
                        value={password2}
                        onChange={(e) => setPassword2(e.target.value)}
                        required
                      />
                    </Form.Group>
                  </Col>
                </Row>
                <Row>
                  <Col xs={12}>
                    <Form.Group controlId="mobileNo">
                      <Form.Control
                        className="input"
                        type="number"
                        placeholder="Mobile number"
                        value={mobileNo}
                        onChange={(e) => setMobileNo(e.target.value)}
                        required
                      />
                    </Form.Group>
                  </Col>
                </Row>
                {isActive ? (
                  <button className="button" type="submit">
                    Submit
                  </button>
                ) : (
                  <button className="button" type="submit" disabled>
                    Submit
                  </button>
                )}
                <button
                  className="button gray ml-4"
                  type="reset"
                  onClick={handleClose}
                >
                  Close
                </button>
              </Container>
            </Row>
          </Form>
        </div>
      </div>
    </>
  );
}
