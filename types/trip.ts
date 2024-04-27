export type Trip = {
  id: number;
  fio: string;
  date_start: Date | string;
  date_end: Date | string;
};

export type TripExtended = Trip & {
  total: number;
  failed: number;
};

export function getDefaultTrip() {
  return <Trip>{
    id: -1,
    fio: "",
    date_start: "1970-01-01",
    date_end: "1970-01-02",
  };
}
