export default function Datetime(d) {
	let fusoBR = d;
	if (d.length > 11) {
		fusoBR = `
    ${d.slice(8, 10)}/${d.slice(5, 7)}/${d.slice(0, 4)} às 
    ${d.slice(11, 19)}`;
	}

	return fusoBR;
}
