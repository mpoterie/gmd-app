export async function getWorkouts(
  offset: number,
  resultPerPage: number,
  filters: {
    monthSelected: string | undefined;
    categoriesSelected: (string | null)[] | never[];
  }
) {
  const response = await fetch(
    `/api/workouts?offset=${offset}&limit=${resultPerPage}${
      filters.monthSelected ? "&monthSelected=" + filters.monthSelected : ""
    }${
      filters.categoriesSelected && filters.categoriesSelected.length
        ? "&categoriesSelected=" + filters.categoriesSelected
        : ""
    }`
  );
  return await response.json();
}

export async function getWorkout(id: string) {
  const response = await fetch(`/api/workouts/${id}`);
  return await response.json();
}
