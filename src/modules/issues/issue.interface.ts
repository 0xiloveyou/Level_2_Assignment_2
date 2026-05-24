export interface IssueTable {
      title? : string
      description? : string
      type? : string
      status? : string
}

export interface IssueInsert {
      title? : string
      description? : string
      type? : string
      status? : string
      reporter_id : number
}