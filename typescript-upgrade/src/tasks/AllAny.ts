import { TaskBase } from '@util/TaskBase'
import z from 'zod'
import inquirer from 'inquirer'
import { exec } from 'child_process'
import replaceLast from '@util/replaceLast'

//Solution {
declare global {
	interface Array<T> {
		/**
		 * Returns true if all elements match the given predicate.
		 * @param callback Predicate
		 * @param element Processed element of an array
		 */
		any: (callback: (element: T) => boolean) => boolean
		/**
		 * Returns true if one of the elements matches the given predicate.
		 * @param callback Predicate
		 * @param element Processed element of an array
		 */
		all: (callback: (element: T) => boolean) => boolean
	}
}

Array.prototype.any = function (callback: (element: any) => boolean): boolean {
	for (const e of this) {
		if (callback(e)) {
			return true
		}
	}
	return false
}

Array.prototype.all = function (callback: (element: any) => boolean): boolean {
	for (const e of this) {
		if (!callback(e)) {
			return false
		}
	}
	return true
}
//}

class AllAny implements TaskBase<string[]> {
	private hasOpened = false
	private validationSchema = z.array(z.string())
	readonly fruits = ['🍏', '🍎', '🍐', '🍊', '🍌']

	private isFruit = (data: string) => {
		return !!(this.fruits.findIndex((e) => data === e) + 1)
	}

	validate(input) {
		return this.validationSchema.safeParse(input).success
	}

	async inquire() {
		const self = this

		let parsedTestData
		await inquirer.prompt({
			name: 'testData',
			type: 'input',
			message: 'Enter data for testing: ',
			default: JSON.stringify(this.fruits),
			validate(input) {
				try {
					parsedTestData = JSON.parse(input.replace(/'/g, '"'))
				} catch (e) {}

				return self.validate(parsedTestData) || 'Invalid input. Try again...'
			}
		})

		return parsedTestData
	}

	execute(input: string[]) {
		console.log(`All: ${input.all((e) => this.isFruit(e)) ? '✔' : '✘'}`)
		console.log(`Any: ${input.any((e) => this.isFruit(e)) ? '✔' : '✘'}\n`)

		if (!this.hasOpened) {
			try {
				this.hasOpened = true
				exec(`code ${replaceLast(replaceLast(__filename, 'compiled', 'src'), '.js', '.ts')}`)
			} catch (e) {
				console.log('\tFailed to open code in VSCode!')
			}
		}
	}
}

export = new AllAny()
