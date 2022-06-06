const inquirer = require('inquirer')
const fs = require('fs')

const errorlessParse = (data) => {
	try {
		return JSON.parse(data)
	} catch (e) {
		return undefined
	}
}

const start = async () => {
	try {
		//Pre main loop setup
		const dbPath = './data/DB.txt'
		const lettersOnly = new RegExp(/^[a-zA-Zа-яА-ЯёЁ]*$/)
		const numbersOnly = new RegExp(/^[0-9]+$/)

		const nameQuestion = [
			{
				name: 'name',
				type: 'input',
				message: 'Enter your name: ',
				validate: (input) => lettersOnly.test(input) || 'Invalid name, try again...'
			}
		]
		const questions = [
			{
				name: 'gender',
				type: 'list',
				message: 'Choose your gender: ',
				choices: ['Male', 'Female']
			},
			{
				name: 'age',
				type: 'input',
				message: 'Enter your age: ',
				validate: (input) => numbersOnly.test(input) || 'Invalid age, try again...'
			}
		]
		const dbQuestion = [
			{
				name: 'readDB',
				type: 'confirm',
				message: 'Print out database?'
			}
		]

		console.log(
			"Welcome to primitive-db!\nTo add data, simply follow further instructions\nTo stop adding data and check database, simply leave 'Name' field blank.\n"
		)

		const newData = []

		//Main loop
		while (true) {
			const name = (await inquirer.prompt(nameQuestion)).name
			if (name) {
				const answer = await inquirer.prompt(questions)
				newData.push({ name, ...answer })
			} else {
				break
			}
		}

		//Post loop
		const folderName = dbPath.split('/')[1]
		if (!fs.existsSync(`./${folderName}`)) {
			fs.mkdirSync(folderName)
		}
		if (!fs.existsSync(dbPath)) {
			fs.writeFileSync(dbPath, '[]')
		}

		const dbComplete = errorlessParse(fs.readFileSync(dbPath).toString()) || []
		dbComplete.push(...newData)

		const dbString = JSON.stringify(dbComplete, null, 4)

		if (await inquirer.prompt(dbQuestion)) {
			console.log(`\nDatabase contents:\n${dbString}`)
		}
		fs.writeFileSync(dbPath, dbString)
	} catch (e) {
		console.log(e)
	}
}

start()
