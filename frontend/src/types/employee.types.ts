export interface Team {
  id: number;
  name: string;
  color: string;
}

export interface Employee {
  id: number;
  name: string;
  email: string;
  designation: string;
  teamId: number;
  teamName: string;
}
