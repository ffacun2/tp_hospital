export interface Sector {
   id_sector: number
   tipo: string
}

export type createSectorDTO = Omit<Sector, "id_sector">;

export type updateSectorDTO = Partial<createSectorDTO>;