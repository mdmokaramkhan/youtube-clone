import "./App.css";
import Layout from "./Layout";
import { Route, Routes } from "react-router-dom";
import Home from "./components/Home";
import Watch from "./components/Watch";

function App() {

  return (
    <>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/watch/:id" element={<Watch />} />
          {/* <Route path="/upload" element={ <Upload />} />
          <Route path="/profile" element={ <Profile />} />
          <Route path="/search" element={ <Search />} /> */}
        </Routes>
      </Layout>
    </>
  )
}

export default App
