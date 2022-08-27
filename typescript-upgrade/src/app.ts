import 'module-alias/register'
import type { DistinctQuestion } from 'inquirer'
import inquirer from 'inquirer'
import AllAny from '@tasks/AllAny'
import GroupBy from '@tasks/GroupBy'

const subjectMap = {
	'.all .any': AllAny,
	'.GroupBy': GroupBy
}

const start = async () => {
	try {
		const pickSubject: DistinctQuestion = {
			name: 'testOption',
			type: 'list',
			message: 'Which task to demonstrate?',
			choices: ['.GroupBy', '.all .any']
		}
		while (true) {
			const pickData = (await inquirer.prompt(pickSubject)).testOption
			const subject = subjectMap[pickData]
			if (!subject) {
				throw new Error(`Test subject for '${pickData}' not found!`)
			}

			subject.execute(await subject.inquire())
		}
	} catch (e) {
		console.error(e)
	}
}

start()
