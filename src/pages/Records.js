import RecordList from "../components/RecordList";
import CreateRecord from "../components/CreateRecord";
import DeleteRecord from "../components/DeleteRecord";
import FilterRecords from "../components/FilterRecords";
import SearchRecords from "../components/SearchRecords";
import { Row, Col, Container, Card } from "react-bootstrap";

import MainNav from "../components/MainNav";

export default function Records() {
  return (
    <>
      <MainNav />
      <section className=" background-img-fixed page-section py-5">
        <h1 className="text-white text-center">Income - Expense Records</h1>
        <p className="lead text-white text-center">
          See all of your bills and money at a glance
        </p>
        <Container className="pt-lg-3">
          <Row>
            <Col xs={6} md={2} className="mb-4">
              <CreateRecord />
            </Col>
            <Col xs={6} md={2} className="mb-4">
              <DeleteRecord />
            </Col>
            <Col xs={6} md={4} className="mb-4">
              <FilterRecords />
            </Col>
            <Col xs={6} md={4} className="mb-4">
              <SearchRecords />
            </Col>
          </Row>
          <Row>
            <Col>
              <Card className="bg-white shadow border-0 card-container ">
                <Card.Body className="px-lg-5 py-lg-5">
                  <RecordList />
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </section>
    </>
  );
}
