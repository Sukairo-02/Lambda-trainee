import { TaskBase } from '@util/TaskBase'
import inquirer from 'inquirer'
import { exec } from 'child_process'
import replaceLast from '@util/replaceLast'
import type { ArrayElement } from '@util/ArrayElement'

//Solution {
declare global {
	interface Array<T> {
		/**
		 * Groups elements of the original array by the key returned by the given callback function applied to each element and returns a map where each group key is associated with a list of corresponding elements.
		 * @param callback Function that determines a key to which element will be assigned
		 * @param element Processed element of an array
		 */
		groupBy: (callback: (element: T) => string) => { [key: string]: T[] }
	}
}

Array.prototype.groupBy = function (callback: (element: any) => string) {
	const res = {}
	for (const e of this) {
		const group = callback(e)
		res[group] ? res[group].push(e) : (res[group] = [e])
	}
	return res
}
//}

class GroupBy implements TaskBase<string> {
	private hasOpened = false
	private data = [
		{ emoji: '😀', sad: false, color: 'Yellow' },
		{ emoji: '😥', sad: true, color: 'Yellow' },
		{ emoji: '🤡', sad: false, color: 'White' },
		{ emoji: '😢', sad: true, color: 'Yellow' },
		{ emoji: '😡', sad: false, color: 'Red' },
		{ emoji: '🤬', sad: false, color: 'Red' },
		{ emoji: '🐳', sad: false, color: 'Blue' }
	]

	private predicates = {
		Mood: (e: ArrayElement<typeof this.data>) => (e.sad ? 'Sad' : 'Not sad'),
		Color: (e: ArrayElement<typeof this.data>) => e.color
	}

	async inquire() {
		return (
			await inquirer.prompt({
				name: 'testData',
				type: 'list',
				message: `Initial data:\n${this.data.reduce<string>(
					(p, e) => `${p}${e.emoji}\t${e.sad ? 'Sad' : 'Not sad'}\t${e.color}\n`,
					''
				)}\nGroup By:`,
				choices: ['Mood', 'Color']
			})
		).testData
	}

	execute(input: string) {
		const grouped = this.data.groupBy(this.predicates[input])
		let resStr = ''
		for (const [key, value] of Object.entries(grouped)) {
			resStr = `${resStr}${key}:\n`
			for (const e of value) {
				resStr = `${resStr}${e.emoji}\t${e.sad ? 'Sad' : 'Not sad'}\t${e.color}\n`
			}
		}
		console.log(`${resStr}\n`)

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

export = new GroupBy()
