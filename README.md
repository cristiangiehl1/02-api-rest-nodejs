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
- Unitários: testem exclusivamente uma unidade da sua aplicação (uma pequena parte da aplicação de forma completamente isolada).
- Integração: comunicação entre duas ou mais unidades.
- E2E: simulam um usuário operando na nossa aplicação.

Olhar - Pirâmides de testes.

base da pirâmide = testes unitários
intermédio da pirâmide = testes de integração
topo da pirâmide = testes E2E


## E2E (ponta a ponta)
Não dependem de nenhuma tecnologia, não dependem de arquitetura de software.

São testes extremamente lentos comparado com os outros testes.

- front-end: abre a página de login, digite o texto diego@rocketseat.com.br no campo com ID email, clique no botão.
- back-end: chamadas HTTP, Websockets. 

# Vitest (framework)

$ npm i vitest -D

O Vitest é um framework de teste unitário JavaScript/TypeScript moderno e fácil de usar. Ele é baseado no Jest, mas oferece recursos adicionais, como: Testes síncronos e assíncronos: Adequado para testar código que usa APIs ou outras dependências assíncronas.

Os arquivos devem terminar com .spec.ts ou test.ts

Os testes são compostos por nome do teste, o teste em si e a validação do teste (exepct()).

Rodar os testes: 

$ npx vitest

## Supertest
Para fazer as requisições HTTP para o servidor, vamos utilziar uma ferramenta chamada supertest, pois não queremos que o nossos testes rodem na mesma porta que o nossa api. O supertest nos permite fazer as requisições para o nosso back-end sem precisar colocar ela no ar.

$ npm i supertest -D 

O supertest não foi desenvolvido com a tipagem para TS, por isso devemos instalar um outro pacote com os seus tipos.

$ npm i --save-dev @types/supertest

## Resolvendo problema com o plugin do Fastify
Para ter certeza que todos os plugins do Fastify foram lidos antes de os testes iniciarem, devemos utilizar um beforeAll().

```
beforeAll(async () => {
  await app.ready()
})
```

Também é importante limpar a aplicação da memória, para isso usamos o afterAll().

```
afterAll(async () => {
  await app.close()
})
```

## Algumas funções úteis do vitest

- it.skip() => pula o teste.
- it.todo() => o vitest vai avisar que tem um teste para ser feito.
- it.only() => vai rodar somente aquele teste.

## Banco de dados para testes
Você precisa criar um banco específico para os testes, caso contrário todas as chamadas HTTP que você fizer afetarão o banco de dados da API.

Criar um novo arquivo .env.test e colocar as variaveis de ambiente de testes.

**NÃO É PRECISO DEFINIR A VARIAVEL DE AMBIENTE NODE_ENV='test', POIS ELA É PREENCHIDA AUTOMATICAMENTE PELO VISTEST OU JEST.**


Alterar o nosso arquivo de validação das variaveis de ambiente com o zod para ler dinâmicamente quando estamos em ambiente de testes ou outro ambiente.


```
import { config } from 'dotenv'

if (process.env.NODE_ENV === 'test') {
  config({ path: '.env.test' })
} else {
  config()
}
```

Assim criamos o banco de dados para os testes, mas as nossas migrations não foram geradas para esse banco. Logo, não temos a table 'transactions' no nosso novo banco de dados. Para isso, vamos ajustar os nossos testes da seguinte forma.

```
import { execSync } from 'node:child_process'

beforeEach(() => {
  execSync('npm run knex migrate:rollback --all')

  execSync('npm run knex migrate:latest')
})
```
O exceSync permite executarmos linhas de comando no terminal.

Dessa forma criamos testes que são isolados, sempre limpandos o banco de dados e executando ele do zero.

# Deploy
Nenhuma plataforma de deploy de Node consegue ler código em typescript.

Precisamos converter nosso código para javascript. Para isso precisamos instalar uma ferramenta chamada tsup.

$ npm i tsup -D

Para rodar o código podemos criar um script

```
"build": "tsup src --out-dir build"
```

Isso gerará uma pasta com o nome build com todo o nosso código convertido.

Para ter certeza que está funcionando tem que ser possível rodar o servidor

$ node build/server.js


Devemos também ajustar o tipo de banco de dados que a nossa aplicação aceita. Para isso vamos configurar uma nova variavel ambiente. O render só aceita postgres.

```
const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('production'),
  DATABASE_URL: z.string(),
  DATABASE_CLIENT: z.enum(['sqlite', 'pg']),
  PORT: z.number().default(3333),
})
```

Além disso, precisamos instalar o pg.

$ npm i pg

Como estamos utilizando o Knex para fazer a conexão com o banco de dados, temos que ajustar a connection, que muda de um banco de dados para o outro.

```
export const config: Knex.Config = {
  client: env.DATABASE_CLIENT,
  connection:
    env.DATABASE_CLIENT === 'sqlite'
      ? {
          filename: env.DATABASE_URL,
        }
      : env.DATABASE_URL,
  useNullAsDefault: true,
  migrations: {
    extension: 'ts',
    directory: './db/migrations',
  },
}
```

Passar também uma config no nosso package.json para ajustar a versão do node que o knex usa.

```
"engines": {
  "node": ">= 18"
},
```

# Render
Para o nosso web service iniciar, precisamos colocar a linha de comando completa.

$ npm install && npm run knex -- migrate:latest && npm run build

Além disso, devemos adicionar as variaveis de ambiente no render.