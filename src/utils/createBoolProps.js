import { camelize } from 'humps'

const createBoolProps = (block, modifiers, join = '__') => (args) => {
  const obj = {}
  modifiers.forEach((modifier) => {
    const fullName = `${block}${join}${modifier}`
    obj[fullName] = args[camelize(modifier)]
  })
  return obj
}

export default createBoolProps
