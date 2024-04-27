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
