const { readFile } = require("fs/promises");

/**
 * Utility script that searches for all occurrence of `data-test="..."` in a HTML file.
 * Can be used to populate `apps/client-e2e/src/support/elements.ts`.
 */
async function main() {
	const [_node, _js, path] = process.argv;

	console.log("\nReading from: " + path + "\n");

	const file = await readFile(path, { encoding: "utf8" });

	const matches = file.match(/data-test=".+"/g);

	console.log("Found the following 'data-test' attributes:\n");

	for (const match of matches) {
		const [_, id] = match.match(/data-test="(.+)"/);
		console.log(id);
	}
}

main();
