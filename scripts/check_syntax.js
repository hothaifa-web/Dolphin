const fs = require('fs')
const path = require('path')
const parser = require('@babel/parser')

function walk(dir){
  let results = []
  fs.readdirSync(dir).forEach(file =>{
    const full = path.join(dir, file)
    const stat = fs.statSync(full)
    if(stat.isDirectory()) results = results.concat(walk(full))
    else if(/\.(js|jsx|ts|tsx)$/.test(full)) results.push(full)
  })
  return results
}

const files = walk(path.join(__dirname, '..', 'src'))
let hadError = false
for(const f of files){
  const code = fs.readFileSync(f, 'utf8')
  try{
    parser.parse(code, { sourceType: 'module', plugins: ['jsx','classProperties','decorators-legacy','dynamicImport','optionalChaining','nullishCoalescingOperator'] })
  }catch(e){
    console.error('\nSyntax error in', f)
    console.error(e.message)
    hadError = true
  }
}
if(!hadError) console.log('No syntax errors found in src/')
process.exit(hadError?1:0)
