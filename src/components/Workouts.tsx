import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { getWorkouts } from "..//services/WorkoutService";
import ReactPaginate from "react-paginate";
import { Workout } from "./Workout";
import { useHistory } from "react-router-dom";
import {
  NumberParam,
  ArrayParam,
  StringParam,
  withDefault,
  useQueryParams,
} from "use-query-params";
import Select from "react-select";

const RESULTS_PER_PAGE = 20;

export const categories = ["c1", "c2", "c3", "c4", "c5", "c6", "c7"] as const;

const categoriesObject = categories.map((category) => ({
  label: category,
  value: category,
}));

export type Category = typeof categories;

const getNext12MonthNamesWithYear = function () {
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  let months = [];
  let tmpDate = new Date();
  let tmpYear = tmpDate.getFullYear();
  let tmpMonth = tmpDate.getMonth();
  let monthLiteral;

  for (let i = 0; i < 12; i++) {
    tmpDate.setMonth(tmpMonth + i);
    tmpDate.setFullYear(tmpYear);
    monthLiteral = monthNames[tmpMonth];
    months.push({
      label: monthLiteral + " " + tmpYear,
      value: monthLiteral + " " + tmpYear,
    });
    tmpYear = tmpMonth === 11 ? tmpYear + 1 : tmpYear;
    tmpMonth = tmpMonth === 11 ? 0 : tmpMonth + 1;
  }

  return months;
};

export const Workouts = () => {
  const [query, setQuery] = useQueryParams({
    pageCount: NumberParam,
    offset: withDefault(NumberParam, 1),
    monthSelected: withDefault(StringParam, undefined),
    categoriesSelected: withDefault(ArrayParam, []),
  });

  const monthsFilters = getNext12MonthNamesWithYear();
  const history = useHistory();
  const [workouts, setWorkouts] = useState<Workout[]>([]);

  const fetchWorkouts = React.useCallback(() => {
    getWorkouts(query.offset, RESULTS_PER_PAGE, {
      monthSelected: query.monthSelected,
      categoriesSelected: query.categoriesSelected,
    }).then((result) => {
      setWorkouts(result.data);
      setQuery((latest) => {
        return { ...latest, pageCount: result.pageCount };
      });
    });
  }, [query.offset, query.monthSelected, query.categoriesSelected, setQuery]);

  useEffect(() => fetchWorkouts(), [
    query.offset,
    query.monthSelected,
    query.categoriesSelected,
    fetchWorkouts,
  ]);

  const handlePageClick = ({ selected }: { selected: number }) => {
    let newOffset = Math.ceil(selected * RESULTS_PER_PAGE);
    setQuery((latest) => ({ ...latest, offset: newOffset }));
  };

  return (
    <div className="container">
      <div className="filter-section-container">
        <div className="filter-section">
          <div className="filter-section-title">Filters</div>
          <div style={{ width: 400 }}>
            <Select
              isClearable
              defaultValue={
                query.monthSelected
                  ? {
                      label: query.monthSelected,
                      value: query.monthSelected,
                    }
                  : undefined
              }
              placeholder="Select months you are interested in."
              options={monthsFilters}
              onChange={(valueSelected) =>
                setQuery((latest) => ({
                  ...latest,
                  offset: 0,
                  monthSelected: valueSelected?.value ?? undefined,
                }))
              }
            />
          </div>
          <div style={{ width: 400 }}>
            <Select
              defaultValue={query.categoriesSelected.map(
                (categorySelected) => ({
                  label: categorySelected,
                  value: categorySelected,
                })
              )}
              placeholder="Select categories you are interested in."
              closeMenuOnSelect={false}
              isMulti
              options={categoriesObject}
              onChange={(valuesSelected) =>
                setQuery((latest) => ({
                  ...latest,
                  offset: 0,
                  categoriesSelected: valuesSelected.map(
                    (valueSelected) => valueSelected.value
                  ),
                }))
              }
            />
          </div>
        </div>
      </div>
      {workouts.length ? (
        <>
          <div className="workouts">
            {workouts.map((workout, index) => (
              <div
                key={index}
                onClick={() =>
                  history.push(`/${workout.id}`, {
                    from: window.location.pathname + window.location.search,
                  })
                }
                className="workout-container"
              >
                <div className="workout">
                  <div className="workout-name">{workout.name}</div>
                  <div className="workout-category">
                    Category: {workout.category}
                  </div>
                  <div className="workout-date">
                    {new Date(workout.startDate).toLocaleDateString("en-US", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                      hour: "numeric",
                      minute: "numeric",
                    })}
                  </div>
                  <div className="workout-more">More information</div>
                </div>
              </div>
            ))}
          </div>
          {query.pageCount && query.pageCount > 1 ? (
            <div className="paginate-container">
              <ReactPaginate
                forcePage={query.offset ? query.offset / RESULTS_PER_PAGE : 0}
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
