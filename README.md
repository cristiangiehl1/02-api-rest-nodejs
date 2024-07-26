# Fastiy

## Por que Fastify e não o Express?

- O Fastify tem muito mais updates e um time muito mais ativo do que o Express.
- Uma das opções mais populares do Node.js.
- Tem muita similiaridade com o Express.
- É mais performático e está mais pronto para lidar com as novas funcionalidades do javascript (ex.: typescript). Além disso, está mais preparado para lidar com o assíncronismo do JS.

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
