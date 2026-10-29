# API de faturas de energia

API TypeScript/Express/PostgreSQL para receber PDFs de faturas, extrair dados e consultar indicadores de consumo e economia. Projeto originalmente desenvolvido em 2024.

[![CI](https://github.com/JeffeMartins/invoice-energy-backend/actions/workflows/ci.yml/badge.svg)](https://github.com/JeffeMartins/invoice-energy-backend/actions/workflows/ci.yml)

## Melhorias de engenharia

- Prisma 7 com adapter PostgreSQL e cliente compartilhado; geração e migrations explícitas.
- Multer atualizado, limite de 10 MiB, validação de tipo e assinatura `%PDF-` no parser.
- Diretório de upload único e validação de nomes, evitando escapar da pasta ao consultar PDF.
- Leitura de arquivo assíncrona e liberação do parser PDF.
- Correção do cálculo de consumo: somar quantidades em kWh, não valores em reais; parsing de valores brasileiros considera separador de milhar.
- Tipos de domínio sem `number | boolean | any`, remoção de `dist` do Git e testes de domínio/nomes de arquivo.

## Executar localmente

Pré-requisitos: Node.js 24 LTS e npm; Docker Compose v2 para os serviços que usam banco.

```sh
node scripts/setup-env.mjs
docker compose up -d --build
```

API em `http://localhost:3001`. O Compose sobe PostgreSQL, aplica migrations em um serviço de inicialização e só depois inicia a API. O banco não é publicado no host; PDFs e dados usam volumes separados.

Rotas: `GET /health`, `GET /invoices`, `POST /upload` (multipart `file`), `GET /view-pdf/:filename`, `GET /getVariablesOfInterest`, `GET /allNumberClient`.

```sh
curl -F "file=@fatura-ficticia.pdf" http://localhost:3001/upload
```

O parser reconhece o layout textual esperado pelo exercício; não é OCR universal. Uploads não incluem antivírus e a aplicação ainda não possui autenticação de usuários, portanto use somente dados fictícios e ambiente local. O health verifica a aplicação, não todas as dependências. A prova automatizada cobre domínio e restrição de nomes; teste PDFs autorizados do layout esperado para validar extração real.

Desenvolvimento: `npm ci`, `npm run build`, `npm test`, `npm run migrate`, `npm run dev`, com um PostgreSQL acessível pelo `DATABASE_URL`. O contrato usa floats para compatibilidade; processamento financeiro que exija arredondamento contábil deve migrar para decimal/centavos com migration de dados.

## Qualidade e limites da evidência

As mudanças preservam a proposta do exercício e corrigem problemas observados no código. A CI usa Node 24 e `npm ci`, executa o build quando disponível e os testes existentes. O lockfile é versionado; dependências e pastas de build não são. Dependabot acompanha atualizações semanais. Não há promessa de cobertura total, auditoria completa de segurança ou capacidade de produção.

Não publique `.env`, cookies, tokens ou dados reais de clientes. Antes de expor a aplicação à internet, revise autenticação/autorização, TLS, limites de chamadas, logs e backups conforme o domínio. Os exemplos são para execução local. Use `docker compose down` para parar os containers; volumes persistem e `down -v` apaga seus dados.
