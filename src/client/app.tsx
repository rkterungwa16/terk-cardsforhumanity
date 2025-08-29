import { Component, Suspense } from "react";
import { Route, BrowserRouter, Routes } from "react-router-dom";

class App extends Component {
  render() {
    return (
      <BrowserRouter basename="/">
        <Routes>
          <Route
            path="/"
            element={
              <Suspense fallback={<>...</>}>
                <div></div>
              </Suspense>
            }
          />
        </Routes>
      </BrowserRouter>
    );
  }
}

export default App;

