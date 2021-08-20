import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { getWorkouts } from "..//services/WorkoutService";
import ReactPaginate from "react-paginate";
import { Workout } from "./Workout";
import { useHistory } from "react-router-dom";
import { NumberParam, withDefault, useQueryParams } from "use-query-params";

const RESULTS_PER_PAGE = 20;

export const Workouts = () => {
  const [query, setQuery] = useQueryParams({
    pageCount: NumberParam,
    offset: withDefault(NumberParam, 1),
  });
  console.log({ query, setQuery });

  let history = useHistory();
  const [workouts, setWorkouts] = useState<Workout[]>([]);

  const fetchWorkouts = React.useCallback(() => {
    getWorkouts(query.offset, RESULTS_PER_PAGE).then((result) => {
      setWorkouts(result.data);
      setQuery((latest) => {
        return { ...latest, pageCount: result.pageCount };
      });
    });
  }, [query.offset, setQuery]);

  useEffect(() => fetchWorkouts(), [query.offset, fetchWorkouts]);

  const handlePageClick = ({ selected }: { selected: number }) => {
    let newOffset = Math.ceil(selected * RESULTS_PER_PAGE);
    setQuery((latest) => ({ ...latest, offset: newOffset }));
  };

  return (
    <div className="container mrgnbtm">
      {workouts.length ? (
        <>
          <div className="workouts">
            {workouts.map((workout, index) => (
              <div
                key={index}
                onClick={() => history.push(`/${workout.id}`)}
                className="workout-container"
              >
                <div className="workout">
                  <div>{workout.name}</div>
                  <div>{workout.description}</div>
                  <div>
                    {new Date(workout.startDate).toLocaleDateString("en-US", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </div>
                  <div>{workout.category}</div>
                </div>
              </div>
            ))}
          </div>
          {query.pageCount ? (
            <div className="paginate-container">
              <ReactPaginate
                previousLabel={"previous"}
                nextLabel={"next"}
                breakLabel={"..."}
                breakClassName={"break-me"}
                pageCount={query.pageCount}
                marginPagesDisplayed={2}
                pageRangeDisplayed={5}
                onPageChange={handlePageClick}
                containerClassName={"pagination"}
                activeClassName={"active"}
              />
            </div>
          ) : null}
        </>
      ) : (
        <>There is no workouts retrieved from our API matching your filters.</>
      )}
    </div>
  );
};
