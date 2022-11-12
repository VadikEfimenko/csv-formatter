import './App.css';
import React from "react";
import { MatchingTable } from "./components/MatchingTable";
import { Button,  } from '@chakra-ui/react'

function App() {
  const [file, setFile] = React.useState();
  const [columnsOfUploadedFile, setColumnsOfUploadedFile] = React.useState([]);

  const handleOnChange = React.useCallback((e) => {
    setColumnsOfUploadedFile([]);
    setFile(e.target.files[0]);
  });

  const handleOnSubmit = React.useCallback((e) => {
    e.preventDefault();

    if (file) {
      const formData = new FormData();

      formData.append('name', "file");
      formData.append('file', file);

      const url = 'http://localhost:4002/uploadCSV';

      fetch(url, {
        method: 'POST',
        body: formData,
      })
        .then((data) => data.json())
        .then((result) => {
          setColumnsOfUploadedFile(result.csvColumns);
      });
    }
  });

  return (
    <div className="App">
      <div className="title">Матчинг заголовков перед загрузкой .csv в базу</div>

      <div className="subtitle">Шаг 1: Загрузка файла</div>
      <form>
        <input
            type="file"
            id="csvFileInput"
            accept=".csv"
            name="file"
            onChange={handleOnChange}
        />

        <Button
          onClick={handleOnSubmit}
          size='md'
          colorScheme='teal'
          variant='outline'
        >
          IMPORT CSV
        </Button>
      </form>

      {columnsOfUploadedFile?.length > 0 && (
        <div className="step">
            <div className="subtitle">Шаг 2: Сопоставить заголовки с колонками БД</div>
            <MatchingTable
                columnsNames={columnsOfUploadedFile}
            />
        </div>
      )}
    </div>
  );
}

export default App;
