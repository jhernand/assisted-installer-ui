export enum ResourceUIState {
  LOADING = 'LOADING',
  RELOADING = 'RELOADING',
  ERROR = 'ERROR',
  EMPTY = 'EMPTY',
  LOADED = 'LOADED',
}

export type WithTestID = {
  testId?: string;
};
