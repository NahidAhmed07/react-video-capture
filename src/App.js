/* eslint-disable react-hooks/exhaustive-deps */
import React, { useCallback, useRef } from "react";
import styled from "styled-components";

import * as PDFJS from "pdfjs-dist/build/pdf";
import * as pdfjsWorker from "pdfjs-dist/build/pdf.worker.entry";
import { getPDFDoc, processForDatabase } from "./lib/processPdf";
import DataTable from "react-data-table-component";

window.PDFJS = PDFJS;

export default function App() {
  PDFJS.GlobalWorkerOptions.workerSrc = pdfjsWorker;

  const [pdfDoc, setPdfDoc] = React.useState([]);
  const [startPage, setStartPage] = React.useState(1);
  const [endPage, setEndPage] = React.useState(10);
  const [all, setAll] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  const fileInputRef = useRef(null);

  const handleSubmitClick = useCallback(async () => {
    const file = fileInputRef.current.files[0];

    if (file) {
      setLoading(true);
      const fileReader = new FileReader();

      fileReader.readAsDataURL(file);
      fileReader.onload = async () => {
        const result = await getPDFDoc(fileReader.result, {
          startPage,
          endPage,
          all,
        });

        if (result.length > 0) {
          const allResults = processForDatabase(result);

          setPdfDoc(allResults);
        }
      };
    } else {
      alert("please upload a pdf file");
      return;
    }

    setLoading(false);
  }, []);

  const columns = [
    {
      name: "Roll",
      selector: (row) => row.roll,
    },
    {
      name: "CGPA",
      selector: (row) => row.cgpa,
    },
    {
      name: "Failed Subjects",
      selector: (row) => {
        return row.fail_subjects ? JSON.stringify(row.fail_subjects) : "N/A";
      },
      width: "400px",
    },
  ];

  console.log(pdfDoc);

  return (
    <Wrapper>
      <div>
        <h1>Check Result </h1>

        <div className="form-container">
          <div className="input-ct">
            <label htmlFor="file">Select PDF File</label>
            <input
              ref={fileInputRef}
              type="file"
              id="file"
              name="file"
              accept="application/pdf"
            />
          </div>
          <div className="input-ct">
            <label htmlFor="file">Start Page</label>
            <input
              type="text"
              id="start"
              name="start"
              onChange={(e) => setStartPage(e.target.value)}
            />
          </div>
          <div className="input-ct">
            <label htmlFor="file">End Page</label>
            <input
              type="text"
              id="end"
              name="end"
              onChange={(e) => setEndPage(e.target.value)}
            />
          </div>

          <div className="checkbox">
            <label htmlFor="all">Get All Data</label>
            <input
              type="checkbox"
              id="all"
              name="all"
              value="all"
              onChange={(e) => setAll(e.target.checked)}
            />
          </div>

          <div className="btn-ct">
            <button onClick={handleSubmitClick} type="submit">
              Submit
            </button>
          </div>
        </div>

        <div className="result">
          {loading && <h5>Loading...</h5>}

          <DataTable
            title="Result"
            style={{ border: "1px solid #ccc" }}
            columns={columns}
            data={pdfDoc}
            pagination
          />
        </div>
      </div>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  background: "aqua";
  display: flex;
  justify-content: center;

  h1 {
    text-align: center;
  }

  .checkbox {
    margin-bottom: 20px;
  }

  .form-container {
    width: 500px;
    border: 1px solid #ccc;
    padding: 20px;
    margin-top: 20px;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }

  .btn-ct {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .result {
    margin-top: 50px;
  }

  .input-ct {
    margin-bottom: 20px;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;

    label {
      width: 30%;
      font-weight: bold;
    }

    input {
      width: 70%;
      padding: 10px;
      border: 1px solid #ccc;
    }
  }
`;
