import { useState } from "react";

export default function useFields() {
  const [fields, setFields] = useState([]);

  return {
    fields,
    setFields,
  };
}
