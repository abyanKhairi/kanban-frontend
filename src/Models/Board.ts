export type Id = number | string;


export type Board = {
    id: Id,
    name: string,
    status: string,
    columns: Columns[],
}

export type Columns = {
    id: Id,
    name: string,
    board_id: Id,
    position: number,
    tasks: Tasks[],

}

export type Tasks = {
    id: Id;
    column_id: Id;
    title: string;
    description: string
    position: number
    status: string
    deadline: Date
}
