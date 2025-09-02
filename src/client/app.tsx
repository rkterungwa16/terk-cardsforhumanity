import { Component, Suspense } from "react";
import { Route, Routes } from "react-router-dom";

const HomePage = () => (
  <div
    style={{
      width: "100%",
      height: "100%",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: "3rem",
      fontWeight: "600",
    }}
  >
    HOME
  </div>
);

const DashboardPage = () => (
  <div
    style={{
      width: "100%",
      height: "100%",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: "3rem",
      fontWeight: "600",
    }}
  >
    DASHBOARD
  </div>
);

const PlayPage = () => (
  <div
    style={{
      width: "100%",
      height: "100%",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: "3rem",
      fontWeight: "600",
    }}
  >
    PLAY
  </div>
);

class App extends Component {
  render() {
    return (
      <Routes>
        <Route
          path="/"
          element={
            <Suspense fallback={<div>Loading...</div>}>
              <HomePage />
            </Suspense>
          }
        />
        <Route
          path="dashboard"
          element={
            <Suspense fallback={<div>Loading...</div>}>
              <DashboardPage />
            </Suspense>
          }
        />
        <Route
          path="play"
          element={
            <Suspense fallback={<div>Loading...</div>}>
              <PlayPage />
            </Suspense>
          }
        />
      </Routes>
    );
  }
}

export default App;
