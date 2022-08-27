import { TaskBase } from '@util/TaskBase'
import inquirer from 'inquirer'
import { exec } from 'child_process'
import replaceLast from '@util/replaceLast'

//Solution {
declare global {
	interface Array<T> {
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

type ArrayElement<ArrayType extends readonly unknown[]> = ArrayType extends readonly (infer ElementType)[]
	? ElementType
	: never

class GroupBy implements TaskBase<string[]> {
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

	execute(input) {
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
