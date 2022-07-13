import { useContext, useState } from "react";
import { Container, Col, Row, Form, Alert } from "react-bootstrap";
import UserContext from "../UserContext";
import moment from "moment";
import Swal from "sweetalert2";

export default function RecordList() {
  const {
    filter,
    search,
    deleteRecord,
    records,
    setRecords,
    categories,
    setCategories,
  } = useContext(UserContext);
  console.log(records);
  const [name, setName] = useState("");
  const [type, setType] = useState("");
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [dataId, setDataId] = useState("");

  async function removeRecord(e) {
    e.preventDefault();
    let recordId = e.currentTarget.getAttribute("data-id");

    const { value: archive } = await Swal.fire({
      title: "Type DELETE",
      input: "text",
      inputValue: "",
      showCancelButton: true,
      inputValidator: (value) => {
        if (value !== "DELETE") {
          return "You need to write DELETE!";
        }
      },
    });

    if (archive === "DELETE") {
      fetch(
        `https://dry-caverns-57051.herokuapp.com/api/user/records/${recordId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      )
        .then((res) => res.json())
        .then((res) => {
          if (res === true) {
            fetch(`https://dry-caverns-57051.herokuapp.com/api/user/details`, {
              headers: {
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
        });
    }
  }

  function reviseRecord(e) {
    e.preventDefault();
    console.log(e);
    fetch(
      `https://dry-caverns-57051.herokuapp.com/api/user/records/${dataId}`,
      {
        method: "PUT",
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
      }
    )
      .then((res) => res.json())
      .then((res) => {
        if (res === true) {
          Swal.fire({
            icon: "success",
            title: "Record Update",
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
                res.Containercategories.map((element) => {
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
      });
  }

  function getBudgetAtIndex(index) {
    let incomeAtIndex = 0;
    let expenseAtIndex = 0;
    let budgetAtIndex = 0;
    for (let i = 0; i < index; i++) {
      if (records[i].type === "Expense") {
        expenseAtIndex += records[i].amount;
      }
      if (records[i].type === "Income") {
        incomeAtIndex += records[i].amount;
      }
    }
    console.log(incomeAtIndex);
    console.log(expenseAtIndex);
    budgetAtIndex = incomeAtIndex - expenseAtIndex;
    return budgetAtIndex;
  }

  return (
    <section>
      <Container>
        {deleteRecord && records.length !== 0 ? (
          <Alert variant="info" className="alert alert-show">
            <Alert.Heading>Select item/items you want to delete.</Alert.Heading>
          </Alert>
        ) : null}
        {records.length === 0 ? (
          <Alert variant="info" className="alert alert-show">
            <Alert.Heading>
              No records found. Click Add to create a record.
            </Alert.Heading>
          </Alert>
        ) : null}

        {records
          .map((item) => item)
          .reverse()
          .filter((element) => {
            if (filter === "Expense") return element.type === "Expense";
            if (filter === "Income") return element.type === "Income";
            return element;
          })
          .filter((element) => {
            if (search !== "")
              return element.name.toLowerCase().includes(search.toLowerCase());
            return element;
          })
          .map((element) => {
            return (
              <Row
                key={element._id}
                className={
                  deleteRecord
                    ? "record-box-delete my-4 shadow-sm"
                    : "record-box my-4 shadow-sm"
                }
                onClick={deleteRecord ? (e) => removeRecord(e) : null}
                data-id={element._id}
              >
                <Col>
                  <Row>
                    <h5>{element.name}</h5>
                    {element.type === "Expense" ? (
                      <span className="ml-auto box-header-expense">
                        {element.type}
                      </span>
                    ) : null}
                    {element.type === "Income" ? (
                      <span className="ml-auto box-header-income">
                        {element.type}
                      </span>
                    ) : null}
                  </Row>
                  <Row>
                    <p>
                      {moment(element.addedOn).format("MMMM Do YY, h:mm a")}
                    </p>
                    <span
                      className={
                        element.type === "Expense"
                          ? "text-danger ml-auto my-3"
                          : "text-success ml-auto my-3"
                      }
                    >
                      <span>{element.type === "Expense" ? "- " : "+ "}</span>
                      {element.amount}
                    </span>
                  </Row>
                  <Row>
                    <button
                      data-id={element._id}
                      className="button blue"
                      onClick={(e) => {
                        setDataId(e.target.getAttribute("data-id"));
                        handleShow();
                      }}
                    >
                      Update
                    </button>
                    <span className="ml-auto font-weight-bold text-muted">
                      Total:{" "}
                      {element.type === "Income"
                        ? getBudgetAtIndex(records.indexOf(element)) +
                          element.amount
                        : getBudgetAtIndex(records.indexOf(element)) -
                          element.amount}
                    </span>
                  </Row>
                </Col>
              </Row>
            );
          })}
      </Container>
      <div
        id="reviseRecordModal"
        className={show ? "modal modal-show" : "modal"}
      >
        <div className="modal-content bg-grey">
          <Form onSubmit={(e) => reviseRecord(e)}>
            <Row className="modal-body py-4 px-5">
              <Container>
                <Row>
                  <Col>
                    <h5 className="modal-title mb-4 text-muted">
                      Update Record
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
                    <option value="" selected disabled>
                      Category name
                    </option>
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
                      Update
                    </button>
                  </Col>
                </Row>
              </Container>
            </Row>
          </Form>
        </div>
      </div>
    </section>
  );
}
