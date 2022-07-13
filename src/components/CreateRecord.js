import { useState, useContext } from "react";
import { Form, Container, Col, Row } from "react-bootstrap";
import Swal from "sweetalert2";
import UserContext from "../UserContext";

export default function CreateRecord() {
  const { categories, setRecords, setCategories } = useContext(UserContext);

  const [name, setName] = useState("");
  const [type, setType] = useState("");
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  function saveRecord(e) {
    console.log(type);
    e.preventDefault();
    fetch(`https://dry-caverns-57051.herokuapp.com/api/user/records`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({
        name: name,
        type: type,
        description: description,
        amount: amount,
      }),
    })
      .then((res) => res.json())
      .then((res) => {
        if (res === true) {
          Swal.fire({
            icon: "success",
            title: "Record Created",
          });
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
        } else
          return Swal.fire({
            icon: "error",
            title: "Unable to Create Record",
          });
      });
  }

  return (
    <>
      <button className="button" onClick={handleShow} id="addRecordBtn">
        Add
      </button>

      <div
        id="createRecordModal"
        className={show ? "modal modal-show" : "modal"}
      >
        <div className="modal-content bg-grey">
          <Form onSubmit={(e) => saveRecord(e)}>
            <Row className="modal-body py-4 px-5">
              <Container>
                <Row className="">
                  <Col>
                    <h5 className="modal-title mb-4 text-muted">
                      Add Income or Expense Record
                    </h5>
                  </Col>
                </Row>

                <Form.Group controlId="type">
                  <Form.Control
                    className="select"
                    required
                    as="select"
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                  >
                    <option value="Expense">Expense</option>
                    <option value="Income">Income</option>
                  </Form.Control>
                </Form.Group>
                <Form.Group controlId="name">
                  <Form.Control
                    required
                    className="select"
                    as="select"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  >
                    <option value="">Category name</option>
                    {type === "Expense"
                      ? categories
                          .filter((element) => element.type === "Expense")
                          .map((element) => (
                            <option key={element._id}>{element.name}</option>
                          ))
                      : null}
                    {type === "Income"
                      ? categories
                          .filter((element) => element.type === "Income")
                          .map((element) => (
                            <option key={element._id}>{element.name}</option>
                          ))
                      : null}
                  </Form.Control>
                </Form.Group>
                <Form.Group controlId="description">
                  <Form.Control
                    className="input"
                    type="text"
                    placeholder="Description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  ></Form.Control>
                </Form.Group>
                <Form.Group controlId="amount">
                  <Form.Control
                    className="input"
                    required
                    type="number"
                    placeholder="Amount"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                  ></Form.Control>
                </Form.Group>
                <Row>
                  <Col className="d-flex justify-content-end">
                    <div className="button gray ml-auto" onClick={handleClose}>
                      Close
                    </div>
                    <button className="button ml-4 mr-0" type="submit">
                      Create Record
                    </button>
                  </Col>
                </Row>
              </Container>
            </Row>
          </Form>
        </div>
      </div>
    </>
  );
}
