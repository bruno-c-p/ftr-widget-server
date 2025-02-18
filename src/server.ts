import { fastifyCors } from '@fastify/cors'
import { fastifyMultipart } from '@fastify/multipart'
import { fastify } from 'fastify'
import { healthCheckRoute } from './routes/health-check'
import { uploadImageRoute } from './routes/upload-image'

const server = fastify()

server.register(fastifyCors, {
  origin: '*',
})

server.register(fastifyMultipart)
server.register(uploadImageRoute)
server.register(healthCheckRoute)

server.listen({ port: 3333, host: '0.0.0.0' }).then(() => {
  console.log('HTTP server running!')
})