import { FastifyInstance } from 'fastify'
import { knex } from '../database'
import { randomUUID } from 'node:crypto'
import { z } from 'zod'
import { CheckSessionIdExits } from '../middlewares/check-session-id-exists'

export async function transactionsRoutes(app: FastifyInstance) {
  //   app.addHook('preHandler', async (request, reply) => {
  //     console.log(`[${request.method} ${request.url}]`)
  //   })

  // list user transactions
  app.get('/', { preHandler: [CheckSessionIdExits] }, async (request) => {
    const { sessionId } = request.cookies

    const transactions = await knex('transactions')
      .where('session_id', sessionId)
      .select()

    /*
        é uma boa pratica retornar como um objeto para caso deseje
        no futuro inserir mais informações e uma não atrapalhe a outra.
    */
    return { transactions }
  })

  // transaction details
  app.get('/:id', { preHandler: [CheckSessionIdExits] }, async (request) => {
    const getTransactionParamsSchema = z.object({
      id: z.string().uuid(),
    })

    const { sessionId } = request.cookies

    const { id } = getTransactionParamsSchema.parse(request.params)

    const transaction = await knex('transactions')
      .where({ id, session_id: sessionId })
      .first()

    return { transaction }
  })

  // user transactions summary
  app.get(
    '/summary',
    { preHandler: [CheckSessionIdExits] },
    async (request) => {
      const { sessionId } = request.cookies

      const summary = await knex('transactions')
        .where('session_id', sessionId)
        .sum('amount', { as: 'amount' })
        .first()

      return { summary }
    },
  )

  // create new transaction
  app.post(
    '/',
    { preHandler: [CheckSessionIdExits] },
    async (request, reply) => {
      const createTransactionBodySchema = z.object({
        title: z.string(),
        amount: z.number(),
        type: z.enum(['credit', 'debit']),
      })

      const { title, amount, type } = createTransactionBodySchema.parse(
        request.body,
      )

      let sessionId = request.cookies.sessionId

      if (!sessionId) {
        sessionId = randomUUID()

        reply.cookie('sessionId', sessionId, {
          path: '/',
          maxAge: 60 * 60 * 24 * 7, // 7 days,
        })
      }

      await knex('transactions').insert({
        id: randomUUID(),
        title,
        amount: type === 'credit' ? amount : amount * -1,
        type,
        session_id: sessionId,
      })

      return reply.status(201).send()
    },
  )
}
