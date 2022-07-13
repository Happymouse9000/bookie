import { useState, useContext } from "react";
import UserContext from "../UserContext";

export default function FilterRecords() {
  const { setFilter } = useContext(UserContext);
  const [type2, setType2] = useState("");
  return (
    <>
      <select
        className="select text-muted"
        id="filter"
        value={type2}
        onChange={(e) => {
          setType2(e.target.value);
          setFilter(e.target.value);
        }}
      >
        <option value="None" className="text-muted">
          Filter by type
        </option>
        <option value="Expense">Expense</option>
        <option value="Income">Income</option>
      </select>
    </>
  );
}
