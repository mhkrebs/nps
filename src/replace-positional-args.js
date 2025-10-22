// Loops over script tokens and replace any position args where positional args are denoted by $<number> and are 1
// indexed (like bash scripts), eg `echo hello $1 world`
// eslint-disable-next-line complexity
function replacePositionalArgs(script, args) {
  if (!script) {
    return [script, args]
  }
  const scriptTokens = script.split(' ')
  const usedArgs = []
  let allArgsUsed = false;
  for (const [i, token] of scriptTokens.entries()) {
    if (token === '"$@"') {
        args.shift();  // Remove unused first element.
        scriptTokens[i] = args.map(arg => `"${arg}"`).join(' ');
        allArgsUsed = true;
        continue;
    }
    if (!token.startsWith('$')) {
      // eslint-disable-next-line no-continue
      continue
    }
    const argIndex = parseInt(token.slice(1), 10)
    const arg = args[argIndex]
    if (typeof arg === 'undefined') {
      // eslint-disable-next-line no-continue
      continue
    }
    scriptTokens[i] = args[argIndex]
    usedArgs.push(argIndex)
  }
  const newScript = scriptTokens.join(' ');

  if (allArgsUsed) {
      return [newScript, []];
  }
  const reducedArgs = args.filter((_, i) => !usedArgs.includes(i))
  // Remove arguments entirely if all arguments were positional
  if (reducedArgs[0] === '--' && reducedArgs.length === 1 && args.length > 1) {
    reducedArgs.pop()
  }
  return [newScript, reducedArgs]
}

module.exports = {
  replacePositionalArgs,
}
