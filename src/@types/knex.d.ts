// .d.ts vem de definição de tipos
// eslint-disable-next-line
import { Knex } from 'knex'

declare module 'knex/types/tables' {
  export interface Tables {
    transactions: {
      id: string
      title: string
      amount: number
      type: 'credit' | 'debit'
      created_at: string
      session_id?: string
    }
  }
}
