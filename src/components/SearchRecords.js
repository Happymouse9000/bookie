import { useState, useContext } from "react";
import UserContext from "../UserContext";

export default function SearchRecords() {
  const { setSearch } = useContext(UserContext);
  const [name, setName] = useState("");

  return (
    <>
      <input
        placeholder="Search..."
        id="search"
        className="input"
        type="text"
        value={name}
        onChange={(e) => {
          setName(e.target.value);
          setSearch(e.target.value);
        }}
      ></input>
    </>
  );
}
