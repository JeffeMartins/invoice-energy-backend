# Contexto da modernização

Repositório: `invoice-energy-backend`. Revisão em 28/10/2026. O objetivo é tornar o clone reproduzível e o comportamento compreensível em uma entrevista técnica, preservando o contexto histórico de exercício/protótipo.

## Decisões e validação

- Prisma 7 com adapter PostgreSQL e cliente compartilhado; geração e migrations explícitas.
- Multer atualizado, limite de 10 MiB, validação de tipo e assinatura `%PDF-` no parser.
- Diretório de upload único e validação de nomes, evitando escapar da pasta ao consultar PDF.
- Leitura de arquivo assíncrona e liberação do parser PDF.
- Correção do cálculo de consumo: somar quantidades em kWh, não valores em reais; parsing de valores brasileiros considera separador de milhar.
- Tipos de domínio sem `number | boolean | any`, remoção de `dist` do Git e testes de domínio/nomes de arquivo.


Consulte os scripts reais em `package.json` (ou nos módulos do monorepo). Build, teste unitário e teste com serviços externos são evidências diferentes. A CI não valida credenciais de terceiros nem garante comportamento em produção. O README informa dependências externas e funcionalidades ainda não implementadas.

## Segurança de configurações antigas

Configurações locais e segredos foram retirados da versão atual quando presentes. Isso não remove conteúdo de commits antigos. Se algum segredo histórico ainda estiver ativo, revogue-o no provedor e gere outro; não reutilize credenciais publicadas. A revisão preserva o histórico Git e não faz force push.
