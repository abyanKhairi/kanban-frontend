export type Id = number | string;


export type Board = {
    id: Id,
    name: string,
    status: string,
    created_at: Date,
    user_id: number,
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
    user_id: Id;
    column_id: Id;
    title: string;
    description: string
    position: number
    status: string
    deadline: Date
}

// export type Collaborator = {
//     id: Id,
//     board_id: Id,
//     user_id: Id,
//     name: string,
//     email: string,
//     edit_cards: boolean,
//     delete_cards: boolean,
//     add_cards: boolean,
//     add_members: boolean,
//     manage_board: boolean,
// }