
export async function getWorkouts(offset: number, resultPerPage:number) {
    console.log({offset});
    
    const response = await fetch(`/api/workouts?offset=${offset}&limit=${resultPerPage}`);
    return await response.json();
}


export async function getWorkout(id:string) {

    const response = await fetch(`/api/workouts/${id}`);
    return await response.json();
}
