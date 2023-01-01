import validator from'validator'
const email = validator.isEmail('Ata@gmail.com')
console.log(email)


import bcrypt from 'bcryptjs'

const password = 'Red1234@'

const hashedPassword = await bcrypt.hash(password, 12)
console.log(hashedPassword)

const comparePassword = await bcrypt.compare(password, hashedPassword)
console.log(comparePassword)
