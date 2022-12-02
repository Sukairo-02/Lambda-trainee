import 'module-alias/register'
import type { DistinctQuestion } from 'inquirer'
import inquirer from 'inquirer'
import AllAny from '@tasks/AllAny'
import GroupBy from '@tasks/GroupBy'
import DistinctBy from '@tasks/DistinctBy'

const subjectMap = {
	'.all .any': AllAny,
	'.GroupBy': GroupBy,
	'.DistinctBy': DistinctBy
}

const start = async () => {
	try {
		const pickSubject: DistinctQuestion = {
			name: 'testOption',
			type: 'list',
			message: 'Which task to demonstrate?',
			choices: Object.entries(subjectMap).map((e) => e[0])
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
