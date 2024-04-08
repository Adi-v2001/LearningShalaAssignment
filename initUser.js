const {PrismaClient} = require('@prisma/client')
const bcrypt = require('bcrypt')

const prisma = new PrismaClient()

const userName = 'Aditya'
const email = 'adityaverma@gmail.com'
const password = '12345678'
const phone = '8810263865'

const main = async () => {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
        data: {
            name: userName,
            email,
            password: hashedPassword,
            phone
        }
    })
    return user
}

main().then((res) => console.log('User made successfully', res))