// fetcher as func to fetch data from API
export const fetcher = (url: string) => fetch(url).then(res => res.json());
