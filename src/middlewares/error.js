import { CodeError } from '../lib/error/constants/code.js'
import { response } from '../utils/response.js'

export const isError = (err, req, res, next) => {
  req.logger.error(`${err.cause}: ${err.message}`)
  const responseStatus = response(CodeError.INTERNAL_SERVER_ERROR, null, { cause: err.cause, message: err.message })

  switch (err.code) {
    case CodeError.BAD_REQUEST: {
      responseStatus.status = CodeError.BAD_REQUEST
      break
    }
    case CodeError.UNAUTHORIZED: {
      responseStatus.status = CodeError.UNAUTHORIZED
      break
    }
    case CodeError.PAYMENT_REQUIRED: {
      responseStatus.status = CodeError.PAYMENT_REQUIRED
      break
    }
    case CodeError.FORBIDDEN: {
      responseStatus.status = CodeError.FORBIDDEN
      break
    }
    case CodeError.NOT_FOUND: {
      responseStatus.status = CodeError.NOT_FOUND
      break
    }
    case CodeError.METHOD_NOT_ALLOWED: {
      responseStatus.status = CodeError.METHOD_NOT_ALLOWED
      break
    }
    case CodeError.NOT_ACCEPTABLE: {
      responseStatus.status = CodeError.NOT_ACCEPTABLE
      break
    }
    case CodeError.PROXY_AUTHENTICATION_REQUIRED: {
      responseStatus.status = CodeError.PROXY_AUTHENTICATION_REQUIRED
      break
    }
    case CodeError.REQUEST_TIMEOUT: {
      responseStatus.status = CodeError.REQUEST_TIMEOUT
      break
    }
    case CodeError.CONFLICT: {
      responseStatus.status = CodeError.CONFLICT
      break
    }
    case CodeError.GONE: {
      responseStatus.status = CodeError.GONE
      break
    }
    case CodeError.LENGTH_REQUIRED: {
      responseStatus.status = CodeError.LENGTH_REQUIRED
      break
    }
    case CodeError.PRECONDITION_FAILED: {
      responseStatus.status = CodeError.PRECONDITION_FAILED
      break
    }
    case CodeError.PAYLOAD_TOO_LARGE: {
      responseStatus.status = CodeError.PAYLOAD_TOO_LARGE
      break
    }
    case CodeError.URI_TOO_LONG: {
      responseStatus.status = CodeError.URI_TOO_LONG
      break
    }
    case CodeError.UNSUPPORTED_MEDIA_TYPE: {
      responseStatus.status = CodeError.UNSUPPORTED_MEDIA_TYPE
      break
    }
    case CodeError.RANGE_NOT_SATISFIABLE: {
      responseStatus.status = CodeError.RANGE_NOT_SATISFIABLE
      break
    }
    case CodeError.EXPECTATION_FAILED: {
      responseStatus.status = CodeError.EXPECTATION_FAILED
      break
    }
    case CodeError.MISDIRECTED_REQUEST: {
      responseStatus.status = CodeError.MISDIRECTED_REQUEST
      break
    }
    case CodeError.UNPROCESSABLE_ENTITY: {
      responseStatus.status = CodeError.UNPROCESSABLE_ENTITY
      break
    }
    case CodeError.LOCKED: {
      responseStatus.status = CodeError.LOCKED
      break
    }
    case CodeError.FAILED_DEPENDENCY: {
      responseStatus.status = CodeError.FAILED_DEPENDENCY
      break
    }
    case CodeError.TOO_EARLY: {
      responseStatus.status = CodeError.TOO_EARLY
      break
    }
    case CodeError.UPGRADE_REQUIRED: {
      responseStatus.status = CodeError.UPGRADE_REQUIRED
      break
    }
    case CodeError.PRECONDITION_REQUIRED: {
      responseStatus.status = CodeError.PRECONDITION_REQUIRED
      break
    }
    case CodeError.TOO_MANY_REQUESTS: {
      responseStatus.status = CodeError.TOO_MANY_REQUESTS
      break
    }
    case CodeError.REQUEST_HEADER_FIELDS_TOO_LARGE: {
      responseStatus.status = CodeError.REQUEST_HEADER_FIELDS_TOO_LARGE
      break
    }
    case CodeError.UNAVAILABLE_FOR_LEGAL_REASONS: {
      responseStatus.status = CodeError.UNAVAILABLE_FOR_LEGAL_REASONS
      break
    }
    case CodeError.INTERNAL_SERVER_ERROR: {
      responseStatus.status = CodeError.INTERNAL_SERVER_ERROR
      break
    }
    case CodeError.NOT_IMPLEMENTED: {
      responseStatus.status = CodeError.NOT_IMPLEMENTED
      break
    }
    case CodeError.BAD_GATEWAY: {
      responseStatus.status = CodeError.BAD_GATEWAY
      break
    }
    case CodeError.SERVICE_UNAVAILABLE: {
      responseStatus.status = CodeError.SERVICE_UNAVAILABLE
      break
    }
    case CodeError.GATEWAY_TIMEOUT: {
      responseStatus.status = CodeError.GATEWAY_TIMEOUT
      break
    }
    case CodeError.HTTP_VERSION_NOT_SUPPORTED: {
      responseStatus.status = CodeError.HTTP_VERSION_NOT_SUPPORTED
      break
    }
    case CodeError.VARIANT_ALSO_NEGOTIATES: {
      responseStatus.status = CodeError.VARIANT_ALSO_NEGOTIATES
      break
    }
    case CodeError.INSUFFICIENT_STORAGE: {
      responseStatus.status = CodeError.INSUFFICIENT_STORAGE
      break
    }
    case CodeError.LOOP_DETECTED: {
      responseStatus.status = CodeError.LOOP_DETECTED
      break
    }
    case CodeError.NOT_EXTENDED: {
      responseStatus.status = CodeError.NOT_EXTENDED
      break
    }
    case CodeError.NETWORK_AUTHENTICATION_REQUIRED: {
      responseStatus.status = CodeError.NETWORK_AUTHENTICATION_REQUIRED
      break
    }

    default: {
      responseStatus.status = CodeError.INTERNAL_SERVER_ERROR
      break
    }
  }
  res.status(responseStatus.status).json(responseStatus)
}
