import { Response } from '../dao/patterns/response.pattern.js'

export const response = (status, payload, error) => error
  ? new Response(status, payload, error)
  : new Response(status, payload)
