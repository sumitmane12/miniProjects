import { BrowserRouter, Routes, Route } from "react-router-dom";
import Todo from "./components/Todo";

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen">
        <Routes>
          <Route path="/" element={<Todo />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
