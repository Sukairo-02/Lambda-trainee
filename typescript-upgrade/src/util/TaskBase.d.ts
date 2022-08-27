export interface TaskBase<T> {
	inquire: () => Promise<string>
	execute: (input: T) => any
}
