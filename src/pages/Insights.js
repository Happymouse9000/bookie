import { useEffect, useState, useContext } from "react";
import moment from "moment";
import { Tabs, Tab, Container, Row, Col, Card } from "react-bootstrap";
import BarChart from "../components/BarChart";
import LineGraph from "../components/LineGraph";
import PieChart from "../components/PieChart";
import UserContext from "../UserContext";
import MainNav from "../components/MainNav";
import DatePicker from "react-datepicker";

export default function Insights() {
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(
    new Date(new Date().getTime() + 30 * 24 * 60 * 60 * 1000)
  );

  const { records } = useContext(UserContext);
  const [budget, setBudget] = useState([]);
  const [expense, setExpense] = useState([]);
  const [income, setIncome] = useState([]);

  const StartDateCustomInput = ({ value, onClick }) => (
    <button className="button" onClick={onClick}>
      Start Date: {value}
    </button>
  );
  const EndDateCustomInput = ({ value, onClick }) => (
    <button className="button" onClick={onClick}>
      End Date: {value}
    </button>
  );

  useEffect(() => {
    setBudget([]);
    let budgetTemp = [];
    let incomeAtIndex = 0;
    let expenseAtIndex = 0;
    let budgetAtIndex = 0;
    for (let i = 0; i <= records.length - 1; i++) {
      if (
        records[i].type === "Expense" &&
        moment(records[i].addedOn).valueOf() >= moment(startDate).valueOf() &&
        moment(records[i].addedOn).valueOf() <= moment(endDate).valueOf()
      ) {
        expenseAtIndex += records[i].amount;
      }
      if (
        records[i].type === "Income" &&
        moment(records[i].addedOn).valueOf() >= moment(startDate).valueOf() &&
        moment(records[i].addedOn).valueOf() <= moment(endDate).valueOf()
      ) {
        incomeAtIndex += records[i].amount;
      }
      budgetAtIndex = incomeAtIndex - expenseAtIndex;
      budgetTemp.push(budgetAtIndex);
    }

    console.log(budgetTemp);
    setBudget(budgetTemp);
  }, [startDate, endDate, records]);

  console.log(budget);

  useEffect(() => {
    let monthlyExpense = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    let monthlyIncome = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    records
      .filter((element) => element.type === "Expense")
      .forEach((element) => {
        const index = moment(element.addedOn).month();
        monthlyExpense[index] += element.amount;
      });
    records
      .filter((element) => element.type === "Income")
      .forEach((element) => {
        const index = moment(element.addedOn).month();
        monthlyIncome[index] += element.amount;
      });
    setExpense(monthlyExpense);
    setIncome(monthlyIncome);
  }, [records]);

  // useEffect(() => {
  //   const name = records.map((record) => {
  //     return record.amount;
  //   });
  // }, [records]);

  return (
    <>
      <MainNav />
      <section className="background-img page-section">
        <Container className="pt-lg-7">
          <Row className="d-flex flex-wrap justify-content-center align-items-center">
            <Col lg={12} className="m-5">
              <Card className="bg-white shadow border-0 card-container">
                <Card.Body className="px-lg-5 py-lg-5">
                  <Tabs defaultActiveKey="expense" id="monthlyFigures">
                    <Tab
                      eventKey="expense"
                      title="Monthly Expenditures"
                      className="pt-5"
                    >
                      <BarChart
                        figuresArray={expense}
                        label="Monthly Total Expenditures"
                        color="rgb(219, 66, 102,0.7)"
                        colorHover="rgb(219, 66, 102,0.9)"
                      />
                    </Tab>
                    <Tab
                      eventKey="income"
                      title="Monthly Income"
                      className="pt-5"
                    >
                      <BarChart
                        figuresArray={income}
                        label="Monthly Total Income"
                        color="rgb(42, 201, 101,0.7)"
                        colorHover="rgb(42, 201, 101,0.9)"
                      />
                    </Tab>
                    <Tab
                      eventKey="budget"
                      title="Budget Trend"
                      className="pt-5"
                    >
                      <Container className="mb-5 text-center">
                        <Row>
                          <Col xs={6} lg={4} className="offset-lg-2">
                            <DatePicker
                              selected={startDate}
                              onChange={(date) => setStartDate(date)}
                              customInput={<StartDateCustomInput />}
                            />
                          </Col>
                          <Col xs={6} lg={4}>
                            <DatePicker
                              selected={endDate}
                              onChange={(date) => setEndDate(date)}
                              customInput={<EndDateCustomInput />}
                            />
                          </Col>
                        </Row>
                      </Container>
                      <LineGraph figuresArray={budget} label="Budget Trend" />
                    </Tab>
                    <Tab
                      eventKey="breakdown"
                      title="Category Breakdown"
                      className="pt-5"
                    >
                      <Container className="mb-5 text-center">
                        <Row>
                          <Col xs={6} lg={4} className="offset-lg-2">
                            <DatePicker
                              selected={startDate}
                              onChange={(date) => setStartDate(date)}
                              customInput={<StartDateCustomInput />}
                            />
                          </Col>
                          <Col xs={6} lg={4}>
                            <DatePicker
                              selected={endDate}
                              onChange={(date) => setEndDate(date)}
                              customInput={<EndDateCustomInput />}
                            />
                          </Col>
                        </Row>
                      </Container>
                      <PieChart
                        figuresArray={records
                          .filter((record) => {
                            return (
                              moment(records.addedOn).valueOf() >=
                              moment(startDate).valueOf()
                            );
                          })
                          .filter((record) => {
                            return (
                              moment(records.addedOn).valueOf() <=
                              moment(endDate).valueOf()
                            );
                          })
                          .map((record) => {
                            return record.amount;
                          })}
                        label="Category Breakdown"
                        namesArray={records
                          .filter((record) => {
                            return (
                              moment(records.addedOn).valueOf() >=
                              moment(startDate).valueOf()
                            );
                          })
                          .filter((record) => {
                            return (
                              moment(records.addedOn).valueOf() <=
                              moment(endDate).valueOf()
                            );
                          })
                          .map((record) => {
                            return record.name;
                          })}
                      />
                    </Tab>
                  </Tabs>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </section>

      {/* <section className="background-img page-section p-5">
        <Tabs defaultActiveKey="expense" id="monthlyFigures">
          <Tab eventKey="expense" title="Monthly Expenditures">
            <BarChart
              figuresArray={expense}
              label="Monthly Total Expenditures"
              color="rgb(219, 66, 102,0.7)"
              colorHover="rgb(219, 66, 102,0.9)"
            />
          </Tab>
          <Tab eventKey="income" title="Monthly Income">
            <BarChart
              figuresArray={income}
              label="Monthly Total Income"
              color="rgb(42, 201, 101,0.7)"
              colorHover="rgb(42, 201, 101,0.9)"
            />
          </Tab>
          <Tab eventKey="budget" title="Budget Trend">
            <DatePicker
              selected={startDate}
              onChange={(date) => setStartDate(date)}
              customInput={<ExampleCustomInput />}
            />
            <DatePicker
              selected={endDate}
              onChange={(date) => setEndDate(date)}
              customInput={<ExampleCustomInput />}
            />
            <LineGraph figuresArray={budget} label="Budget Trend" />
          </Tab>
          <Tab eventKey="breakdown" title="Category Breakdown">
            <DatePicker
              selected={startDate}
              onChange={(date) => setStartDate(date)}
              customInput={<ExampleCustomInput />}
            />
            <DatePicker
              selected={endDate}
              onChange={(date) => setEndDate(date)}
              customInput={<ExampleCustomInput />}
            />
            <PieChart
              figuresArray={records
                .filter((record) => {
                  return (
                    moment(records.addedOn).valueOf() >=
                    moment(startDate).valueOf()
                  );
                })
                .filter((record) => {
                  return (
                    moment(records.addedOn).valueOf() <=
                    moment(endDate).valueOf()
                  );
                })
                .map((record) => {
                  return record.amount;
                })}
              label="Category Breakdown"
              namesArray={records
                .filter((record) => {
                  return (
                    moment(records.addedOn).valueOf() >=
                    moment(startDate).valueOf()
                  );
                })
                .filter((record) => {
                  return (
                    moment(records.addedOn).valueOf() <=
                    moment(endDate).valueOf()
                  );
                })
                .map((record) => {
                  return record.name;
                })}
            />
          </Tab>
        </Tabs>
      </section> */}
    </>
  );
}
