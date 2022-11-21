import http from 'k6/http'
import { sleep } from 'k6'

export let options = {
	vus: 100,
	duration: '5s'
}

const users = ['user1', 'user2', 'user3', 'user4', 'user5', 'user6', 'user7', 'user8']
const passwords = ['gsdfg', 'wet4@5r', '23rfhu', '23f3sg', 'fc3sftw', 'asier3n', 'obaswed12', 's23f3fgr']
const shops = ['someshop', 'someshop2', 'someshop3', 'someshop4', 'someshop5', 'invalidshop']

const getRandom = (items) => {
	return items[Math.floor(Math.random() * items.length)]
}

const getUser = () => {
	return {
		login: getRandom(users),
		password: getRandom(passwords)
	}
}

const getShop = () => {
	return getRandom(shops)
}

export default () => {
	const user = getUser()
	const shop = getShop()
	const body = {
		username: user.login,
		password: user.password,
		shopToken: shop,
		query: '' + user.login + shop + 'query' + String(Math.random())
	}
	http.post('https://a550cnip21.execute-api.eu-north-1.amazonaws.com/query', JSON.stringify(body), {
		headers: { 'Content-Type': 'application/json' }
	})
	sleep(1)
}
