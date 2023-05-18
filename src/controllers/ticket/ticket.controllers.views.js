export const HandleRenderTickets = async (req, res) => {
  req.logger.debug('Render tickets')
  res.render('ticket/table', { title: 'Tickets' })
}
