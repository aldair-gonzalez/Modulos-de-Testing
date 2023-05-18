export const HandleRenderProducts = async (req, res) => {
  req.logger.debug('Render products')
  res.render('product/table', { title: 'Products' })
}

export const HandleRenderProductDetail = async (req, res) => {
  req.logger.debug('Render product detail')
  res.render('product/detail', { title: 'Product Detail' })
}

export const HandleRenderCreateProduct = async (req, res) => {
  req.logger.debug('Render create product')
  res.render('product/create', { title: 'Nuevo producto' })
}

export const HandleRenderUpdateProduct = async (req, res) => {
  req.logger.debug('Render update product')
  res.render('product/update', { title: 'Actualizar producto' })
}
