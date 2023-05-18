import { faker } from '@faker-js/faker'
import { Product } from '../dao/patterns/product.pattern.js'

faker.locale = 'es_MX'

export const generateProduct = async () => {
  const images = []

  for (let i = 0; i < faker.datatype.number({ max: 5 }); i++) {
    images.push(faker.image.abstract())
  }

  return new Product(
    faker.commerce.productName(),
    faker.commerce.productDescription(),
    faker.random.alphaNumeric(10),
    faker.commerce.price(),
    faker.datatype.boolean(),
    faker.datatype.number({ max: 20 }),
    faker.commerce.department(),
    images
  )
}
