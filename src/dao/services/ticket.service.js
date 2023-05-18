import config from '../../config/config.js'
import { connectMongo } from '../../utils/mongoose.js'
import { TicketRepository } from './repository/ticket.repository.js'

let TicketService

switch (config.store) {
  case 'MONGO': {
    connectMongo()
    const { ticketMongo } = await import('../mongo/ticket.mongo.js')
    TicketService = ticketMongo
    break
  }

  case 'MEMORY': {
    const { ticketMemory } = await import('../memory/ticket.memory.js')
    TicketService = ticketMemory
    break
  }
}

export const ticketService = new TicketRepository(TicketService)
