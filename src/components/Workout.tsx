import React, { useEffect, useState, useCallback } from "react";
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

  const fetchWorkout = useCallback(() => {
    getWorkout(id).then((result) => {
      setWorkout(result[0]);
    });
  }, [id]);

  // Fetching the data initally
  useEffect(() => fetchWorkout(), [fetchWorkout]);

  return (
    <div className="container">
      <div
        className="previous-page"
        onClick={() => history.push(historyState.from ?? "/")}
      >
        <PreviousIcon /> <span>Come back to the Workouts list</span>
      </div>
      {workout ? (
        <>
          <h3>{workout.name}t</h3>
          <img className="workout-image" src={workout.img} alt={workout.name} />
          <div className="workout-infos">
            <div className="description">
              <h5>Description</h5> {workout.description}
            </div>
            <div className="category">
              <h5>Category</h5> {workout.category}
            </div>
            <div className="date">
              <h5>Date</h5>
              <p>
                {new Date(workout.startDate).toLocaleDateString("en-US", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                  hour: "numeric",
                  minute: "numeric",
                })}
              </p>
            </div>
          </div>
        </>
      ) : (
        "This workout doesn't exist"
      )}
    </div>
  );
};

function PreviousIcon(
  props: JSX.IntrinsicAttributes & React.SVGProps<SVGSVGElement>
) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={24}
      height={24}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="prefix__feather prefix__feather-arrow-left"
      {...props}
    >
      <path d="M19 12H5M12 19l-7-7 7-7" />
    </svg>
  );
}
