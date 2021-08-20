import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import { Header } from "./components/Header";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { QueryParamProvider } from "use-query-params";
import { Workouts } from "./components/Workouts";
import { Workout } from "./components/Workout";

export default function App() {
  return (
    <div className="App">
      <Header />
      <Router>
        <QueryParamProvider ReactRouterRoute={Route}>
          <Switch>
            <Route exact path="/" component={Workouts} />
            <Route path="/:id" component={Workout} />
          </Switch>
        </QueryParamProvider>
      </Router>
    </div>
  );
}
