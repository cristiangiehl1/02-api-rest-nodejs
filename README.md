# Fastiy

## Por que Fastify e não o Express?
- O Fastify tem muito mais updates e um time muito mais ativo do que o Express.
- Uma das opções mais populares do Node.js.
- Tem muita similiaridade com o Express.
- É mais performático e está mais pronto para lidar com as novas funcionalidades do javascript (ex.: typescript). Além disso, está mais preparado para lidar com o assíncronismo do JS.

## Plugins
Podemos utilizar o fastify para registrar uma requisição HTTP feita em uma de nossas rotas.

<span style="color: red ">**TODO PLUGIN DO FASTIFY PRECISA SER UMA FUNÇÃO ASSÍNCRONA**</span>

Os plugins são executados na ordem que são lidos no código.

```
app.register([nome_do_plugin]. {
  prefix: '[nome_da_rota]' 
})
```

## Cookies no Fastify

$ npm i @fastify/cookie

<span style="color: red ">**REGISTRAR OS COOKIES ANTES DAS ROTAS PARA PODER TER ACESSO A ELES.**</span>

- path: diz em quais rotas os cookies estarão disponíveis.
- maxAge: a data de expiração dos cookies em ms.

```
reply.cookie('sessionId', sessionId, {
  path: '/',
  maxAge: 60 * 60 * 24 * 7, // 7 days, 
})

```

## Middlewares no Fastify

### Middlewares em rotas específicas
Depois que configurarmos um middleware para chama-lo antes de cada rota devemos passar um novo objeto para o nosso app. Dentro desse objeto temos o parâmetro de 'preHandler' que é a função que desejamos executar antes da HTTP request.

```
app.get('/', { preHandler: [CheckSessionIdExits] }, async (request) => {
  const { sessionId } = request.cookies

  const transactions = await knex('transactions')
    .where('session_id', sessionId)
    .select()

  return { transactions }
})
```

### Middlewares Globais dentro da mesma rota
Também podemos passar um middleware que será chamado antes de todas as rotas de um mesmo arquivo.

```
app.addHook('preHandler', async (request, reply) => {
  console.log(`[${request.method} ${request.url}]`)
})
```

### Middlewares Globais para toda a aplicação
Só usar no server.ts a função da variável que você instânciou o fastify()
de addHook.

```
app.addHook('preHandler', async (request, reply) => {
  console.log(`[${request.method} ${request.url}]`)
})
```


# Cookies
Formas da gente manter contexto entre requisições.
Armazenar o id de um usuário para validar requisições de um usuário específico.


# Typescript
Quando não usamos o react ou o next é necessário criar o arquivo tsconfig.json manualmente. Para isso rodamos no terminal: 

$ npm i -D typescript

$ npx tsc --init

Mudar no tsconfig.json o target.

```
"compilerOptions": {   
    "target": "es2020",   
}

```

Para usar o typescript com o node é necessário a instalação do pacote @types/node

$ npm i -D @types/node

# Node.js

O node não lê arquivos .ts. É preciso instalar uma ferramenta. Essa ferramenta faz o processo de converter o arquivo .ts para .js e executa o novo arquivo. 

$ npm i tsx -D


# KNEX - SQL Query builder
É preciso fazer as configurações do banco de dados que vamos utilizar com o knex. Nesse projeto escolhemos o sqlite3.

```
import { knex as setupKnex, Knex } from 'knex'

export const config: Knex.Config = {
  client: 'sqlite',
  connection: {
    filename: './db/app.db',
  },
  useNullAsDefault: true,
  migrations: {
    extension: 'ts',
    directory: './db/migrations',
  },
}

export const knex = setupKnex(config)
```

Além disso, por convenção devemos criar na raíz do projeto um arquivo de configuração do knex para passar as configurações feitas do banco de dados.

```
import { config } from './src/database'

export default config

```

Como o node não lê arquivos .ts podemos criar no terminal um script para simplificar a linha de comando.

$ "knex": "node --import tsx ./node_modules/knex/bin/cli.js",


## Criar uma migration

$ npm run knex -- migrate:make [nome da migration]


## Criar a tabela
$ npm run knex -- migrate:latest

## Editar a migration

Somente antes de subir para a produção.

$ npm run knex -- migrate:rollback


# Env
Para que o node consiga ler as variaveis de ambiente é necessário instalar o pacote abaixo: 

$ npm i dotenv

Depois disso nos arquivos que queremos utilizar as variaveis de ambiente devemos importar:

```
import 'dotenv/config'
```

Vamos usar a biblioteca zod para validar as variaveis de ambiente.

# Zod

o parse() faz a validação entre as variaveis do nosso arquivo
.env com a do nosso envSchema e dispara um erro (throw new Error())
caso alguma das variaveis não passem na validação.


o safeParse() diferente do parse() não dispara um erro diretamente.

## Validação das variáveis de ambiente


## Validação das requisições das rotas




# Requisitos Funcionais - RF
[x] O usuário deve poder criar uma nova transação.
[x] O usuário deve poder obter um resumo da sua conta.
[x] O usuário deve poder listar todas transações que já ocorreram.
[x] O usuário deve poder visualizar uma transação única.
 

# Regras de Negócio - RN
[x] A transação pode ser do tipo crédito que somará ao valor total ou débito subtrairá.
[] Deve ser possível identificarmos o usuário entre as requisições.
[] O usuário só pode visualizar transações o qual ele criou.

# Requisitos Não Funcionais - RNF
[]


# @types
Criamos essa pasta para sobrescrever tipagens de outras bibliotecas.

Utilizamos essa pasta para criar a tipagem das tabelas do nosso banco de dados. Logo, definimos as tabelas existentes ('transactions') e as colunas de cada tabela.

```
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
```


# Testes automatizados

