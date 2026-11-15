# DIAGNÓSTICO TÉCNICO DAS REFERÊNCIAS — FROTAONE

**Escopo:** análise documental e visual; nenhuma implementação foi realizada.
**Referências:** `Captura de tela 2026-11-08 164843.pdf` (93 páginas com capturas rasterizadas) e `relatorio de manutencao.pdf` (2 páginas, PDF vetorial A4 retrato).
**Regra de interpretação:** **[V] visualmente confirmado**; **[I] inferência funcional coerente**; **[P] proposta de engenharia**, ainda não comprovada; **[D] dúvida a validar**. Somente [V] deve ser tratado como comportamento definitivamente exigido pela referência.

## 1. Resultado da inspeção

**Divergência documental:** o pedido menciona nove capturas de tela, mas o arquivo disponibilizado reúne **93 páginas com capturas**. Não são 93 módulos únicos: há sequências de scroll, estados de menus e modais, temas claro/escuro e algumas repetições. O segundo PDF é um relatório gerado pelo próprio sistema e deve integrar o escopo de impressão/exportação. Foram examinadas visualmente todas as 93 páginas em contato sequencial, com ampliação dos fluxos mais importantes, e ambas as páginas do relatório.

**Produto identificado [V]:** painel web **FrotaOne**, utilizado no contexto de uma organização de gestão/locação de veículos (exemplo visível: **FF Veículos**). O sistema combina gestão de frota, motoristas, locações, vistorias, manutenções, comunicação, colaboradores, notificações, assinatura e módulo financeiro completo. A interface original está em português do Brasil.

**Limites do material:** páginas são imagens, sem HTML/CSS, árvore DOM, fonte instalada, especificação API, banco de dados, logs, histórico de validações ou vídeo de interação. Valores de cor, dimensões e fontes são aproximações visuais; as ações cujos resultados não foram capturados devem ser descritas como comportamento proposto. O navegador/abas não integra o produto a reconstruir. Algumas capturas representam o mesmo estado com lateral expandida/recolhida ou scroll diferente. Apenas desktop está comprovado; responsividade deve ser projetada sem inventar versão visual supostamente observada.

## 2. Mapa de módulos e cobertura de páginas

| Área | Páginas da captura | Evidência principal |
|---|---|---|
| Contas a pagar | 1–4 | Listagem, filtros, excluir, criar conta, recorrência e pagamento |
| Relatórios financeiros por veículo/cliente e DRE | 5–10 | KPIs, linha temporal, comparação de frota, clientes, DRE mensal e PDF |
| Colaboradores e convites | 11–13 | Estado vazio, abas, limites de plano e modal de permissões |
| Painel inicial | 14–15 e 20–21 | KPI, gráfico, rankings, modo claro e escuro |
| Perfil, assinatura e cobrança | 16–19, 22 | Edição, senha, notificações, plano, faturas, menu do usuário |
| Alertas e notificações | 23–26 | Dropdown, filtros, severidade, notificações lidas/não lidas |
| Motoristas — detalhes/edição | 27–31 | Perfil, endereço, CNH, arquivos e edição |
| Disparo de mensagens | 32–33 | Templates, tokens, prévia e seleção de destinatários |
| Veículos | 34–43 e 76–77 | Consulta, ações, detalhes, edição, upload, cadastro e importação |
| Manutenções | 44–54 | Cards, histórico, anexos, wizard em 3 passos e relatório |
| Vistorias | 55–61 | Acompanhamento, histórico, galerias, modal de solicitação e configuração de fotos |
| Motoristas — listagem/cadastro | 62–65 e 78–79 | Listagem, menu e cadastro completo |
| Locações | 66–75 | Listagem, ações, cadastro, edição, financeiras, vistoria e contrato |
| Dashboard financeiro | 80–82 e 87 | KPIs, gráficos, gastos por categoria, caixa, períodos |
| Contas bancárias | 83–86 e 88–90 | Contas, extrato, movimentações, criar/editar e lançamento manual |
| Contas a receber | 91–93 | Saldo pendente, pesquisa, filtros, vencimentos e pagar |
| Relatório de manutenção impresso | PDF adicional, páginas 1–2 | A4, identificação, resumo, consolidação e detalhamento de OS |

## 3. Catálogo página a página — 93 capturas

A descrição abaixo explicita os estados visuais em vez de contar como telas únicas os cortes de rolagem.

| Pág. | Tela/estado identificado [V] |
|---:|---|
| 1 | **Contas a Pagar**: busca, filtros status/categoria/ordenação, tabela com fornecedor, valor, vencimento, status, ações e botão “Nova Conta a Pagar”. |
| 2 | Menu de três pontos de uma despesa, exibindo ação destrutiva **Excluir**. |
| 3 | **Nova Conta a Pagar**, início do formulário: categoria, “+ Nova categoria”, veículo opcional, valor, vencimento, descrição, fornecedor e CNPJ. |
| 4 | Continuação do formulário: URL de documento/nota fiscal, “Conta Recorrente”, “Já foi paga”, observações, cancelar e criar. |
| 5 | **Relatório por veículo**, filtros de veículo/mês, KPIs lucro líquido, receitas, despesas, veículos ativos e gráfico temporal. |
| 6 | Continuação do relatório: tabela **Lucro por veículo**, valores verdes/vermelhos, margem com barra visual. |
| 7 | Dropdown **Todos os veículos** aberto sobre gráfico de evolução do lucro, seleção individual. |
| 8 | **Relatório por Cliente**: busca nome/CPF, total pago, em aberto, locações, status. |
| 9 | **DRE Mensal**: seletor de mês/ano, atualizar, baixar PDF; cards e linhas de resultado. |
| 10 | Continuação DRE: receitas, custos, despesas, EBITDA/resultado, previsão e nota explicativa. |
| 11 | **Colaboradores**: banner limite “3 colaboradores grátis”, valor adicional mensal, abas Colaboradores/Convites e estado vazio. |
| 12 | Modal **Adicionar colaborador**: nome/e-mail/telefone; permissões por módulo, checkboxes, “Selecionar tudo”, “Limpar tudo” e subtipo “Ações”. |
| 13 | Aba **Convites**, estado vazio e explicação do ciclo de convite. |
| 14 | **Dashboard**, tema claro, cards de total de veículos, motoristas ativos, contratos ativos, receita mensal, curva de receita. |
| 15 | Dashboard, gráfico com tooltip e listas Top Veículos Lucrativos / Top Veículos com Mais Despesas. |
| 16 | **Meu Perfil**: dados pessoais, função, organização, notificações do navegador e alteração de senha. |
| 17 | Continuação Meu Perfil: controles de senha e botão Alterar senha. |
| 18 | **Assinatura**: status, produto, ciclo trimestral, próxima cobrança, upgrade/cancelamento, extrato do período. |
| 19 | **Histórico de Cobranças**: faturas pagas/pendentes, link para pagamento por boleto/PIX, ver fatura, atualizar. |
| 20 | Dashboard em **tema escuro**, cards e curva com contraste invertido. |
| 21 | Dashboard escuro, tooltip, rankings coloridos e gráficos. |
| 22 | Menu de avatar: nome/e-mail/organização, Meu Perfil, Minha Assinatura, Upgrade de plano, Sair. |
| 23 | Dropdown de notificações com lista rolável, indicadores vermelhos, tempo relativo e “Ver todas”. |
| 24 | **Notificações**, tema escuro, filtros por assunto e Todos/Não lidas, marcar todas como lidas, cartões críticos. |
| 25 | Dropdown notificações, item em hover/selecionado. |
| 26 | Notificações, vista após interação com leitura/seleção. |
| 27 | **Detalhes do Motorista**, tema escuro: nome, dados pessoais, CPF, RG, nascimento, contato, botão Editar. |
| 28 | Continuação motorista: endereço, número/categoria/validade CNH, documentos clicáveis. |
| 29 | Continuação motorista: informações do sistema, data de cadastro e status Ativo. |
| 30 | **Editar Motorista**: formulário em colunas Informações Pessoais / Endereço. |
| 31 | Continuação edição: upload de documento de identificação e comprovante de endereço, Salvar Alterações. |
| 32 | **Disparo de Mensagens**: templates selecionáveis, novo/salvar/excluir, editor com variáveis e prévia WhatsApp. |
| 33 | Continuação disparo: lista pesquisável de destinatários, caixas marcadas, contador, desmarcar todos, enviar. |
| 34 | **Consulta de Veículos**, sidebar expandida, filtro por placa/marca/cor, tabela com foto, placa, modelo, KM, disponibilidade, preço e data. |
| 35 | Consulta com sidebar recolhida, mesmas colunas e dados. |
| 36 | Menu de ação do veículo: Ver detalhes, Consultar multas, Editar, Excluir. |
| 37 | **Detalhes do Veículo VW GOL MPI**, identificação, RENAVAM, chassi, cidade/UF, hodômetro e status. |
| 38 | **Editar Veículo**: básicas, dados, placa, renavam, chassi, marca/modelo, cor, ano, UF/cidade, odômetro. |
| 39 | Continuação edição: zona upload, foto existente, data e valor da compra, Atualizar Veículo. |
| 40 | Detalhes de outro veículo **FIAT MOBI LIKE**, provando tela parametrizada. |
| 41 | **Novo Veículo**, seções superiores e dados exemplificativos. |
| 42 | Novo Veículo, foto e informações financeiras, botão Cadastrar Veículo. |
| 43 | **Importar Veículos** por planilha XLSX/CSV, arrastar ou clicar e baixar modelo. |
| 44 | **Manutenções**, pesquisa por veículo e grade de cards com total de OS/custo/última, Ver Histórico e + Lançar. |
| 45 | Histórico de manutenções por veículo: três KPIs, tabela OS, tipo, data, peças, total, anexos, status, baixar relatório, nova manutenção. |
| 46 | Menu da OS: Ver detalhes e Excluir. |
| 47 | Popover **Anexos** da OS e opção Visualizar nota fiscal. |
| 48 | **Nova Manutenção**, passo 1 Detalhes: tipo, data, descrição, mão de obra, quilometragem. |
| 49 | Passo 1, continuação: upload nota fiscal OS, observações, Cancelar e Próximo. |
| 50 | Select **Tipo de manutenção** aberto: Corretiva, Preventiva, Garantia. |
| 51 | Passo 2 **Peças/Itens**: nome, código, quantidade, custo unitário, subtotal, fornecedor, adicionar peça. |
| 52 | Passo 2: somatório peças/mão de obra/total, forma de pagamento, conta bancária do pagamento, Anterior/Próximo. |
| 53 | Mesmo passo com viewport/rolagem diferentes; reafirma cobrança em conta cadastrada e nota de débito na conclusão. |
| 54 | Passo 3 **Garantia das Peças** (opcional), sem itens, botão Registrar Manutenção. |
| 55 | **Vistorias**: veículos com fotos, placa, motorista, prazo, status Em dia, Ver vistorias, Solicitar vistoria e busca/filtro. |
| 56 | Histórico de vistorias por veículo, filtros data/status, registros com estados Aprovada/Concluída e acordeão. |
| 57 | Acordeão expandido: KM informada, alerta para verificar foto do odômetro e sequência de fotos. |
| 58 | Galeria de cinco vistas (frente, traseira, lateral esquerda/direita, painel/KM). |
| 59 | Modal Solicitar Vistoria: responsável, WhatsApp, e-mail opcional, data, aviso de envio e fallback por e-mail. |
| 60 | **Configuração de fotos** com sidebar aberta: cinco slots padrão, checkbox Ativo, exclusão. |
| 61 | Configuração de fotos completa, limite de 12 slots ativos, adicionar tipo de foto. |
| 62 | **Consulta de Motoristas**: busca nome/CPF/e-mail/telefone, colunas contato, cidade, status e ações. |
| 63 | Menu de motorista: Editar/Excluir. |
| 64 | **Novo Motorista**: identificação, documentos, CNH, telefone, endereço e CEP. |
| 65 | Novo Motorista, upload documentos e botão Cadastrar Motorista. |
| 66 | **Consulta de Locações**, tabela contrato, veículo, motorista, período, status, valor, data e Nova Locação. |
| 67 | Locações, menu de ação Editar/Excluir. |
| 68 | **Editar Locação**: veículo, motorista, datas, tipo e período de vistoria, dia da vistoria. |
| 69 | Editar Locação, valores semanal/caução, flags primeiro pagamento/caução já recebidos. |
| 70 | Editar Locação, quilometragem permitida, franquia mensal, upload de contrato e observações. |
| 71 | Fim de edição de locação, salvar e cancelar. |
| 72 | **Nova Locação**: veículo/motorista selecionáveis, links de criar ambos, dados básicos. |
| 73 | Nova Locação: datas, periodicidade de vistoria e valores financeiros. |
| 74 | Nova Locação: valores, caução, limites de KM, contrato, observações. |
| 75 | Nova Locação: rodapé, cancelar e Cadastrar Locação. |
| 76 | Novo Veículo, variante/estado com campos preenchidos (repetição contextual). |
| 77 | Novo Veículo, continuação, upload e Cadastrar Veículo. |
| 78 | Novo Motorista, variante com campos preenchidos. |
| 79 | Novo Motorista, uploads e conclusão. |
| 80 | **Dashboard Financeiro**: período, Faturamento, Despesas, Lucro Líquido, Margem; destaques. |
| 81 | Financeiro, gráfico faturamento x despesas e donut despesas por categoria. |
| 82 | Financeiro, ocupação da frota, receita por veículo, caixa e projeção, próximos vencimentos. |
| 83 | **Contas bancárias**: card conta, saldo, tipo, extrato, editar, lançamento manual, nova conta. |
| 84 | Modal Editar conta: nome, instituição, tipo, saldo inicial, data do saldo, padrão, ativa, Salvar. |
| 85 | **Extrato — Conta Principal**: intervalo de datas, Filtrar, CSV, saldos inicial/final e entradas/saídas, tabela. |
| 86 | Continuação extrato: movimentações com origem, entrada/saída e saldo corrido. |
| 87 | Dashboard financeiro, popover de período personalizado com datas inicial/final e Aplicar. |
| 88 | Contas bancárias, sidebar expandida, mesmo card/ações. |
| 89 | Modal **Nova conta bancária**, com mesmos campos relevantes da edição. |
| 90 | Modal **Lançamento manual**, tipo entrada/saída, valor, data, descrição, registrar. |
| 91 | **Contas a Receber**: valor pendente total, busca, filtros status/método/ordenação, tabela de clientes. |
| 92 | Continuação da tabela: contratos, totais, pendentes, vencimento, atraso, status Vencida. |
| 93 | Menu de ações em título a receber com opção **Pagar**. |

## 4. Linguagem visual transversal [V]

- **Estrutura:** aplicativo desktop com sidebar azul vertical fixa, colapsável (estado ampliado com logo/nomes e estado compacto somente com ícones); header branco superior fixo, área principal cinza-claríssima; breadcrumb “Voltar” nas telas de detalhe/criação.
- **Hierarquia:** faixa de título com leve gradiente azul/cinza, filete azul vertical à esquerda, etiqueta de categoria em caixa alta e espaçamento entre letras, H1 escuro, legenda cinza; botões primários azuis geralmente à direita.
- **Superfícies:** cards e tabelas brancos, cantos pouco arredondados, bordas cinza muito claras e sombras discretas; muitas divisões de linha horizontal. Formulários em uma ou duas colunas; seções com títulos próprios.
- **Cor:** sidebar azul profundo próximo de `#1e3a8a`, seleção azul vivo próximo de `#1d4ed8`, primário próximo de `#3b82f6`, fundo próximo de `#f8fafc`, borda próxima de `#e5e7eb`, texto principal próximo de `#111827`, secundário próximo de `#64748b`; positivo verde, negativo/perigo vermelho, alerta âmbar. São estimativas, não amostras CSS oficiais.
- **Texto:** fonte sem serifa de interface, aparentemente próxima de Inter; tamanhos típicos inferidos: H1 ~24–30 px, H2 ~18–22 px, corpo ~14–16 px, legenda ~12–14 px. A fonte real não é dedutível conclusivamente.
- **Dimensões observacionais:** capturas raster em torno de 1917×900–970 px, incluindo muitas vezes barra do navegador. A largura visual da sidebar varia aproximadamente entre 88 px compacta e 280–300 px expandida; cabeçalho ~70–80 px. Não codificar tais medidas como “exatas” antes de aferição no navegador de referência.
- **Componentes repetidos:** sidebar, header, menu de avatar, notificações, title banner, search input, select, date picker, currency input, upload/dropzone, KPI card, table, badge de status, overflow menu, modal, tabs, wizard, accordion, toast/feedback a especificar, chart de linha/barras/donut, galeria, botões.
- **Tema escuro [V]:** aparece em Dashboard, Notificações e telas de Motoristas (p. 20–31); não é suficiente afirmar que todas as rotas foram registradas no tema escuro. Deve-se implementar tema global mantendo consistência.
- **Responsividade [P]:** adaptar sidebar para drawer móvel, filtros para coluna e tabelas com rolagem horizontal/versão acessível, preservando conteúdo e ações; nenhum print móvel foi apresentado.

## 5. Fluxos e relacionamentos [V]/[I]

1. **Veículo** → Detalhes/Editar/Excluir/Multas; Veículo → Manutenções → Histórico → Nova OS → PDF; Veículo → Vistorias → Histórico/Galeria/Solicitação.
2. **Motorista** → Dados e documentos → Editar; motorista associa-se a contrato de locação e solicitações de vistoria; tem alertas da CNH.
3. **Locação** associa veículo e motorista, período, regras de vistoria, valor recorrente, caução, KM, contrato. **[I]** Sua criação gera agenda de cobrança e condiciona status de disponibilidade do veículo. Os comprovantes exibem ligação entre locações e contas a receber.
4. **Manutenção** relaciona-se ao veículo, ordem, itens de peças, fornecedor, notas fiscais, mão de obra, pagamento/conta bancária e relatório PDF. **[V]** no formulário de pagamento há orientação de debitar a conta quando a manutenção for concluída.
5. **Conta bancária** consolida entradas/saídas automáticas e manuais; extrato mostra origem, saldo corrido e exportação CSV.
6. **Financeiro** consolida locações/recebíveis, despesas/pagáveis e contas bancárias; dashboards, DRE e relatórios por entidade usam agregações. A fórmula exata de todos os indicadores demanda validação **[D]**.
7. **Colaboradores** recebem convites com permissões por módulo/ação. Plano e assinatura condicionam limites e cobranças. Política de convite e billing backend **[D]**.
8. **Notificações** são geradas por vencimento CNH, manutenção e locação, com filtros e marcação como lida; o disparo de mensagens usa templates com variáveis e múltiplos destinatários.

## 6. Casos e dados verificáveis do relatório de manutenção [V]

O PDF complementar é uma referência **visual E funcional para o gerador de relatórios**, não apenas um modelo de texto. Pág. 1: logotipo FrotaOne à esquerda, “FF Veículos / Relatório de manutenções” à direita, título, placa/modelo e data, identificação em grade, quadro Resumo, Por tipo, Por situação, Histórico consolidado e início do detalhamento. Pág. 2: continuação da primeira OS, segunda OS, nota de exclusão de canceladas, rodapé e paginação 2/2.

- Veículo **EBR7G53**, **VW GOL MPI**, **2023**, **BRANCA**, **181.652 km**, situação **Locado**, identificação Renavam/chassi visíveis.
- Data de emissão **08/11/2026, 16:29**; organização FF Veículos.
- OS **WO-2026-0013**: corretiva, concluída, serviço **TROCA DE DISCO DE FREIO E PASTILHA**, abertura **13/10/2026**, execução e encerramento **12/10/2026**, KM **178.209**, mão de obra **R$ 250,00**, peça **R$ 369,70** (1 unidade; **MERCADO CAR**), total **R$ 619,70**, pagamento **À vista**.
- OS **WO-2026-0006**: corretiva, concluída, serviço **TROCA DE ÓLEO E FILTRO DE ÓLEO**, abertura/execução/encerramento **05/09/2026**, KM não informado, mão de obra **R$ 0,00**, peça **R$ 211,50** (1 unidade; **ESTAÇÃO DO ÓLEO**), total **R$ 211,50**, pagamento **À vista**.
- **Resumo consistente:** 2 OS, 2 concluídas, 0 abertas, 0 canceladas; mão de obra 250,00; peças 581,20; total 831,20; médio 415,60. Por tipo e situação somam 2 / R$ 831,20.
- **Regra [V]:** “Custos de ordens canceladas ficam fora dos totais. Valores refletem o cadastro no momento da emissão.” Documento “para apresentação ao cliente”.
- **Questão a preservar [D]:** a OS 0013 mostra **abertura posterior à execução/encerramento**. A referência deve ser preservada como dado histórico; para novos cadastros deve-se discutir regra de validação de cronologia, sem corrigir o PDF silenciosamente.

## 7. Inventário de entidades e campos observados

| Entidade | Atributos visualmente sustentados (não exaustivo) |
|---|---|
| Organização | Nome, plano, cobrança, limites, colaboradores, configurações |
| Usuário/colaborador | Nome, e-mail, telefone, função, permissões, vínculo/invite, senha |
| Veículo | Placa, marca, modelo, ano, cor, Renavam, chassi, UF/cidade de emplacamento, KM, valor/data de compra, fotos, status |
| Motorista | Nome, CPF, RG, nascimento, e-mail, telefone/WhatsApp, CNH número/categoria/validade, endereço/CEP/cidade/UF, foto documentos, status |
| Locação | Número contrato, veículo, motorista, datas, modalidade, valor periódico, caução, flags de antecipação, KM/franquia, dias de vistoria, contrato, observações, status |
| Vistoria | Veículo, motorista/responsável, data/prazo, data agendada, status, KM informado, conjunto de fotos, alerta odômetro |
| Foto solicitada | Rótulo do slot, chave do tipo (FRONT, REAR etc.), ativo, default, limite de 12 |
| Manutenção/OS | Número OS, veículo, tipo, situação, data de realização/abertura/encerramento, descrição, KM, mão de obra, anexos, peças/itens/fornecedor/garantias, pagamento, conta, total |
| Conta a pagar | Descrição, categoria, veículo opcional, valor, vencimento, fornecedor/CNPJ, URL documento, recorrência, status, pagamento, observações |
| Conta a receber | Cliente, contrato, descrição, total, pendente, método, vencimento, situação, pagamento |
| Conta bancária | Nome, instituição, tipo, saldo inicial/data, saldo atual, padrão, ativa |
| Movimento financeiro | Conta, tipo entrada/saída, valor, data, descrição, origem, saldo progressivo |
| Notificação | Assunto, texto, entidade relacionada, criticidade, data, lida/não lida |
| Disparo | Template, tokens nome do motorista/empresa, prévia, destinatários, status/histórico |
| Assinatura/fatura | Plano/produto, período, ciclo, preço por veículo, situação, vencimento, link de pagamento, faturas |

## 8. Dúvidas e decisões abertas — não transformar em fatos confirmados

| ID | Questão [D] | Conduta [P] até confirmação |
|---|---|---|
| D01 | O material são 93 estados ou deveriam ser selecionadas somente 9 telas prioritárias? | Cobrir os 93 estados, agrupar por fluxos e conservar o índice. |
| D02 | Código/fonte exatos, tokens CSS, ícones oficiais e ativos da marca não foram fornecidos isoladamente. | Extrair/solicitar logo autorizado e medir pixels; adotar tokens parametrizáveis com indicação de aproximação. |
| D03 | Telas de login, recuperação de senha, convite aceito, checkout, pagamentos e multas não aparecem. | Projetar soluções mínimas seguras, marcadas como propostas. Não inventar telas visuais equivalentes às referências. |
| D04 | Não há backend/API/schema/autorização formal. | Propor API REST, multi-tenant, RBAC e MongoDB; validar ao implementar. |
| D05 | Lógica precisa de status de contrato, conclusão/cancelamento OS, vistoria e cálculo de lucro/DRE não é integralmente visível. | Documentar máquinas de estado e fórmulas propostas; validar com testes e exemplos. |
| D06 | Conversa WhatsApp, e-mail fallback e pagamentos boleto/PIX exigem provedores externos e credenciais. | Interfaces/adaptadores, sandbox e estados assíncronos; não simular envio bem-sucedido. |
| D07 | Não existem capturas mobile/tablet. | Desenho responsivo sem suprimir colunas/dados; comparar fidelidade primária em desktop. |
| D08 | Notificações de “vence hoje” e datas indicadas parecem incongruentes em algumas capturas. | Usar timestamps/horário real em dados novos; preservar snapshots apenas como exemplos históricos. |
| D09 | Alguma captura mostra detalhes de status em inglês como RENTED, outras em português Locado. | Exibir português-BR; mapear enum persistido de modo uniforme. |
| D10 | Contraste de cadastro x relatório (data de compra “—”, mas formulário com valor preenchido). | Fixar fonte da verdade por campo, não assumir equivalência entre todas as capturas de estados distintos. |
| D11 | Política de exclusão definitiva, restauração e auditoria não é evidente. | Preferir exclusão lógica para entidades financeiras/contratuais, autorização e confirmação. |
| D12 | Qualidade/quantidade de anexos, tamanho máximo, retenção e armazenamento não são demonstrados. | Definir limites razoáveis e armazenamento externo; documentar configuração. |
| D13 | Índices financeiros exibem flutuações e comparação com mês anterior; origem e apuração não podem ser recuperadas por screenshots. | Documentar fórmulas e estados sem referência, validar antes da homologação. |
| D14 | Não há design assets do logo e fotos, apenas imagens renderizadas. | Preferir assets fornecidos/licenciados, não substituir silenciosamente. |

## 9. Critérios de auditoria visual e funcional recomendados

- **[V]** Todas as páginas 1–93 devem estar representadas por uma rota, seção, viewport, estado de interação ou variação de tema; nenhuma deve ser descartada por repetição sem anotação.
- **[V]** Com uma janela desktop aproximada às capturas, reproduzir a barra lateral expandida/compacta, cabeçalho, title banner, grid, tabelas, modais, menus contextuais, gráficos, barras, badges, seções, uploads e rótulos portugueses.
- **[P]** Capturas de regressão nas mesmas dimensões, comparação lado a lado e diff visual; definir limites mensuráveis por região, com revisão humana para conteúdo dinâmico.
- **[P]** Testes E2E para cadastrar/editar veículo e motorista; cadastrar locação e recebíveis; solicitações de vistoria e anexos; wizard manutenção e relatório; pagar contas e conferir extrato; filtrar relatórios; convites e autorizações.
- **[V]** Teste numérico do relatório fornecido: 250,00 + 581,20 = 831,20; 619,70 + 211,50 = 831,20; média 415,60; canceladas não integram totais.
- **[P]** Ações devem persistir em MongoDB e refletir imediatamente em dashboards, tabelas, notificações e relatórios. Estados pendente/carregando/vazio/erro/sucesso/confirmar exclusão são necessários mas nem todos estão fotografados.
- **[P]** Não afirmar integração real com WhatsApp, e-mail, PIX ou assinatura antes de configurar provedor e provar um envio/pagamento em ambiente próprio.

## 10. Conclusão do diagnóstico

As imagens caracterizam **um ERP leve de frota/locação com módulos financeiros integrados**, não uma landing page nem um conjunto de 9 páginas independentes. A construção fiel exige uma aplicação multiusuário/multiorganização, composição de rotas e estados, dados persistidos e agregações. A documentação de desenvolvimento deve considerar o relatório PDF complementar uma referência obrigatória de saída. O material confirma **aparência e alguns estados**; não comprova processos backend nem todos os resultados de cliques. A especificação de implementação deve conservar essa distinção em todas as escolhas.
