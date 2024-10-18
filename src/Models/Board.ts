export type Id = number;


export type Board = {
    id: Id,
    name: string,
    status: string,
    columns: Column[],
}

export type Column = {
    id: Id,
    name: string,
    board_id: Id,
    position: number,

}