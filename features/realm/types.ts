export interface UserProps {
	'name': { type: string };
}

export type UserKey = keyof UserProps;
export type UserValue<K extends UserKey> = UserProps[K]['type'];

export type User = {
  [K in keyof UserProps]: UserValue<K>
};
