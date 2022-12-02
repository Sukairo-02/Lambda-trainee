import { TaskBase } from '@util/TaskBase'
import inquirer from 'inquirer'
import { exec } from 'child_process'
import replaceLast from '@util/replaceLast'
import z from 'zod'

//Solution {
declare global {
	interface Array<T> {
		/**
		 * Returns a list containing only elements from the given array having distinct keys returned by the given callback function.
		 * @param callback Function that processes array's elements
		 * @param element Processed element of an array
		 */
		distinctBy: (callback: (element: T) => any) => T[]
	}
}

Array.prototype.distinctBy = function (callback: (element: any) => any) {
	const transformedValues = new Set()
	const res: Parameters<typeof callback>[0][] = []
	for (const e of this) {
		const callbackRes = callback(e)
		if (!transformedValues.has(callbackRes)) {
			res.push(e)
		}
		transformedValues.add(callback(e))
	}
	return res
}
//}

class DistinctBy implements TaskBase<string[]> {
	private hasOpened = false
	private validationSchema = z.array(z.string())
	readonly data = ['a', 'A', 'b', 'B', 'a', 'A', 's']
	private callback = undefined
	private callbacks = {
		value: (e: string) => e,
		toUpperCase: (e: string) => e.toUpperCase()
	}

	validate(input) {
		return this.validationSchema.safeParse(input).success
	}

	async inquire() {
		const self = this

		let parsedTestData
		const result = await inquirer.prompt([
			{
				name: 'testData',
				type: 'input',
				message: 'Enter data for testing: ',
				default: JSON.stringify(this.data),
				validate(input) {
					try {
						parsedTestData = JSON.parse(input.replace(/'/g, '"'))
					} catch (e) {}

					return self.validate(parsedTestData) || 'Invalid input. Try again...'
				}
			},
			{
				name: 'callback',
				type: 'list',
				message: 'Select distinction selector: ',
				choices: Object.entries(this.callbacks).map((e) => e[0])
			}
		])

		this.callback = this.callbacks[result.callback]

		return parsedTestData
	}

	execute(input: string[]) {
		console.log(`Distinct: ${JSON.stringify(input.distinctBy(this.callback!))}`)

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

export = new DistinctBy()
