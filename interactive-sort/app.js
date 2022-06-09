const readline = require('readline') //standart node lib

const question = (question) => {
	const rl = readline.createInterface({
		input: process.stdin,
		output: process.stdout
	})

	let response

	rl.setPrompt(question)
	rl.prompt()

	return new Promise((resolve, reject) => {
		rl.on('line', (userInput) => {
			response = userInput
			rl.close()
		})

		rl.on('close', () => {
			resolve(response)
		})
	})
}

const printMenu = async (stage) => {
	switch (stage) {
		case 0:
			console.log('\nIncorrect input, try again!\n')
			break
		case 1:
			return await question('Welcome! Enter 10 words or numbers divided by spaces: ')
		case 2:
			return await question(
				"Now select what you would like to do:\n1.Sort words alphabetically\n2.Sort numbers in ascending order\n3.Sort numbers in descending order\n4.Sort words by length\n5.Show unique words\n6.Show unique inputs\nType 'exit' to terminate execution\n>"
			)
		case 3:
			console.log('\nGoodbye!\n')
			break
	}
}

const lettersOnly = new RegExp(/^[a-zA-Z]*$/)
const numbersOnly = new RegExp(/^-?[0-9]+(.[0-9]+)?$/)

const parseInput = (input) => {
	if (!(input instanceof String)) {
		input = new String(input)
	}
	const result = {
		words: [],
		numbers: []
	}

	input.split(' ').forEach((e) => {
		if (lettersOnly.test(e)) {
			result.words.push(e)
		} else if (numbersOnly.test(e)) {
			result.numbers.push(e)
		}
	})

	return result
}

const inlineErr = async () => {
	await printMenu(0)
	return true
}

const sortAlphabet = (input) => {
	return input.words.sort((a, b) => a.localeCompare(b))
}

const sortAsc = (input) => {
	return input.numbers.sort((a, b) => a - b)
}

const sortDesc = (input) => {
	return input.numbers.sort((a, b) => b - a)
}

const sortLength = (input) => {
	return input.words.sort((a, b) => a.length - b.length)
}

const uniqueWords = (input) => {
	const result = new Set()
	input.words.forEach((e) => {
		result.add(e)
	})

	return result
}

const uniqueInputs = (input) => {
	const result = uniqueWords(input)

	input.numbers.forEach((e) => {
		result.add(e)
	})

	return result
}

const start = async () => {
	let parseRes
	do {
		parseRes = parseInput(await printMenu(1))
	} while (parseRes.words.length + parseRes.numbers.length != 10 && (await inlineErr()))

	let menuResults = {}
	let menu
	do {
		menu = await printMenu(2)
		switch (menu) {
			case '1':
				menuResults.alphabet = menuResults.alphabet || sortAlphabet(parseRes)
				console.log(`\n${menuResults.alphabet}\n`)
				break
			case '2':
				menuResults.asc = menuResults.asc || sortAsc(parseRes)
				console.log(`\n${menuResults.asc}\n`)
				break
			case '3':
				menuResults.desc = menuResults.desc || sortDesc(parseRes)
				console.log(`\n${menuResults.desc}\n`)
				break
			case '4':
				menuResults.length = menuResults.length || sortLength(parseRes)
				console.log(`\n${menuResults.length}\n`)
				break
			case '5':
				menuResults.uWords = menuResults.uWords || uniqueWords(parseRes)
				console.log(`\n${[...menuResults.uWords]}\n`)
				break
			case '6':
				menuResults.uInputs = menuResults.uInputs || uniqueInputs(parseRes)
				console.log(`\n${[...menuResults.uInputs]}\n`)
				break
			case 'exit':
				await printMenu(3)
				break
			default:
				await printMenu(0)
				break
		}
	} while (menu !== 'exit')
}

start()
