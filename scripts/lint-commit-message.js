const COMMIT_MSG = process.argv[2]
const COMMIT_REGEX = /^(revert: )?(feat|fix|docs|style|refactor|perf|test|chore)(\(.+\))?: .{1,50}/

if (!COMMIT_REGEX.test(COMMIT_MSG)) {
  console.log('Commit messages must be "fix/feat/docs/style/refactor/perf/test/chore: <changes>"')
  console.log(`But got: "${COMMIT_MSG}"`)
  process.exit(1)
}
