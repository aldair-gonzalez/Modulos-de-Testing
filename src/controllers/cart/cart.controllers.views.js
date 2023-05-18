export const HandleRenderCarts = async (req, res) => {
  req.logger.debug('Render carts')
  res.render('cart/table', { title: 'Carts' })
}

export const HandleRenderCartDetail = async (req, res) => {
  req.logger.debug('Render cart detail')
  res.render('cart/detail', { title: 'Cart' })
}
