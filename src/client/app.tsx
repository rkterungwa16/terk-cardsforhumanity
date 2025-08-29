import { Component, Suspense } from "react";
import { Route, HashRouter, Routes } from "react-router-dom";

class App extends Component {
  render() {
    return (
      <HashRouter basename="/">
        <Routes>
          <Route
            path="/home"
            element={
              <Suspense fallback={<>...</>}>
                <div style={{
                  width: "100%",
                  height: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "3rem",
                  fontWeight: "600"
                }}>HOME</div>
              </Suspense>
            }
          />

          <Route
            path="/dashboard"
            element={
              <Suspense fallback={<>...</>}>
                <div style={{
                  width: "100%",
                  height: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "3rem",
                  fontWeight: "600"
                }}>DASHBOARD</div>
              </Suspense>
            }
          />
          <Route
            path="/play"
            element={
              <Suspense fallback={<>...</>}>
                <div style={{
                  width: "100%",
                  height: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "3rem",
                  fontWeight: "600"
                }}>PLAY</div>
              </Suspense>
            }
          />
        </Routes>
      </HashRouter>
    );
  }
}

export default App;

