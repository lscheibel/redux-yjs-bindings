// The types exported by recursive-diff are not always correct (e.g. path is actually optional).

export enum RecursiveDiffResultOperation {
  Add = 'add',
  Update = 'update',
  Delete = 'delete',
}

export interface RecursiveDiffResultAdd {
  op: RecursiveDiffResultOperation.Add;
  path?: Array<string | number>;
  val: unknown;
}

export interface RecursiveDiffResultUpdate {
  op: RecursiveDiffResultOperation.Update;
  path?: Array<string | number>;
  val: unknown;
}

export interface RecursiveDiffResultDelete {
  op: RecursiveDiffResultOperation.Delete;
  path?: Array<string | number>;
  val: undefined;
}

export type RecursiveDiffResult = Array<
  RecursiveDiffResultAdd | RecursiveDiffResultUpdate | RecursiveDiffResultDelete
>;
