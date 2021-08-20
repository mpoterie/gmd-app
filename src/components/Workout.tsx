import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getWorkout } from "../services/WorkoutService";
import { useHistory } from "react-router-dom";

export const categories = ["c1", "c2", "c3", "c4", "c5", "c6", "c7"] as const;

type Category = typeof categories;
export interface Workout {
  id: string;
  name: string;
  description: string;
  startDate: Date;
  category: Category;
  img: string;
}
export interface WorkoutRouteParams {
  id: string;
}

export const Workout = () => {
  const history = useHistory();
  const historyState = history.location.state as { from: string };

  const { id } = useParams<WorkoutRouteParams>();
  const [workout, setWorkout] = useState<Workout | undefined>(undefined);

  const fetchWorkout = React.useCallback(() => {
    getWorkout(id).then((result) => {
      setWorkout(result[0]);
    });
  }, [id]);

  useEffect(() => fetchWorkout(), [fetchWorkout]);

  return (
    <div className="container">
      {historyState ? historyState.from : null}
      <div onClick={() => history.push(historyState.from)}>
        Come back to the Workouts list
      </div>
      {workout ? <> {workout.description}</> : "null"}
    </div>
  );
};
