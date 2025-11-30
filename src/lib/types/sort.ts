export type SortName = 'name';
export type SortAge = 'age';
export type SortDob = 'dob';
export type SortDirection = 'asc' | 'desc';
export type SortOptionName = { [K in SortName]?: SortDirection };
export type SortOptionAge = { [K in SortAge]?: SortDirection };
export type SortOptionDob = { [K in SortDob]?: SortDirection };
