import { useContext } from "react";

import UserContext from "../UserContext";

export default function DeleteRecord() {
  const { deleteRecord, setDeleteRecord } = useContext(UserContext);

  function deleteRecordToggle(e) {
    if (deleteRecord === false) setDeleteRecord(true);
    else setDeleteRecord(false);
  }

  return (
    <>
      <button
        className="button red"
        onClick={(e) => {
          deleteRecordToggle(e);
        }}
        id="deleteRecordBtn"
      >
        Delete
      </button>
    </>
  );
}
