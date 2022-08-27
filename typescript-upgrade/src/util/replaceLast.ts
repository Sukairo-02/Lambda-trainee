export = function (where: string, what: string, replacement: string) {
	var pcs = where.split(what)
	var lastPc = pcs.pop()
	return pcs.join(what) + replacement + lastPc
}
