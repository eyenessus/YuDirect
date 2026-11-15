# DIAGNÓSTICO TÉCNICO DAS REFERÊNCIAS — FROTAONE

**Fontes exclusivamente visuais:** `Captura de tela 2026-11-08 164843(1).pdf` (93 páginas) e `relatorio de manutencao(1).pdf` (2 páginas). Data exibida nas referências: novembro de 2026. **Escopo desta fase: análise e especificação, sem implementação.**

## 1. Nota de integridade do material

A solicitação menciona **9 capturas de tela**, porém o documento principal enviado contém efetivamente **93 páginas**, cada qual com uma captura, recorte, rolagem ou estado de interface. Algumas páginas mostram a mesma rota em posições de rolagem diferentes ou com menus/modais abertos. O segundo arquivo é um relatório PDF de manutenção de 2 páginas. Nenhuma dessas 95 páginas foi descartada da análise. Elas não significam 93 rotas distintas.

Legendas de evidência: **[O] observável diretamente na imagem; [I] inferência coerente, não validada; [P] pendência sem comprovação visual; [R] recomendação técnica, não requisito original.**

O PDF é uma referência rasterizada: textos muito pequenos, dimensões CSS exatas, família de fonte, códigos hexadecimais originais, lógica de validação e comportamento de serviços externos **não podem ser recuperados com precisão absoluta** apenas da imagem. A calibração deverá ser feita por comparação visual contínua. O navegador, sua barra de endereço e as margens brancas adicionadas ao PDF não fazem parte da aplicação a reconstruir.

## 2. Identidade, arquitetura da informação e aparência

- **[O] Marca:** FrotaOne; organização exibida: FF Veículos. Logotipo branco sobre navegação lateral azul, ora menu expandido com rótulos, ora colapsado com ícones.
- **[O] Organização da aplicação:** shell autenticado com navegação lateral fixa, barra superior com alternância de tema, sino de notificações e avatar circular do usuário; área central rolável. Rodapé lateral com `Reportar bug` e/ou ícone de configurações.
- **[O] Entradas principais de navegação:** Painel; Notificações; Veículos (Consultar, Cadastrar, Importar); Manutenções; Vistorias (Acompanhar, Configurações); Motoristas; Locações (Consultar, Cadastrar); Financeiro (Dashboard, Contas bancárias, Contas a Receber, Contas a Pagar, Relatório por Veículo, Relatório por Cliente, DRE Mensal); Colaboradores. Menu de avatar: Meu Perfil, Minha Assinatura, Upgrade de plano, Sair. Tela de Disparo de Mensagens acessível no contexto de Notificações.
- **[O] Tema claro:** sidebar azul escuro, fundo principal cinza muito claro, cartões brancos, títulos quase pretos, azul para botões principais e seleção ativa. Fundo dominante amostrado da própria captura: aproximadamente `#F9FAFB`; sidebar `#1E3A8A`. Tema escuro: área base aproximadamente `#111827`, cartões aproximadamente `#020817`, sidebar permanece azul escuro. São aproximações, não CSS original.
- **[O] Padrões de UI:** cabeçalho de página com etiqueta de categoria em caixa alta, faixa horizontal azul clara e barra vertical de destaque à esquerda; título e subtítulo; ações de página alinhadas à direita; cartões com bordas tênues e arredondamento pequeno; tabelas com divisórias leves; badges verdes (ativo/concluído/aprovado), azuis (locado/pago/cancelado em alguns contextos) e vermelhos (vencido/crítico/erro). Valores monetários BRL e datas DD/MM/AAAA.
- **[O] Telas em modo claro e escuro:** evidência de alternância de tema; é necessário suportar ambos, inclusive modais, popovers, gráficos, hover, tabelas e arquivos de imagem.
- **[O] Largura capturada:** imagens em torno de 1910–1917 pixels de largura, com alturas variáveis, inseridas em PDF A4 paisagem. A aplicação exibida tem navegação contraída de aproximadamente 75–90 px ou expandida de aproximadamente 230–260 px na escala da captura; essas faixas **não são dimensões CSS confirmadas**.
- **[P] Fonte exata, espaçamentos e breakpoint original:** não recuperáveis com rigor da imagem; definir design tokens aproximados e calibrar com sobreposição pixel a pixel, preservando sobretudo proporções e densidade.

## 3. Inventário INDIVIDUAL das 93 capturas

| Pág. | Tela/estado visual e evidência observável |
|---:|---|
| 01 | Financeiro → **Contas a Pagar**: título, nova conta, busca por descrição/fornecedor, filtros de status/categoria/ordenação, tabela de despesas, badge Pago e menu `⋮`. |
| 02 | Mesma tabela com menu contextual aberto: ação **Excluir** em vermelho. |
| 03 | **Nova Conta a Pagar**: cabeçalho/voltar; categoria, `+ Nova categoria`, veículo opcional, valor, vencimento, descrição, nome/CNPJ do fornecedor. |
| 04 | Continuação do formulário: URL de documento/nota, recorrência mensal, já foi paga, observações, Cancelar/Criar Conta a Pagar. |
| 05 | **Relatório por veículo**: filtro de veículo/período, cards lucro líquido/receitas/despesas/veículos ativos e bloco de evolução do lucro líquido (estado momentaneamente vazio). |
| 06 | Continuação do relatório: tabela **Lucro por veículo** com receita, despesa, lucro, margem e barras proporcionais com cores semânticas. |
| 07 | Filtro de veículos aberto, gráfico anual de linha preenchida e opções contendo placa/modelo/cor. |
| 08 | **Relatório por Cliente**: pesquisa por nome/CPF, colunas cliente, CPF, total pago, em aberto, locações e status. |
| 09 | **DRE Mensal**: seleção de mês/ano, atualizar, baixar PDF, 3 indicadores e demonstração hierárquica do exercício. |
| 10 | Continuação da DRE: deduções, custos da frota, despesas, IRPJ/CSLL, resultado do exercício e nota sobre apuração gerencial. |
| 11 | **Colaboradores**: limite/gratuidade informado, abas Colaboradores/Convites, estado vazio e botão Adicionar colaborador. |
| 12 | Modal **Adicionar colaborador**: nome, email, telefone, matriz de permissões (Dashboard, Veículos, Motoristas, Locações, Vistorias, Manutenções, Financeiro e Notificações), Selecionar tudo/Limpar tudo e itens `Ações`. |
| 13 | Aba **Convites**, estado vazio com ícone de envelope e explicação sobre convites e acompanhamento. |
| 14 | **Dashboard claro**: cards Total de Veículos, Motoristas Ativos, Contratos Ativos, Receita Mensal; gráfico verde Evolução da Receita. |
| 15 | Continuação dashboard: tooltip no gráfico; Top Veículos Lucrativos e Top Veículos com Mais Despesas, classificações e variações percentuais. |
| 16 | **Meu Perfil**: informações pessoais/avatar/organização, botão Editar, Notificações do navegador/Desativar, Segurança para mudança de senha. |
| 17 | Continuação do perfil com campos senha atual/nova/confirmação, instruções de segurança e Alterar senha. |
| 18 | **Assinatura**: plano ativo, pacote de veículos, ciclo trimestral, próxima cobrança, Upgrade/Cancelar; extrato do período com valores. |
| 19 | Continuação assinatura: Histórico de Cobranças, itens atrasado/pago, ações Pagar ou 2ª via (boleto/Pix), Ver fatura, Ver composição, Atualizar. |
| 20 | **Dashboard escuro** completo na porção superior: sidebar azul, fundo navy, cartões pretos e curva verde. |
| 21 | Dashboard escuro inferior: tooltip, rankings e valores verdes/vermelhos. |
| 22 | Popover do **avatar**: nome/email/organização, Meu Perfil, Minha Assinatura, Upgrade e Sair. |
| 23 | Popover de **Notificações**: lista rolável de alertas CNH vencida/vence hoje, motorista, datas, botão Ver todas. |
| 24 | Página **Notificações** escura: abas Todas/Manutenção/CNH/Locações, filtro Todas/Não lidas, marcar todas como lidas, cards críticos. |
| 25 | Detalhe do mesmo popover, item em hover/selecionado. |
| 26 | Outra captura da listagem de notificações, com diferentes estados de foco/rolagem. |
| 27 | **Detalhe do Motorista**: cabeçalho com nome/Editar, Informações Pessoais e Contato em duas colunas. |
| 28 | Detalhe do motorista: Endereço, Carteira de Habilitação, documentos clicáveis e Informações do Sistema. |
| 29 | Continuação ampliada do card de Informações do Sistema: data de cadastro e status Ativo. |
| 30 | **Editar Motorista**: dois painéis de informações pessoais e endereço, documentos e endereço por CEP com Buscar, campos da CNH. |
| 31 | Parte inferior do editar motorista: áreas de upload de RG/CNH e comprovante; botão Salvar Alterações. |
| 32 | **Disparo de Mensagens**: seleção de template, criar/salvar/excluir, editor com variáveis, prévia estilo WhatsApp. |
| 33 | Continuação: destinatários/motoristas em cartões com checkboxes, buscar, selecionados, desmarcar e botão Enviar para 6 motoristas. |
| 34 | **Consulta de Veículos** com sidebar expandida, busca e colunas Imagem, Placa, Veículo, Marca, Cor, KM, Disponibilidade, Preço da compra, Data de Cadastro e Ações. |
| 35 | Mesma lista com sidebar colapsada; fotos reais dos veículos; badges Locado. |
| 36 | Menu de ações do veículo: Ver detalhes, Consultar multas, Editar e Excluir. |
| 37 | **Detalhe VW GOL MPI / EBR7G53**: placa, marca/modelo, ano, cor, chassi, Renavam, UF/município, hodômetro e status; Editar. |
| 38 | **Editar Veículo**: informações básicas (placa, Renavam, chassi, UF, município) e dados do veículo (marca, modelo, ano, cor, hodômetro). |
| 39 | Continuação do editar veículo: dropzone de fotos, foto anexada, data/valor da compra; Cancelar/Atualizar Veículo. |
| 40 | Outro detalhe de veículo (FIAT MOBI LIKE), confirmando que o template de detalhes é reutilizado. |
| 41 | **Novo Veículo**: versão vazia dos dois painéis e início das seções Fotos/Informações Financeiras. |
| 42 | Rodapé do novo veículo: upload e campos financeiros; Cancelar/Cadastrar Veículo. |
| 43 | **Importar Veículos**: drag-and-drop de planilha XLSX/CSV, até 200 veículos, link para baixar planilha modelo. |
| 44 | **Manutenções**: busca e grade de cartões de veículos; placa/modelo, badge Locado, quantidade de OS, custo, última data, Ver Histórico e + Lançar. |
| 45 | **Histórico de manutenção por veículo**: indicadores total de OS, custo total, concluídas; botão Baixar relatório e + Nova Manutenção; tabela de OS. |
| 46 | Menu contextual da OS: Ver detalhes/Excluir. A captura também sugere um item Editar em outro estado, mas não há fluxo completo de edição exibido. |
| 47 | Popover de **Anexos da OS**: nota fiscal, ícone e link Visualizar nota fiscal. |
| 48 | **Nova Manutenção etapa 1/3 — Detalhes**: tipo, data de realização, descrição, custo da mão de obra, quilometragem. |
| 49 | Continuação etapa 1: upload da nota fiscal, observações, Cancelar/Próximo. |
| 50 | Dropdown Tipo de Manutenção com opções **Corretiva, Preventiva e Garantia**. |
| 51 | **Etapa 2/3 — Peças/Itens**: descrição da peça, código, quantidade, custo unitário, subtotal, fornecedor e Adicionar Peça. |
| 52 | Continuação etapa 2: totais de peças/mão de obra, pagamento à vista, conta bancária do pagamento, Anterior/Próximo. |
| 53 | Segunda captura da etapa 2, enfatizando totais e seleção bancária. |
| 54 | **Etapa 3/3 — Garantia**: estado vazio da seção garantia das peças, Anterior e Registrar Manutenção. |
| 55 | **Vistorias**: busca por placa/marca/modelo, filtro, cartões por veículo com foto, motorista, última/próxima e ações Ver vistorias/Solicitar vistoria. |
| 56 | **Histórico de Vistorias do veículo**: filtros por data inicial/final/status, registros expansíveis, badges Aprovada/Cancelada, botão Solicitar vistoria. |
| 57 | Registro de vistoria expandido mostrando odômetro informado, alerta de conferência e início das fotos. |
| 58 | Galeria com fotos obrigatórias Frente, Traseira, Lateral Esquerda, Lateral Direita, Painel/KM. |
| 59 | Modal **Solicitar Vistoria**: veículo, responsável, WhatsApp, e-mail opcional, data agendada, envio de link pelo WhatsApp conforme texto. |
| 60 | **Configuração de fotos de vistoria**: até 12 slots ativos; slots Frente, Traseira, Lateral Esquerda, Lateral Direita e outros, checkboxes Ativo e excluir. |
| 61 | Continuação configuração: slot Painel/KM, adicionar novo tipo/slot e botão Adicionar. |
| 62 | **Consulta de Motoristas**: busca nome/CPF/email/telefone, tabela nome/CPF/telefone/email/cidade/status/ações, + Novo Motorista. |
| 63 | Menu contextual motorista: Editar/Excluir. |
| 64 | **Novo Motorista**: identidade, nascimento, CPF/RG, email, CNH/categoria/validade, telefone e painel de endereço. |
| 65 | Continuação: upload de documentos e botão Cadastrar Motorista. |
| 66 | **Consulta de Locações**: botão + Nova Locação, busca por número/placa/motorista, tabela número/veículo/motorista/período/status/valor/criado em/ações. |
| 67 | Menu de locação: Editar/Excluir. |
| 68 | **Editar Locação**: veículo e motorista, início/término, tipo, período/dia da vistoria. |
| 69 | Continuação: regras de vistoria e início das Informações Financeiras, valor semanal e caução. |
| 70 | Continuação: switches valores já pagos, quilometragem/franquia mensal, contrato em PDF/imagem e observações. |
| 71 | Rodapé Editar Locação: contrato, observações, Cancelar/Atualizar Locação. |
| 72 | **Nova Locação**: formulário em branco com atalhos + Novo Veículo/+ Novo Cliente (texto da captura) e seleção de veículo/motorista. |
| 73 | Continuação Nova Locação: periodicidade e informações financeiras. |
| 74 | Nova Locação: valor mensal/caução, checkboxes de pagamento antecipado, limite de KM e contrato. |
| 75 | Rodapé Nova Locação com upload/observações e Cadastrar Locação. |
| 76 | Repetição do topo de **Novo Veículo**, útil para calibração visual. |
| 77 | Repetição da parte inferior de Novo Veículo. |
| 78 | Repetição do topo de **Novo Motorista**, útil para calibração. |
| 79 | Repetição do final do formulário de Novo Motorista. |
| 80 | **Dashboard Financeiro**: seleção mensal/período personalizado/gerenciar contas; cards faturamento/despesas/lucro/margem; destaque/atenção; gráfico comparativo e rosca. |
| 81 | Continuação: Faturamento x Despesas por mês, Despesas por Categoria, Indicadores da Frota. |
| 82 | Indicadores de ocupação, receita por veículo e frota ativa; Caixa e Projeção; Próximos vencimentos. |
| 83 | **Contas Bancárias**: cartão Conta Principal, saldo, badge Padrão; Extrato/Editar; ações Lançamento manual e + Nova conta. |
| 84 | Modal **Editar conta**: nome, instituição, tipo, saldo inicial, data do saldo inicial, padrão, ativa, Salvar. |
| 85 | **Extrato — Conta Principal**: datas De/Até, Filtrar, Exportar CSV, saldo inicial, entradas, saídas, saldo final, tabela de movimentações. |
| 86 | Extrato completo com registros de recebimento de locação e pagamento de contas a pagar, saldos acumulados. |
| 87 | Dashboard Financeiro com popover **Período personalizado**: datas inicial/final e Aplicar. |
| 88 | Repetição de Contas Bancárias. |
| 89 | Modal **Nova conta bancária**: nome, instituição, tipo, saldo inicial e data, definir padrão, Criar conta. |
| 90 | Modal **Lançamento manual**: tipo Entrada/Saída, valor, data, descrição, Cancelar/Registrar. |
| 91 | **Contas a Receber**: total pendente, busca por descrição/cliente/contrato, filtros Status/Método de Pagamento/Ordenar e tabela. |
| 92 | Continuação da tabela de Contas a Receber: cliente, descrição, valor total, valor pendente, vencimento, status Vencida e quantidade exibida. |
| 93 | Menu contextual de conta a receber com ação **Pagar** (registro de recebimento). |

## 4. Módulos, relações e funcionalidades reconstruíveis

### 4.1 Painel e shell
**[O]** Cards, gráficos e rankings dependem de dados financeiros/frota. A sidebar pode expandir/colapsar; há alternância de tema, dropdown do avatar, popover de alertas e navegação por submenus. **[I]** Cards e rankings podem apontar para relatórios/veículos; o destino ao clicar não aparece na captura.

### 4.2 Veículos
**[O]** Listagem pesquisável com imagem, dados do veículo e menu de ações; detalhe; cadastro/edição; upload de fotos; importação XLSX/CSV com modelo e limite de 200; ação Consultar multas. Campos: placa, Renavam, chassi, marca, modelo, ano, cor, odômetro, UF/município de emplacamento, foto(s), data e preço de compra, status/disponibilidade, data de criação. **[P]** Política de estados (rented, available, inactive), remoção física/lógica, fonte externa da consulta de multas, esquema da planilha e confirmação de importação não aparecem.

### 4.3 Motoristas
**[O]** Listagem, detalhe, cadastro e edição, busca CEP, nome, CPF, RG, nascimento, email, telefone, CNH/número/categoria/validade, endereço estruturado e upload de identidade/comprovante. **[P]** Validação antifraude, consulta externa de CEP, duplicidade CPF/CNH, proteção de dados e processo de exclusão não estão especificados visualmente.

### 4.4 Locações
**[O]** Listagem e criação/edição; ligação veículo↔motorista; início/término; periodicidade mensal/semanal; período/dia de vistoria; valor do aluguel, caução, checkboxes pré-pago; quilometragem permitida/franquia; contrato anexo; observações. **[I]** Cadastro gera contas a receber, ocupa veículo e produz agendas de vistoria, porque os módulos exibem essas entidades relacionadas; não há prova do gatilho exato ou parcelamento. **[P]** Regras de prorrogação, encerramento, inadimplência e bloqueio de locação sobreposta.

### 4.5 Manutenções
**[O]** Seleção de veículo, histórico de OS, despesas, listagem, anexos/nota fiscal, download de relatório; cadastro em três passos: Detalhes (tipo corretiva/preventiva/garantia, data, descrição, mão de obra, odômetro, nota fiscal, observações), Peças/Itens (nome, código, quantidade, custo, subtotal, fornecedor, adicionar, pagamento e conta bancária), Garantia (opcional). No histórico existe status Concluída. **[I]** Pagamento cria saída bancária quando concluída; nota abaixo do campo bancário sugere esse momento, mas o mecanismo de mudança de status não aparece. **[P]** Cronograma, status aberto/cancelado, tela de detalhes/edição completa e regras para anexos.

### 4.6 Vistorias
**[O]** Lista por veículo com última/próxima vistoria, histórico filtrável e expansível com fotos + KM, solicitação via WhatsApp, configuração de até 12 tipos de foto ativos. **[P]** Formulário preenchido pelo motorista, política de aprovação, envio efetivo via gateway e armazenamento das mídias não são exibidos. **[I]** Solicitação gera link individual com validade e status pendente, de forma segura.

### 4.7 Disparo de mensagens / Notificações
**[O]** Catálogo de templates, editor com placeholders para nome do motorista e nome da empresa, preview verde estilo WhatsApp, seleção múltipla de motoristas e botão de envio; notificações CNH/manutenção/locações, filtro de tipo e lidas, dropdown e marcar todas como lidas. **[P]** API WhatsApp/provedor, custo, entrega, agendamento, política de opt-in, estados de falha/retentativa. O texto 'Enviar para 6 motoristas' não prova que um envio real tenha ocorrido.

### 4.8 Financeiro
**[O]** Dashboard analítico, gráfico mensal comparativo, rosca de despesas, alertas de melhor/pior veículo, indicadores de frota, caixa/projeção, próximos vencimentos; contas bancárias/criação/edição; lançamentos manuais e extrato CSV; contas a receber, contas a pagar; relatório por veículo/cliente/DRE e PDF. **[I]** Contas a receber surgem de contratos, contas a pagar de despesas e manutenções; pagamentos atualizam caixa; exige reconciliação para impedir duplicidades. **[P]** Detalhes do formulário de pagamento, categorias completas, transferências, impostos e forma de cálculo de comparação com período anterior.

### 4.9 Administração
**[O]** Colaboradores com convites e controle granular por área/ação, perfil com senha e notificações do browser, assinatura com cobrança trimestral e integração externa indicada para pagamentos. **[P]** Login, recuperação de senha, onboarding, webhooks, regras de cobrança, pricing vigente e página de administração de papéis não aparecem nas imagens.

## 5. Fonte complementar: relatório de manutenção (2 páginas)

**[O] Estrutura e conteúdo visível:** marca FrotaOne e cabeçalho FF Veículos; título RELATÓRIO DE MANUTENÇÕES; identificação do VW GOL MPI, placa **EBR7G53**, ano 2023, cor BRANCA, odômetro **181.652 km** e situação **Locado**; resumo com **2 OS concluídas**, 0 em aberto, 0 canceladas; mão de obra **R$ 250,00**, peças **R$ 581,20**, custo total **R$ 831,20**, custo médio **R$ 415,60**. Distribuição por tipo/situação, histórico consolidado, detalhes de cada OS, peças, fornecedor, datas, forma de pagamento e subtotais. OS **WO-2026-0013** (freios, R$ 619,70, sendo mão de obra R$ 250,00 e peças R$ 369,70) e **WO-2026-0006** (óleo/filtro, R$ 211,50). Rodapé com paginação 1/2 e 2/2. Regra impressa: **custos de ordens canceladas ficam fora dos totais**; valores refletem o cadastro no momento da emissão.

**[R]** A exportação deve gerar PDF A4 retrato com cabeçalho/rodapé por página, tabelas legíveis, quebra de páginas, números no padrão BRL, `—` para vazios e soma calculada dos dados reais. Usar o PDF enviado como golden master visual, não apenas como exemplo genérico.

## 6. Regras financeiras verificáveis a partir da amostra

- **[O]** No período exibido (novembro de 2026), faturamento/receitas: **R$ 5.603,00**; despesas **R$ 1.894,45**; lucro **R$ 3.708,55**; margem exibida aproximadamente **66,2%**.
- **[O]** Despesas por categoria na DRE de exemplo: financiamento **R$ 1.720,45**; seguro **R$ 174,00** (soma **R$ 1.894,45**).
- **[O]** Exemplo de extrato bancário: saldo inicial do período **R$ 7.802,58**, entradas **R$ 5.603,00**, saídas **R$ 1.894,45**, saldo final **R$ 11.511,13**.
- **[O]** DRE descreve apuração gerencial por pagamentos recebidos e contas a pagar quitadas, não por competência contábil estrita; IRPJ/CSLL deve ser tratado separadamente pela contabilidade.
- **[O]** As tabelas de contas a receber exibem valores pendentes, vencimentos e badge Vencida; contas a pagar exibem badge Pago.
- **[P]** Divergências de nomenclatura 'lucro bruto', 'lucro líquido' e 'resultado do exercício' não permitem inferir uma DRE contábil completa. A IA desenvolvedora deve preservar a tela e documentar a metodologia de cálculo, sem introduzir impostos fictícios.

## 7. Registro de dúvidas e decisões controladas

| Código | Ausência/ambiguidade | Encaminhamento sem fingir confirmação |
|---|---|---|
| P01 | 9 capturas declaradas versus 93 páginas reais | Usar 93 páginas, preservando capturas repetidas como estados. |
| P02 | Fonte/CSS originais inacessíveis | Amostrar cores, reconstruir tokens e calibrar com snapshots visuais. |
| P03 | Não há login/recuperação de senha | Implementar telas de acesso neutras coerentes, marcar como acrescentadas. |
| P04 | Pagamento de locação e de conta: modal/fluxo não mostrado | Propor diálogo explícito de valor/data/conta/método, aprovado no backlog. |
| P05 | Consultar multas: backend externo não evidenciado | Adapter configurável; nunca simular consulta a DETRAN. |
| P06 | WhatsApp: provedor e autenticação desconhecidos | Adapter; envio real somente após credenciais/consentimento; fallback deep-link transparente. |
| P07 | Integração de cobrança/Asaas | Permitir link real configurado e status sincronizado somente se integrado. |
| P08 | Fotos/documentos: armazenamento não identificável | Object storage + URLs assinadas + autorização e limites. |
| P09 | Assinatura e preços variáveis | Registrar dados configuráveis; não embutir preço da captura como tarifa universal. |
| P10 | Situações de manutenção além de Concluída | Usar estados aberto/concluído/cancelado para sustentar o PDF, com transições documentadas. |
| P11 | Componente de inspeção usado pelo motorista não aparece | Criar fluxo público de token, mobile-first, identificado como inferido. |
| P12 | Regras de caução, pré-pagamento, periodicidade e encerramento | Validar com negócio; definir regras provisórias configuráveis. |
| P13 | Apagar registros relacionados | Preferir arquivamento/soft delete e confirmação, impedindo perda de histórico financeiro. |
| P14 | Sem capturas mobile | Preservar desktop e propor adaptação responsiva sem supor visual original mobile. |
| P15 | Mapas/consultas externos e push browser | Exigir permissões e APIs reais; informar indisponibilidade quando configuração faltar. |
| P16 | Tradução status `RENTED` versus `Locado` | Mapear código interno ↔ rótulo PT-BR mantendo consistência visual. |
| P17 | Interface assinala 'Novo Cliente' em Nova Locação; cadastro de cliente autônomo não existe no material | Tratar cliente como motorista/locatário até esclarecimento, sem criar módulo autônomo por presunção. |
| P18 | Exato sistema de anexos da OS | Modelar uma ou várias mídias, respeitando menção nota fiscal e visualização. |
| P19 | Série histórica e percentuais do dashboard | Calcular de transações históricas reais; não armazenar gráficos pré-prontos nem falsificar indicadores. |
| P20 | Exportações não fornecidas (exceto PDF de manutenção) | Implementar CSV e PDF onde botão é exibido, validar contra dados exibidos. |

## 8. Diretrizes de implementação extraídas da análise

1. Preservar todas as seções, tabelas, campos, filtros, menus, modais e botões observáveis; nada de substituir tabelas por cards genéricos nem de omitir páginas de relatório.
2. Tratar o PDF como **fonte da verdade visual**; ajustes técnicos (responsividade, acessibilidade, autenticação, tratamento de erros) podem complementar, não apagar, alterar rótulos ou refazer o desenho original.
3. Distinguir requisitos observáveis de hipóteses: backlog de hipóteses com decisões datadas; não alegar requisitos não comprovados.
4. Fluxos CRUD persistentes, relatórios calculados, integridade entre locação/veículo/motorista/vistorias e financeiro, upload funcional, autenticação e autorização reais.
5. Evitar cadastrar em produção CPF, RG, telefone ou e-mail copiados dos exemplos visuais; usar dados fictícios em desenvolvimento. Exemplo de placa e totais do relatório servem a teste de equivalência e devem ser isolados em fixture de teste.
6. Garantir tema claro/escuro, popovers e estados: hover, foco, selecionado, vazio, carregamento, erro, sucesso, formulário inválido e operação confirmada; somente alguns estão explicitamente retratados.
7. Os critérios de aceitação devem associar cada fluxo a suas páginas, testes funcionais e screenshots comparativas no mesmo viewport.

**Conclusão:** há conteúdo suficiente para especificar uma aplicação multipágina de gestão de frota e finanças com elevada fidelidade na interface visível. Não há informações suficientes para provar integrações externas, regras fiscais, login ou processos não capturados; esses itens foram claramente isolados como pendências/recomendações, não como características confirmadas.
