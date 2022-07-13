import { useState, useContext } from "react";
import { Form, Container, Col, Row, Card, Alert } from "react-bootstrap";
import UserContext from "../UserContext";
import Swal from "sweetalert2";

export default function CreateCategory() {
  const { categories, setCategories } = useContext(UserContext);
  const [type, setType] = useState("");
  const [name, setName] = useState("");
  const [dataId, setDataId] = useState("");

  const [type2, setType2] = useState("");
  const [name2, setName2] = useState("");
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  function reviseCategory(e) {
    e.preventDefault();
    if (name2 !== "" && type2 !== "") {
      fetch(
        `https://dry-caverns-57051.herokuapp.com/api/user/categories/${dataId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({
            name: name2,
            type: type2,
          }),
        }
      )
        .then((res) => res.json())
        .then((res) => {
          if (res === true) {
            Swal.fire({
              icon: "success",
              title: "Category Updated",
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
              });
          }
        });
    }
  }

  function saveCategory(e) {
    e.preventDefault();
    fetch(`https://dry-caverns-57051.herokuapp.com/api/user/categories`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({
        name: name,
        type: type,
      }),
    })
      .then((res) => res.json())
      .then((res) => {
        if (res === true) {
          Swal.fire({
            icon: "success",
            title: "Category Created",
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
            });
        }
      });
  }

  async function deleteCategory(e) {
    let categorydId = e.target.getAttribute("data-id");
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
        `https://dry-caverns-57051.herokuapp.com/api/user/categories/${categorydId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      )
        .then((res) => res.json())
        .then((res) => {
          if (res === true) {
            Swal.fire({
              icon: "success",
              title: "Delete Successful",
            });
            fetch(`https://dry-caverns-57051.herokuapp.com/api/user/details`, {
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            })
              .then((res) => res.json())
              .then((res) => {
                if (res) {
                  setCategories(
                    res.categories.map((element) => {
                      return element;
                    })
                  );
                }
              });
          }
        });
    }
  }

  return (
    <>
      <section>
        <Container className="pt-lg-7">
          <Row className="justify-content-center">
            <Col lg="8">
              <Card className="shadow border-0 card-container ">
                <Card.Header className="px-lg-5 py-lg-5 bg-white">
                  <div className="text-muted text-center mb-3">
                    <h6>Create category</h6>
                  </div>
                  <Form onSubmit={(e) => saveCategory(e)}>
                    <Form.Group controlId="type">
                      <Form.Control
                        className="input"
                        as="select"
                        value={type}
                        onChange={(e) => setType(e.target.value)}
                      >
                        <option>Expense</option>
                        <option>Income</option>
                      </Form.Control>
                    </Form.Group>
                    <Form.Group controlId="name">
                      <Form.Control
                        className="input"
                        type="text"
                        placeholder="Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                      ></Form.Control>
                    </Form.Group>
                    <div className="text-right">
                      <button className="button" type="submit">
                        Create Category
                      </button>
                    </div>
                  </Form>
                </Card.Header>
                <Card.Footer className="">
                  <div className="text-muted text-center my-3">
                    <h6>Categories</h6>
                  </div>

                  <Container className="text-center">
                    {categories.length > 0 ? (
                      categories.map((category) => {
                        return (
                          <Row key={category._id} className="categories-box">
                            <Col xs={8} md={6} lg={3} className="mb-2">
                              <div data-id={category._id} key={category._id}>
                                {category.name}
                              </div>
                            </Col>
                            <Col xs={8} md={6} lg={3} className="mb-2">
                              <div data-id={category._id} key={category._id}>
                                {category.type}
                              </div>
                            </Col>
                            <Col xs={8} md={6} lg={3} className="mb-2">
                              <div
                                data-id={category._id}
                                className="button blue py-1 px-3"
                                onClick={(e) => {
                                  setDataId(e.target.getAttribute("data-id"));
                                  handleShow();
                                  console.log(dataId);
                                }}
                              >
                                Update
                              </div>
                            </Col>
                            <Col xs={8} md={6} lg={3} className="mb-2">
                              <div
                                data-id={category._id}
                                className="button red py-1 px-3"
                                onClick={(e) => {
                                  deleteCategory(e);
                                }}
                              >
                                Delete
                              </div>
                            </Col>
                          </Row>
                        );
                      })
                    ) : (
                      <Alert variant="info" className="alert alert-show">
                        <p>No Categories Available.</p>
                      </Alert>
                    )}
                  </Container>
                </Card.Footer>
              </Card>
            </Col>
          </Row>
        </Container>

        <div
          id="updateCategoryModal"
          className={show ? "modal modal-show" : "modal"}
        >
          <div className="modal-content bg-grey">
            <Form onSubmit={(e) => reviseCategory(e)}>
              <Row className="modal-body py-4 px-5">
                <Container>
                  <Row className="">
                    <Col>
                      <h5 className="modal-title mb-4 text-muted">
                        Edit Category
                      </h5>
                    </Col>
                  </Row>

                  <Form.Group controlId="type">
                    <Form.Control
                      required
                      className="select"
                      as="select"
                      value={type2}
                      onChange={(e) => setType2(e.target.value)}
                    >
                      <option value="Expense">Expense</option>
                      <option value="Income">Income</option>
                    </Form.Control>
                  </Form.Group>

                  <Form.Group controlId="name">
                    <Form.Control
                      required
                      className="input"
                      type="text"
                      placeholder="Name"
                      value={name2}
                      onChange={(e) => setName2(e.target.value)}
                    ></Form.Control>
                  </Form.Group>
                  <Row>
                    <Col className="d-flex justify-content-end">
                      <div
                        className="button gray ml-auto"
                        onClick={handleClose}
                      >
                        Close
                      </div>
                      <button className="button ml-4 mr-0" type="submit">
                        Edit Category
                      </button>
                    </Col>
                  </Row>
                </Container>
              </Row>
            </Form>
          </div>
        </div>
      </section>
    </>
  );
}
