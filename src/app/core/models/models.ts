export interface Driver {
  driverId: string;
  name: string;
  surname: string;
  shortName: string;
  nationality: string;
  birthday: string;
  url: string;
  number?: number;
  teamId?: string;
  teamName?: string;
}

export interface Team {
  teamId: string;
  teamName: string;
  teamNationality: string;
  firstAppeareance?: string;
  constructorsChampionships?: number;
  driversChampionships?: number;
  url?: string;
}


export interface ChampionshipDriver {
  driver: Driver;
  points: number;
}

export interface ChampionshipConstructor {
  team: Team;
  points: number;
}

export interface DriversChampionshipResponse {
  drivers_championship: ChampionshipDriver[];
}

export interface ConstructorsChampionshipResponse {
  constructors_championship: ChampionshipConstructor[];
}

export interface DriversResponse {
  drivers: Driver[];
}

export interface TeamsResponse {
  teams: Team[];
}
