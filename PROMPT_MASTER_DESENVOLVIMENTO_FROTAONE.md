# PROMPT MASTER DEFINITIVO — IMPLEMENTAÇÃO INTEGRAL DO FROTAONE

> **INÍCIO DO PROMPT A SER FORNECIDO À IA DESENVOLVEDORA**
>
> Você atuará como equipe sênior de engenharia full-stack, arquitetura, design systems, segurança e QA. Sua missão é **reconstruir e entregar um sistema FrotaOne integralmente operacional** com a maior fidelidade visual e funcional possível aos **dois PDFs de referência**: `Captura de tela 2026-11-08 164843(1).pdf` (93 páginas com capturas, recortes e estados) e `relatorio de manutencao(1).pdf` (2 páginas, relatório de manutenção exportado). A solicitação original cita 9 capturas, porém o arquivo recebido possui **93 páginas**: **analisar e validar TODAS as 93**. Este prompt é a especificação, mas **não substitui** os PDFs como goldens visuais. Se os arquivos não estiverem acessíveis à IA que implementará, solicitar o acesso e registrar o impedimento — **não afirmar que conferiu uma imagem inacessível**.
>
> **Não entregar protótipo estático, tela de demonstração ou backend falso.** Entregar frontend real, API real, persistência MongoDB, autorização, CRUD, filtros, uploads, relatórios, notificações e testes. Dados de seed são apenas para desenvolvimento/testes e jamais substituem a lógica real. **Não omitir controles identificáveis; não redesenhar sem necessidade; não inventar como confirmados os comportamentos ausentes da imagem.**

## 0. Protocolo de evidência, decisões e prioridades

1. Classifique toda decisão como **[O] Observado nos PDFs**, **[I] Inferido a partir das telas**, **[R] Recomendação de engenharia necessária para funcionar**, ou **[P] Pendente de validação de negócio/integração**. Não promover [I], [R] ou [P] a fato visual confirmado.
2. Ordem de autoridade em conflito: imagem diretamente associada à rota/estado > outra captura da mesma rota > PDF de relatório para exportação de manutenção > este prompt como consolidação > padrões razoáveis de engenharia. Documentar conflitos e solução; não eliminar componentes por conveniência.
3. Diferenciar **página/rota** de **captura**: 93 capturas documentam cerca de duas dezenas de áreas/rotas, várias vezes com scroll, modal, hover, filtro, menu ou tema diferente. Reproduzir **estados**, não criar 93 rotas artificiais.
4. Onde elementos de screenshots estiverem truncados, usar o conjunto das capturas e preservar rótulos e ações visíveis; não completar nomes próprios, CPF, chassi ou preços por adivinhação.
5. **Sem implementação especulativa de serviços externos:** consulta ao DETRAN, WhatsApp, cobrança Asaas, API de CEP, notificações push e pagamentos devem funcionar com provedores reais configurados, ou declarar sua indisponibilidade de forma explícita. Jamais apresentar uma operação como enviada/paga/consultada sem confirmação.
6. Respeitar dados LGPD: os PDFs incluem informações pessoais reais/aparentemente reais. Usar dados fictícios no ambiente de teste, redigir fixtures anônimas, evitar dados sensíveis em logs e não expor documentos pelo URL público.
7. Entregar uma **matriz de rastreabilidade** `captura → componente/rota → requisito → cenário de teste → evidência de aceite` e um `ASSUMPTIONS.md` específico para as pendências não confirmadas.

## 1. Visão geral e navegação obrigatória

O produto é uma plataforma SaaS multi-organização de gestão de frotas/locadoras. Módulos observados: **Painel (Dashboard), Notificações, Disparo de Mensagens, Veículos, Manutenções, Vistorias, Motoristas, Locações, Financeiro, Colaboradores, Meu Perfil e Assinatura.** Organização de referência **FF Veículos**, marca **FrotaOne**.

### 1.1 Shell e hierarquia lateral [O]

- **Sidebar vertical** à esquerda, azul escuro (`#1E3A8A` é uma aproximação amostrada), com logo FrotaOne; suporta **expandido** (logo + rótulos + chevrons + submenu) e **colapsado** (ícones centralizados). Indicação da rota ativa em azul mais vivo. Em ambas as formas manter alinhamento, destaque e posição, não construir menu genérico de outra estética.
- Navegação primária: `Painel`; `Notificações`; `Veículos → Consultar / Cadastrar / Importar`; `Manutenções`; `Vistorias → Acompanhar / Configurações`; `Motoristas`; `Locações → Consultar / Cadastrar`; `Financeiro → Dashboard / Contas bancárias / Contas a Receber / Contas a Pagar / Relatório por Veículo / Relatório por Cliente / DRE Mensal`; `Colaboradores`. `Disparo de Mensagens` é mostrado no contexto de notificações. Item `Reportar bug` ou ação de configuração no rodapé.
- **Topbar** branca no tema claro e navy no escuro, com ícone de tema, sino de notificações, avatar circular com inicial e dropdown. O avatar abre `Meu Perfil`, `Minha Assinatura`, `Upgrade de plano`, `Sair`, além de mostrar nome/email/organização. O sino abre popover vertical rolável com alertas e CTA `Ver todas`. A navegação deve refletir permissões do usuário.
- **Cabeçalho padrão de rota:** breadcrumb `← Voltar` nas telas filhas; banner horizontal com borda/gradiente muito sutil azul, acento vertical azul à esquerda, etiqueta superior (`FROTA`, `FINANCEIRO`, `MANUTENÇÃO`, `VISTORIAS`, `ALERTAS`, `ORGANIZAÇÃO`, `CONTA`, `COBRANÇA`), título escuro e subtítulo menor cinza. Ações primárias alinhadas à direita.
- Roteamento proposto que cobre a hierarquia visível: `/dashboard`, `/dashboard/notifications`, `/dashboard/dispatch`, `/dashboard/vehicles`, `/dashboard/vehicles/new`, `/dashboard/vehicles/import`, `/dashboard/vehicles/:id`, `/dashboard/vehicles/:id/edit`, `/dashboard/drivers`, `/dashboard/drivers/new`, `/dashboard/drivers/:id`, `/dashboard/drivers/:id/edit`, `/dashboard/rentals`, `/dashboard/rentals/new`, `/dashboard/rentals/:id/edit`, `/dashboard/maintenance`, `/dashboard/maintenance/:vehicleId`, `/dashboard/maintenance/:vehicleId/new`, `/dashboard/inspections`, `/dashboard/inspections/settings`, `/dashboard/inspections/:vehicleId`, `/dashboard/finance`, `/dashboard/finance/bank-accounts`, `/dashboard/finance/bank-accounts/:id`, `/dashboard/finance/accounts-receivable`, `/dashboard/finance/accounts-payable`, `/dashboard/finance/accounts-payable/new`, `/dashboard/finance/reports/by-vehicle`, `/dashboard/finance/reports/by-client`, `/dashboard/finance/reports/dre`, `/dashboard/employees`, `/dashboard/profile`, `/dashboard/subscription`. **Rotas são orientação técnica; valide grafia com as URLs visíveis onde legíveis.**

### 1.2 Fluxos obrigatórios

`Dashboard → módulo → listagem → filtro/busca → ação ⋮ → visualizar/editar/excluir (se permitido) → persistir → atualizar indicadores`; `Veículos → Cadastrar/Editar/Importar/Detalhes`; `Veículo → Manutenções → Ver Histórico → Nova Manutenção → Detalhes → Peças/Itens → Garantia → Registrar → baixar PDF`; `Veículo/Locação → Vistorias → Solicitar Vistoria → enviar link ao responsável → receber fotos/KM → histórico`; `Motorista → cadastro/edição → locação → contas a receber`; `Locação → vínculo de veículo e motorista → periodicidade das vistorias e obrigações financeiras`; `Financeiro → contas bancárias → extrato/lançamento manual → contas a pagar/receber → relatórios/DRE`; `Notificações → filtros → marcar lidas → link ao contexto`; `Disparo de mensagens → template → variáveis/prévia → destinatários → confirmar envio/registrar resultados`; `Avatar → Perfil/Assinatura/Sair`; `Colaboradores → convidar → escolher permissões → acompanhar convite`.

## 2. Design system e fidelidade de interface [O + recomendações de calibração]

1. **Canvas desktop observado:** screenshots de aproximadamente 1910–1917 pixels de largura, capturados em navegador com viewport horizontal grande, ora sidebar contraída, ora expandida. A aplicação está centralizada apenas na área à direita da sidebar, largura fluida, com conteúdo rolável; **não reconstruir barra do Chrome nem margens brancas do PDF**. Calibrar nos viewports das imagens originais, principalmente ~1917 px de largura.
2. **Cores indicativas obtidas por leitura/amostragem de capturas:** sidebar `#1E3A8A`; superfícies claras `#FFFFFF`; fundo claro `#F9FAFB`; bordas cinza muito discretas (`~#E5E7EB`); títulos `~#111827`; azul primário aproximado `#3B82F6`; tema escuro base `#111827`, cartões `#020817`. Verde para resultados positivos/concluído/aprovado (`~#10B981`/verde forte); vermelho para despesas/vencimento/crítico; azul badge `Locado` e `Pago`. Esses números **não são códigos originais confirmados**: extrair amostras adicionais e ajustar por screenshot diff.
3. **Tipografia:** interface PT-BR com títulos mais estreitos/condensados visualmente, etiquetas menores em uppercase com tracking, números em negrito, textos auxiliares cinza. A fonte exata não é comprovável: testar família compatível sem presumir. Preferir fonte web consistente (ex. Roboto/Inter com variante condensada onde fiel), tamanho ajustado por comparação real. Não substituir por letras decorativas.
4. **Escalas e layout:** espaçamento pequeno/moderado entre inputs, cards e tabelas; painéis brancos arredondados (~6–10 px aparentes), bordas 1 px suaves, sombra discreta em menus/modais; títulos de cards ~semibold; inputs retangulares médios (~36–42 px aparentes), placeholders pálidos; botões compactos azuis com ícone `+`, secundários brancos, destrutivos vermelhos. Sidebar contraída aproximadamente 75–90 px e expandida aproximadamente 230–260 px na escala da screenshot; **não usar estes números como verdade CSS sem medir**. Grid de 2 colunas nos formulários, 3 ou 4 cards no resumo e 3 cards na grade de manutenção.
5. **Padrões de componentes reutilizáveis:** `AppShell`, `SidebarNav`, `Topbar`, `ThemeSwitch`, `ProfileMenu`, `NotificationPopover`, `PageHeader`, `MetricCard`, `VehicleCard`, `DataTable`, `FilterBar`, `SearchInput`, `StatusBadge`, `ActionDropdown`, `ConfirmDialog`, `Modal`, `Tabs`, `DatePicker`, `CurrencyInput`, `FileDropzone`, `PhotoGallery`, `ProgressSteps`, `FormField`, `EmptyState`, `Skeleton`, `Toast`, `LineAreaChart`, `BarChart`, `DonutChart`, `MoneyValue`, `SafeDocumentLink`, `PaginationControls`.
6. **Estados observados:** popovers, menus `⋮`, dropdown, stepper com etapa selecionada, checkbox ligado/desligado, usuário selecionado, cards com badges, Empty State sem colaboradores/convites, tooltip de gráfico, galeria expandida, tema claro/escuro e carregamento transitório de gráfico. Implementar também estados técnicos **[R]**: disabled, hover, focus, validating, saving, loading, empty, error, confirmation, success, rate-limit, sessão expirada; preservando base visual.
7. **Responsividade [R]:** desktop é a referência primária; abaixo de 1024 px, sidebar vira drawer/controlável; grids colapsam para 1 coluna e tabelas ganham scroll horizontal/alternativa sem perder campos; em ~375 px formulários e modais permanecem utilizáveis, botões não saem da tela. Não afirmar que design mobile original foi mostrado.
8. **Acessibilidade [R]:** labels associados, navegação por teclado, foco visível, Escape/Tab para modais, aria-expanded/aria-controls, contraste suficiente, erros associados ao campo, nenhuma ação só por cor. Suporte a preferências de tema e persistência na sessão/cliente.

## 3. Especificação funcional POR MÓDULO, com páginas rastreáveis

### 3.1 Dashboard (págs. 14–15 e 20–21)

- Renderizar quatro cards: **Total de Veículos** (6 na referência), **Motoristas Ativos** (6), **Contratos Ativos** (6) e **Receita Mensal** (R$ 5.603,00), com texto de variação com mês anterior e ícones contextuais.
- Gráfico de área/linha **Evolução da Receita**, curva verde, preenchimento em degradê, meses no eixo X e valores monetários Y; hover exibe mês e valor (exemplo AGO). Reproduzir no tema escuro com fundo e contraste correspondentes.
- `Top Veículos Lucrativos`: medalhas 1º–3º, placa, modelo, valor e variação percentual. `Top Veículos com Mais Despesas`: veículo, custo, variação e cores de alerta.
- Dados obtidos via API agregada por organização/período. Evitar mascarar ausência de dados com números de exemplo. [I] Clique nos cards ou rankings pode navegar ao relatório/detalhe; documentar a decisão.

### 3.2 Notificações, sino e disparos (págs. 22–26, 32–33)

- Popover do sino: cabeçalho `Notificações`, lista rolável com título, severidade, motorista, mensagem, data/tempo e `Ver todas`. Ao clicar, navegar e/ou marcar lida conforme regra estabelecida; não marcar automaticamente sem documentar.
- Página Notificações: segmentos `Todas`, `Manutenção`, `CNH`, `Locações` e filtro `Todas`/`Não lidas`; ação `Marcar todas como lidas`, itens com borda lateral colorida e badge `Crítico` para casos severos; preservar ordens/datas e estados.
- Eventos aplicáveis [I]: CNH expirada/prestes a expirar, manutenção programada, vistoria ou locação chegando ao prazo; geração idempotente para evitar múltiplos alertas iguais.
- Disparo de Mensagens: select de template existente (exemplo `Boas-vindas`), campo título editável, `+ Nova`, `Salvar`, `Excluir`; editor livre que aceita tokens `{{nome_motorista}}` e `{{nome_empresa}}` (exatos tokens internos a definir), botões para inserir variável, prévia em painel verde estilo WhatsApp; lista de motoristas em grades de checkboxes, busca, seleção/desmarcar todos, contador e `Enviar para N motoristas`.
- Validação do envio: mostrar prévia com dados por destinatário, confirmar consentimento; impedir disparo sem destinatário ou template válido; guardar registro por pessoa de `pending/sent/failed`, timestamps e idempotencyKey; oferecer retry para falhas. **[P]** Provedor WhatsApp não visível: adapter de integração em produção; fallback manual `wa.me` pode abrir uma conversa por interação do usuário, mas jamais dizer que envio em massa ocorreu.

### 3.3 Veículos (págs. 34–43 e 76–77)

- **Lista** com cabeçalho `Consulta de Veículos`, busca por placa/marca/cor; tabela com thumbnail de veículo e as colunas **Imagem, Placa, Veículo, Marca, Cor, KM, Disponibilidade, Preço da compra, Data de Cadastro, Ações**; valores monetários e quilometragem PT-BR; badge azul `Locado`.
- Menu `⋮`: `Ver detalhes`, `Consultar multas`, `Editar`, `Excluir`; abrir com posicionamento correto e fechar com clique externo/Escape. `Consultar multas` exige integração externa real ou informação transparente de indisponibilidade [P]. `Excluir` com confirmação e proteção referencial [R].
- **Detalhe**: cabeçalho `MARCA MODELO · PLACA`, `Editar`, cartão de informação com placa, marca/modelo, ano, cor, chassi, Renavam, UF/município, hodômetro, status (o detalhe mostra `RENTED` no exemplo enquanto lista usa `Locado`; mapear semanticamente).
- **Criar/Editar**: painéis lado a lado `Informações Básicas` (**Placa***, Renavam, Chassi, UF de emplacamento, Município de emplacamento) e `Dados do Veículo` (**Marca***, **Modelo***, Ano, Cor, Hodômetro KM); abaixo `Fotos do Veículo` (drag/drop + clique, formato PNG/JPG/WEBP, preview de anexados, exclusão) e `Informações Financeiras` (data da compra, valor da compra); botões Cancelar/Cadastrar ou Atualizar. Campos com `*` são obrigatórios apenas quando a captura os assinala.
- **Importar**: upload por drag/drop de XLSX/CSV, limite de 200 veículos conforme tela, download de planilha modelo e [R] preview mapeando colunas, erros por linha, detecção de placa/Renavam/chassi duplicados, confirmação transacional das linhas válidas sem importar silenciosamente registros quebrados.
- Regras [R]: placa normalizada Mercosul e anterior, Renavam numérico e único por organização se preenchido, VIN/chassi único se preenchido, hodômetro >= 0, compra >= 0, imagem limitada por extensão/tamanho, disponibilidade derivada de locação ativa quando aplicável; impedir dupla locação ativa sem autorização explícita.

### 3.4 Motoristas (págs. 27–31, 62–65, 78–79)

- **Consulta de Motoristas**: busca por nome/CPF/email/telefone, colunas Nome/CPF/Telefone/Email/Cidade/Status/Ações, botão `+ Novo Motorista`; menu `Editar` e `Excluir`; linha/identificador deve permitir acessar detalhe.
- **Detalhe**: título com nome, `Editar`, painéis `Informações Pessoais`, `Contato`, `Endereço`, `Carteira de Habilitação`, `Documentos` (documento de identificação + comprovante de endereço clicáveis), `Informações do Sistema` (data de cadastro, status).
- **Novo/Editar**: campos Nome completo*, Data nascimento, CPF, RG, Email, Número da CNH, Categoria da CNH, Validade da CNH, Telefone*, Documento de Identificação (RG/CNH)*; endereço CEP (com botão Buscar), Rua, Número, Complemento, Bairro, Cidade, Estado, upload de comprovante. Layout exatamente em dois cards lado a lado e botão final `Cadastrar Motorista`/`Salvar Alterações`.
- Regras [R]: validar CPF, telefone, email, datas; impedir mesmo CPF cadastrado duas vezes na organização; armazenar CPF de forma segura, mascará-lo onde apropriado; avisar sobre CNH expirada; não rejeitar arquivos legítimos sem mostrar política de tamanho/formato. Busca CEP só se serviço ativo, com edição manual possível.

### 3.5 Locações (págs. 66–75)

- **Consulta**: título `Consulta de Locações`, `+ Nova Locação`, busca por número/placa/motorista; tabela **Número, Veículo, Motorista, Período, Status, Valor, Criado em, Ações**; cada veículo/motorista exibe identificadores secundários; menu `Editar/Excluir` e badge `Ativa`.
- **Nova/Editar Locação**: `Informações Básicas`: selects Veículo* e Motorista* com busca; atalhos visíveis `+ Novo Veículo` e `+ Novo Cliente` na tela de Nova Locação (há somente Motoristas em outra seção: **[P] tratar o botão Novo Cliente como terminologia pendente**; não inventar um grande módulo Cliente sem outra evidência); Data de Início*, Data de Término opcional, Tipo de Locação* (`Mensal`, `Semanal`, e outras opções somente se visíveis), Período de Vistoria, Dia da Semana da Vistoria.
- **Informações Financeiras**: Valor Mensal/Semanal* com rótulo adaptativo ao tipo, Valor do Caução, checkbox `Valor mensal/semanal já foi pago`, checkbox `Caução já foi pago`, Quilometragem Permitida, Franquia Mensal de KM, textos de ajuda.
- **Observações e contrato**: upload do contrato PDF/imagem e textarea `Observações Gerais`, buttons `Cancelar/Cadastrar Locação` ou `Atualizar Locação`. Em edição, veículo e motorista aparecem como não alteráveis após criação, conforme textos de ajuda.
- **[R]** Validar início ≤ término se preenchido; prevenir sobreposição para veículo/contratos ativos; salvar transacionalmente locação e compromissos previstos conforme regra declarada; gerar fluxo das contas a receber (não recebimento antecipado fictício); sinalizar caução em categoria própria, sem reconhecê-la automaticamente como receita da operação; manter histórico ao terminar/editar.

### 3.6 Manutenções e relatório PDF (págs. 44–54 + PDF de 2 páginas)

- **Seleção**: título `Manutenções`; busca por placa/marca/modelo; grade de cards de veículos com placa, modelo/ano, badge `Locado`, quantidade de OS, custo total, data da última e CTAs `Ver Histórico` e `+ Lançar`.
- **Histórico por veículo**: `← Voltar`, título `PLACA — MARCA MODELO`, botão `Baixar relatório`, `+ Nova Manutenção`, indicadores `Total de OS`, `Custo Total`, `Concluídas`; tabela `Nº OS, Descrição, Tipo, Data, Peças, Custo Total, Anexos, Status, Ações`; badges de status e popover de anexo com `Nota Fiscal da OS` e `Visualizar nota fiscal`; menu de Ver detalhes/Excluir e edição onde autorizada.
- **Assistente em três etapas**: Stepper horizontal com `1. Detalhes`, `2. Peças / Itens`, `3. Garantia` e estado ativo. Navegação Anterior/Próximo deve manter valores/arquivos já informados e validar por etapa.
  - **Etapa 1:** Tipo de Manutenção* com opções **Corretiva, Preventiva, Garantia**; Data de Realização; Descrição*; Custo da Mão de Obra; Quilometragem; Nota Fiscal da OS (PDF/imagem, drag/drop) e Observações. Texto de ajuda para hodômetro inicialmente preenchido com KM atual e casos históricos. Cancelar/Próximo.
  - **Etapa 2:** lista dinâmica `Peça #1...#N` com O que foi trocado*, Código da Peça, Quantidade*, Custo Unit.*, Subtotal calculado, Fornecedor, botão `+ Adicionar Peça`; total custo das peças, mão de obra e total com valores verdes; seção Pagamento com Forma de pagamento (referência `À vista`) e Conta bancária do pagamento (exemplo `Conta Principal (Padrão)`). O texto da tela informa que **o débito no extrato só ocorre quando a manutenção for concluída**. Anterior/Próximo.
  - **Etapa 3:** `Garantia das Peças (Opcional)`, configuração de garantias nos itens se existirem; se não houver peças, estado vazio explicativo; `Anterior` e `Registrar Manutenção`.
- **Regra de soma**: `totalPeças = Σ(qtd × custoUnitárioCentavos)`; `totalOS = mãoDeObra + totalPeças`. Datas e valores armazenados precisos, sem floating point para dinheiro.
- **PDF exportado**: usar `relatorio de manutencao(1).pdf` como **golden master** de duas páginas A4 retrato, com logo FrotaOne, identificação FF Veículos, veículo, tabelas de resumo, por tipo, por situação, histórico consolidado e detalhamento das OS, peças/fornecedor/garantia/próxima, valores, rodapés e numeração. **Custos de OS canceladas são excluídos dos totais.** A referência real inclui VW GOL MPI / EBR7G53, 2 OS concluídas, mão de obra R$ 250,00, peças R$ 581,20, total R$ 831,20, custo médio R$ 415,60; OS WO-2026-0013 (R$ 619,70) e WO-2026-0006 (R$ 211,50). Em um registro histórico da referência, a data de abertura (13/10/2026) é posterior à execução (12/10/2026): **não alterar o PDF de referência automaticamente**; validações para novas OS devem documentar como tratar registros históricos inconsistentes.
- **[P]** Não há captura do detalhe completo, da tela de edição ou do fluxo de cancelamento. Implementar alternativa coerente, sem fingir que seu visual está confirmado. Não descontar movimentação bancária duplicada ao editar ou confirmar OS duas vezes.

### 3.7 Vistorias (págs. 55–61)

- **Vistorias**: pesquisa por veículo, seletor de status, cartões com foto, modelo/ano, placa, motorista, última/próxima vistoria, badge verde `Em dia`, `Ver vistorias` e `Solicitar vistoria`.
- **Histórico do veículo**: `← Voltar`, título do carro, placa/ano, badge `Em dia`, filtros Data Inicial/Data Final/Status. Lista de vistorias do tipo `Vistoria Manual — DD/MM/AAAA`, prazo, responsável, badge `Aprovada`/`Cancelada`, accordion. Ao expandir, mostrar quilometragem informada, aviso para conferir divergência do odômetro e galeria de slots **Frente, Traseira, Lateral Esquerda, Lateral Direita, Painel/KM**.
- **Solicitar Vistoria** abre modal central sob overlay escuro com veículo, Nome do responsável, WhatsApp, E-mail (opcional) e Data agendada; botão `Solicitar vistoria`. Texto avisa que o link será enviado ao WhatsApp e opcionalmente e-mail, mas provedor efetivo é [P].
- **Configuração de fotos**: página com lista ordenada de tipos/slots, cada linha com nome, código visual e `Ativo` + ícone de remover; limite exibido de **até 12 slots ativos**; input e botão `+ Adicionar`. Aplicar configuração aos formulários e galeria. Manter os cinco slots da referência no seed.
- **[I/R]** Para operar ponta a ponta, desenvolver página responsiva de vistoria via token de uso único/expirável: upload por slot, odômetro, confirmação/submit, estados de envio e armazenamento seguro; revisão/aprovação/reprovação por usuário autorizado; registrar agendamento, notificação, auditoria e tentativas. Estas telas **não estão retratadas**, então estilo deve ser derivado do design system sem alegação de equivalência exata.

### 3.8 Financeiro — Dashboard (págs. 80–82, 87)

- Cabeçalho `Dashboard Financeiro`, mês/ano (ex. Novembro 2026), controles de navegação de meses, `Período personalizado` (popover datas inicial/final + Aplicar), `Gerenciar contas`.
- Quatro KPIs: **Faturamento**, **Despesas**, **Lucro líquido**, **Margem de lucro**, com comparação ao período anterior. Amostra: faturamento R$ 5.603,00; despesas R$ 1.894,45; lucro R$ 3.708,55; margem 66,2%.
- Cards de destaque e atenção: veículo com melhor lucro, veículo de menor resultado. Gráficos: barras **Faturamento x despesas** (últimos 6 meses; faturamento azul, despesa cinza, lucro tooltip); rosca **Despesas por categoria** (Financiamento/Seguro na amostra).
- Indicadores `Ocupação da frota`, `Receita por veículo`, `Frota ativa`; `Caixa e projeção` com Conta Principal e saldos, `Próximos vencimentos`, link `A receber`/`A pagar`.
- [R] Resumo financeiro deve ser produzido a partir de recebimentos/pagamentos, não de agregados hard-coded. Período personalizado altera **todas** as consultas e datas exibidas; exibir comparativos significativos quando há base anterior; não dividir por zero nos percentuais. Gráficos reagem a filtro, tooltips e teclado, com estados vazios.

### 3.9 Contas bancárias e extrato (págs. 83–90)

- **Contas Bancárias**: cards com nome (exemplo `Conta Principal`), saldo atual (`R$ 11.511,13`), subtipo (`Conta corrente`), badge `Padrão`, links `Extrato`/`Editar` e botões `Lançamento manual`, `+ Nova conta`.
- Modal **Nova conta bancária**: Nome*, Instituição (opcional), Tipo (ex. Conta corrente), Saldo inicial, Data do saldo inicial* e `Definir como conta padrão`, Cancelar/Criar conta.
- Modal **Editar conta**: mesmo esquema e checkbox adicional `Conta ativa`, alerta explícito: alterar a data do saldo inicial impede contabilizar lançamentos anteriores no saldo. Salvar/Cancelar.
- Modal **Lançamento manual**: Tipo Entrada/Saída, Valor, Data, Descrição, Cancelar/Registrar; campos validados e POST idempotente.
- **Extrato — Conta Principal**: De/Até, Filtrar, `Exportar CSV`, cards Saldo inicial do período/Entradas/Saídas/Saldo final, tabela Movimentações com Data, Descrição, Origem, Entrada, Saída, Saldo acumulado; pagamentos de locação entram e contas a pagar saem.
- [R] `saldoFinal = saldoInicialNoPeríodo + entradasLiquidadas – saídasLiquidadas`; extrato ordenado por data e critério estável de desempate; cada fato financeiro deve criar **uma** transação, sem duplicidade em retries; alteração de valor inicial pode exigir recálculo a partir da data; prevenir excluir conta com movimentos sem fluxo de arquivamento.

### 3.10 Contas a Receber (págs. 91–93)

- Título `Contas a Receber`, destaque de **Valor Pendente Total** (exemplo `R$ 33.540,00`), busca por descrição/cliente/contrato; filtros `Status`, `Método de Pagamento`, `Ordenar por`; tabela **Cliente, Descrição, Valor Total, Valor Pendente, Vencimento, Status, Ações**; rows vinculados a locação `LOC-2026-xxx`, badge vermelho `Vencida`, contagem de itens.
- Menu `⋮` com ação `Pagar`. [P] Modal de quitação não está visível; propor diálogo acessível com valor recebido (padrão saldo pendente), data, método, conta bancária e confirmação. Ao confirmar, registrar recebimento, reduzir saldo pendente, atualizar status e extrato, permitir pagamento parcial (se política aprovada) e não duplicar transação. Não reconhecer pagamento somente por clicar em menu.

### 3.11 Contas a Pagar (págs. 1–4)

- **Lista**: busca por descrição/fornecedor, Status, Categoria, Ordenar por; tabela **Descrição, Categoria, Valor, Vencimento, Fornecedor, Status, Ações**; badges Pago e menu `Excluir` vermelho. Exibe subtítulo de vínculo com veículo quando aplicável.
- **Nova Conta a Pagar**: Categoria* (na referência aparece `Outro`), `+ Nova categoria`, Veículo (opcional), Valor*, Data de Vencimento*, Descrição*, Nome do Fornecedor, CNPJ do Fornecedor, URL do Documento (Nota Fiscal), checkbox `Conta Recorrente (gerar automaticamente todo mês)`, checkbox `Já foi paga (cadastrar como paga)`, Observações; `Cancelar`/`Criar Conta a Pagar`.
- [R] Pagamento exige data, método/conta, trilha de auditoria e lançamento único; contas recorrentes precisam de padrão periódico com deduplicação mês/competência; remoção de conta já paga não deve apagar silenciosamente o extrato, preferir reversão/estorno autorizado. Não criar um fluxo de edição completo como 'observado' sem screenshot.

### 3.12 Relatórios Financeiros (págs. 5–10)

- **Relatório por Veículo**: filtro Todos os veículos/placa (dropdown com placa/modelo/cor), seletor de período, cards Lucro líquido/Receitas/Despesas/Veículos ativos, gráfico `Evolução do lucro líquido` anual, tabela `Lucro por veículo` com Veículo/Placa/Receita/Despesa/Lucro líquido/Margem e barras visuais (azul para positivo, vermelho para prejuízo). Respeitar divisões por zero e mostrar `—` sem receita.
- **Relatório por Cliente**: busca Nome ou CPF, tabela Cliente/CPF/Total Pago/Em Aberto/Locações/Status. Clientes são motoristas/locatários relacionados às locações na referência; não inventar cadastro de clientes independente até esclarecimento.
- **DRE Mensal**: mês/ano, ícone atualizar e `Baixar PDF`; 3 cards `Receita líquida`, `Lucro bruto`, `Resultado do exercício`; tabela hierárquica com Receita bruta, Receita de locações, Deduções da receita bruta, Receita líquida, Custos da frota (Financiamento, Seguro), Lucro bruto, Despesas com pessoal, administrativas, comerciais, outras operacionais, financeiras, Resultado antes de IRPJ/CSLL, Provisão para IRPJ/CSLL e Resultado do exercício; linhas positivas em verde e nota de rodapé que trata a DRE como **gerencial, por recebimentos e pagamentos quitados no mês**, sem substituir apuração tributária contábil.
- [R] Exportação PDF deve refletir filtros, cálculos e layout da tela e ter geração real. Como só o PDF de **manutenção** foi anexado, a formatação exata do PDF da DRE é pendência [P].

### 3.13 Colaboradores e autorização (págs. 11–13)

- Página `Colaboradores`: cabeçalho `ORGANIZAÇÃO`, banner informando cota gratuita/excedente, abas `Colaboradores` e `Convites`, empty states e botão `+ Adicionar colaborador` no cabeçalho/corpo.
- Modal `Adicionar colaborador`: Nome*, E-mail*, Telefone (opcional), permissões em lista por área (`Dashboard`, `Veículos`, `Motoristas`, `Locações`, `Vistorias`, `Manutenções`, `Financeiro`, `Notificações`), checkboxes, controles `Selecionar tudo` e `Limpar tudo`, link/expansão `Ações` por módulo; convite com status e expiração [I/R].
- [R] Autorização obrigatória **no backend**, por organização e por permissão/ação (read/create/update/delete/export/dispatch/pay quando aplicável), além de visibilidade condicional no frontend. Dono da organização gerencia usuários. Jamais confiar exclusivamente em botões ocultos.

### 3.14 Meu Perfil, assinatura e autenticação (págs. 16–19, 22)

- `Meu Perfil`: avatar, nome, e-mail, telefone, função/organização, `Editar`; painel `Notificações do navegador` com ação `Desativar`/ativar; formulário `Segurança` com senha atual, nova senha, confirmar senha e `Alterar senha`, campos com ícone revelar/ocultar.
- `Assinatura`: card Status da Assinatura (`Ativa`), Plano (Ex.: 6 a 10 veículos), Produto (Ex.: Essencial), Ciclo (Trimestral), Próxima cobrança, botões Upgrade de plano/Cancelar Assinatura; `Extrato do Período` com composição; Histórico de Cobranças com status Atrasado/Pago, botões `Pagar ou 2ª via (boleto / PIX)`, `Ver fatura`, `Ver composição`, `Atualizar`.
- A captura faz referência a abrir link oficial do **Asaas** para pagar boleto/gerar segunda via; integrar por configuração segura ou informar que faturamento externo não está conectado. Preços/plano/cotas apresentados na imagem são um **snapshot**, não regras universais; manter configuráveis.
- [P] Login, convite aceito, reset de senha e onboarding não aparecem. [R] Implementar telas discretas coerentes com a identidade, sessão segura, logout revogável, convites com tokens expirados, recuperação sem enumeração de e-mail; documentar que não foram reproduzidos de screenshots.

## 4. Arquitetura e stack — implementação pragmática

### 4.1 Escolhas recomendadas e justificadas

| Camada | Tecnologia | Justificativa e restrição |
|---|---|---|
| Web | **Vue 3 + Composition API + TypeScript + Vite** | Componentes tipados, reutilizáveis, rápido HMR e SPA semelhante à referência. |
| CSS | **Tailwind CSS**, tokens próprios em CSS variables | Fidelidade por design system com temas claro/escuro. Não depender só das classes default do Tailwind. |
| Rotas/estado | **Vue Router + Pinia** | Router guards; estado de sessão/tema/sidebar/stepper. Evitar transformar Pinia em banco de dados. |
| Formulários | **Zod** + integração Vue (VeeValidate se justificar) | Validação tipada, mensagens PT-BR, validações iguais no frontend/backend. |
| Gráficos | **ECharts + vue-echarts**, uma única biblioteca | Linhas com preenchimento, barras, rosca, legenda, tooltip, acessibilidade e tema escuro. |
| Ícones | **lucide-vue-next** ou SVGs específicos | Boa cobertura; validar ícone a ícone com screenshot. Não presumir que Lucide é o conjunto original. |
| Backend | **Node.js + TypeScript + Fastify** | Rotas REST, schema, desempenho, injeção de dependência leve, testes HTTP. |
| Persistência | **MongoDB + driver oficial (`mongodb`)** | ObjectId, agregações, índices compostos, transações para fluxos financeiros. Sem ORM se não precisar. |
| Auth | Sessões opacas revogáveis em cookies **HttpOnly, Secure, SameSite** + senha **Argon2id** | Evita tokens duradouros em localStorage; RBAC por tenant; proteção contra CSRF e brute force. |
| Documentos | **Object Storage compatível S3** (MinIO local), URLs assinadas | Fotos de veículos/vistorias, contratos, RG/CNH e notas fiscais com acesso restrito. |
| PDF | **pdfmake** ou biblioteca equivalente orientada a tabelas | Relatório A4 com cabeçalho/rodapé e paginação; o PDF de referência foi produzido por pdfmake, mas isso não obriga usá-lo. |
| Importação | Parser de XLSX/CSV no backend (ex. ExcelJS + csv-parse) | Limites, preview e validação por linha. |
| Testes | **Vitest + Vue Test Utils + Fastify inject + Playwright** | Unidade, integração e E2E, incluindo screenshots em desktop/tema. |
| Infra dev | **pnpm workspaces + Docker Compose** | Um monorepo enxuto com Mongo e armazenamento local; ambiente reproduzível. |

**REST** é suficiente; GraphQL, microserviços, event bus, CQRS e múltiplos ORMs não devem ser introduzidos sem necessidade. Camadas internas: `routes → controller/handler → service (casos de uso) → repository → MongoDB`. Empregar SOLID/DRY/KISS sem criar dezenas de abstrações vazias. Validar request/response com contratos compartilhados. Padrão Adapter apenas para integrações realmente externas. Erros em handler central. Documentar OpenAPI.

### 4.2 Estrutura de pastas sugerida

```text
frotaone/
├── apps/
│   ├── web/
│   │   ├── src/
│   │   │   ├── app/                 # bootstrap, router, providers, guardas
│   │   │   ├── assets/              # logo/imagens legitimamente disponíveis
│   │   │   ├── components/ui/       # inputs, modal, table, cards, badges, menus
│   │   │   ├── components/layout/   # sidebar, header, PageHeader, shell
│   │   │   ├── composables/         # useTheme, usePagination, useFileUpload
│   │   │   ├── features/
│   │   │   │   ├── dashboard/
│   │   │   │   ├── vehicles/         # pages, components, api, schema
│   │   │   │   ├── drivers/
│   │   │   │   ├── rentals/
│   │   │   │   ├── maintenance/
│   │   │   │   ├── inspections/
│   │   │   │   ├── finance/          # dashboard, bank, AR/AP, reports
│   │   │   │   ├── notifications/
│   │   │   │   ├── messaging/
│   │   │   │   ├── employees/
│   │   │   │   ├── account/
│   │   │   │   └── subscription/
│   │   │   ├── lib/                 # apiClient, currency, dates, permissions
│   │   │   ├── stores/              # auth, theme, navigation
│   │   │   ├── styles/              # CSS tokens, Tailwind entrypoint
│   │   │   └── main.ts
│   │   └── tests/
│   └── api/
│       ├── src/
│       │   ├── app.ts / server.ts
│       │   ├── config/              # env schema, mongodb, storage
│       │   ├── plugins/             # fastify auth, error, security, multipart
│       │   ├── common/              # Result, pagination, money, tenancy
│       │   ├── modules/
│       │   │   ├── auth/
│       │   │   ├── organizations/
│       │   │   ├── users/
│       │   │   ├── vehicles/
│       │   │   ├── drivers/
│       │   │   ├── rentals/
│       │   │   ├── maintenance/
│       │   │   ├── inspections/
│       │   │   ├── messaging/
│       │   │   ├── notifications/
│       │   │   ├── finance/
│       │   │   ├── reports/
│       │   │   ├── uploads/
│       │   │   └── billing/
│       │   ├── integrations/        # WhatsApp, CEP, DETRAN, billing adapters
│       │   ├── jobs/                # notificações e recorrência idempotentes
│       │   └── database/            # migrations, indexes, seeds
│       └── tests/
├── packages/
│   └── contracts/                  # Zod schemas e DTOs compartilhados
├── infra/                          # compose, Mongo/MinIO, ambiente exemplo
├── docs/                           # OpenAPI, ADRs, assumptions, traceability
├── e2e/                            # Playwright e goldens visuais por screenshot
├── pnpm-workspace.yaml
└── README.md
```

Separar `controller`, `service`, `repository`, `schemas` e `types` **dentro de cada módulo** conforme volume. Não criar diretório vazio só para cumprir nomenclatura. Proibir acesso direto dos componentes Vue ao banco. Todo agregado com filtro obrigatório `organizationId`.

## 5. Modelagem MongoDB — entidades e integridade

**Convenções:** `_id: ObjectId`, `organizationId: ObjectId` em todas as coleções de domínio, `createdAt`, `updatedAt`, `createdBy`, `version` nos agregados mutáveis; datas UTC ISO/Date na persistência, apresentação `DD/MM/AAAA` no fuso de negócio `America/Sao_Paulo`; valores monetários em **centavos inteiros** (ex. `amountCents: 560300` para R$ 5.603,00). Armazenar documento histórico/snapshot quando necessário para preservar consistência de relatório. Não persistir campos calculados sem justificativa e política de atualização.

| Coleção mínima (nome sugerido) | Campos relevantes, tipos e relações | Índices e regras |
|---|---|---|
| `organizations` | name, brand, status, settings {timezone, currency, policies}, plan reference | chave por `_id`; status e plano configuráveis. |
| `users` | emailLower, passwordHash, name, phone?, status; PII mínima | `emailLower` único global; hash Argon2id. |
| `memberships` | organizationId, userId, role (`owner/admin/member`), permission matrix, status | unique `(organizationId,userId)`; autorização verificável. |
| `invitations` | organizationId, emailLower, name, phone?, permissions, tokenHash, expiry, status | unique parcial para convite ativo; expiração e token de uso único. |
| `sessions` | userId, organizationId, tokenHash, expiresAt, revokedAt, userAgent? | TTL `expiresAt`; sessão revogável e indexada. |
| `vehicles` | plate, renavam?, vin?, brand, model, year?, color?, mileageKm, registration {state,city}, purchase {date?, amountCents?}, photoFileIds[], status | unique parcial `(organizationId,plate)`; unique parcial renavam/vin; índice brand/model/status; referenciar fotos. |
| `drivers` | fullName, cpfEncrypted?, cpfLookupHash?, rgEncrypted?, birthDate?, emailLower?, phone, cnh {number, category, expiryDate}, address {postalCode, street, number, complement, district, city, state}, idFileId?, addressProofFileId?, status | unique parcial `(organizationId,cpfLookupHash)`; índice `cnh.expiryDate`, status e nome; segurança PII. |
| `rentals` | rentalNumber, vehicleId, driverId, startDate, endDate?, rentalType, inspectionRule {interval,weekday}, periodicAmountCents, depositCents, prepaid flags, allowedKm?, monthlyFranchiseKm?, contractFileId?, notes?, status, history | unique `(organizationId,rentalNumber)`; índices vehicleId/status/startDate, driverId/status; validar sobreposição de locações ativas. |
| `maintenanceOrders` | orderNumber, vehicleId, type, status, description, openedAt?, performedAt?, completedAt?, canceledAt?, mileageKm?, laborCostCents, items[] {name, code?, qty, unitCostCents, supplier?, warrantyUntil?, nextDue?}, paymentMethod, bankAccountId?, invoiceFileId?, notes, ledgerPostingId? | unique `(organizationId,orderNumber)`; `vehicleId + performedAt`, `status`; incorporar itens (uso conjunto por OS); travar contra lançamento financeiro duplicado. |
| `inspectionPhotoSlots` | organizationId, code, label, order, active, isDefault | unique `(organizationId,code)`; regra até 12 slots ativos. |
| `inspections` | vehicleId, rentalId?, driverId?, responsibleName, phone, email?, scheduledAt, submittedAt?, reviewedAt?, status, odometerKm?, photos[] {slotCode,fileId}, requestTokenHash?, requestExpiresAt?, reviewerId?, notes? | `vehicleId + scheduledAt`, `status`, `rentalId`; índice para prazo de token; status auditável, mídias referenciadas. |
| `bankAccounts` | name, institution?, type, initialBalanceCents, initialBalanceDate, isDefault, active | `organizationId+active`; no máximo uma padrão por organização (índice único parcial ou transação). |
| `bankTransactions` | bankAccountId, occurredAt, amountCents positivo, direction (`in/out`), description, originType (`manual/receivable/payable/maintenance/...`), originId?, dedupeKey?, reversedBy? | índice `(organizationId,bankAccountId,occurredAt,_id)`; unique parcial `(organizationId,dedupeKey)`; reversões por evento, não exclusão cega. |
| `receivables` | rentalId?, driverId, description, grossAmountCents, paidAmountCents, dueDate, paymentMethod?, status, installmentNo?, expectedPeriod?, payments[]? | `(organizationId,dueDate,status)`, `driverId`, `rentalId`; não duplicar parcela por contrato/período. |
| `payables` | vehicleId?, categoryId?, description, amountCents, paidAmountCents, dueDate, supplier {name?,taxId?}, documentUrl/fileId?, recurring {enabled,frequency,seriesId,period?}, notes, status | `(organizationId,dueDate,status)`, `(organizationId,categoryId,status)`, `vehicleId`; índice único para geração recorrente por série/período. |
| `expenseCategories` | label, slug, active, isDefault | unique `(organizationId,slug)`; ex. Financiamento, Seguro, Outro. |
| `payments` | sourceType (`receivable/payable`), sourceId, amountCents, paidAt, bankAccountId?, method, transactionId?, externalRef?, status | unique parcial `externalRef/idempotencyKey`; índices sourceId e paidAt; histórico imutável. |
| `notifications` | userId/organizationId, type, severity, title, message, entityType?, entityId?, targetPath?, readAt?, dedupeKey, createdAt | `(organizationId,userId,readAt,createdAt)` e unique dedupeKey contextual. |
| `messageTemplates` | name, body, allowedTokens[], createdBy, updatedAt | unique `(organizationId,name)` se requerido; escapar conteúdo. |
| `messageDispatches` | templateId?, bodySnapshot, recipients[] ou lote + `messageDeliveries` se volume alto, createdAt, status | `organizationId+createdAt`; idempotência por destinatário e lote. |
| `files` | originalName, contentType, size, storageKey, checksum, purpose, owner/recordRef, uploadedBy, status | índice owner, checksum opcional, acesso por autorização. |
| `subscriptions` / `billingInvoices` | organizationId, planCode, vehicleLimits, cycle, nextDueAt, billingProvider, providerIds, status, invoices[] ou collection própria se volume | unique organizationId para assinatura ativa; providerRef unique; não inventar status de pagamento. |
| `auditLogs` | actorId, organizationId, action, entityType/id, before/after redigidos, occurredAt, correlationId | índice organizationId+occurredAt; logs de ações críticas. |

**Embedding vs referencing:** embutir `maintenanceOrders.items` porque são filhos transacionais da OS, `drivers.address` e `rentals.inspectionRule` porque são objetos próprios do agregado; referenciar veículos/motoristas/contas/arquivos/organização para evitar duplicidade e manter relações. `payments` e `bankTransactions` separados por requererem auditoria e extratos. `messageDeliveries` vira coleção própria **apenas se** volume/retentativas justificarem; não começar com duplicação de mecanismos.

**Consistência e consultas:**

- Usar transações MongoDB (replica set mesmo em dev) para operações multi-documentos: criar locação+competências se aplicável, pagar recebível/pagável+payments+bankTransactions, concluir manutenção+saída, definir única conta padrão. Usar idempotency keys e controle de versão para atualizações concorrentes.
- **Não deixar `status` financeiro e dinheiro inconsistentes:** `remaining = max(gross - paid, 0)`; status derivado ou sincronizado em única transação; vencido quando `remaining > 0` e `dueDate < businessDate`. Exibir `Pago`, `Vencida`, `Em aberto` etc coerentemente.
- Paginação por cursor para históricos grandes; `limit` limitado (ex. 20/50); busca normalizada e indexada (Mongo text/Atlas Search se disponível); sort deterministic com `_id` como desempate; preservar filtros no query string. Retornar `total` se requerido pela UI.
- Índices compostos sempre começam por `organizationId` e critérios de consulta. Unique parcials para campos opcionais. Evitar consultas N+1 e aggregations não indexadas; usar `aggregate` para KPIs e consultas batch ao popular tabelas.
- Proteção de PII por criptografia/campos minimizados, hash de lookup de CPF, storage privado, redaction de logs. Possibilidade de arquivamento e retenção definida em configuração.

## 6. Contratos REST e comunicação

**Base:** `/api/v1`; JSON UTF-8; DTOs Zod compartilhados; suporte a `GET ?q=&status=&sort=&cursor=&limit=` e filtros específicos. Incluir `requestId` em respostas e logs. Erro padronizado `{ error: { code, message, details?, requestId } }`. Listas `{ data: [], page: { nextCursor?, total? } }`. Para dinheiro preferir `amountCents`, data ISO e formatter no web. `PATCH` para mudança de campos; endpoints de ação para eventos financeiros e mensagens. Todas as rotas privadas checam sessão + tenant + permission.

| Recurso | Endpoints principais, métodos e efeitos |
|---|---|
| Autenticação | `POST /auth/login`, `GET /auth/me`, `POST /auth/logout`, `POST /auth/password/change`, recuperação/convites conforme [R]. |
| Organização/colaboradores | `GET /memberships`, `POST /invitations`, `GET /invitations`, `POST /invitations/:token/accept`, `PATCH /memberships/:id/permissions`, `DELETE /memberships/:id` com regras de dono. |
| Perfil | `GET /profile`, `PATCH /profile`, `PATCH /profile/notification-preferences`. |
| Veículos | `GET /vehicles`, `POST /vehicles`, `GET /vehicles/:id`, `PATCH /vehicles/:id`, `DELETE /vehicles/:id` (arquivamento), `GET /vehicles/import/template`, `POST /vehicles/import/preview`, `POST /vehicles/import/commit`. |
| Motoristas | `GET /drivers`, `POST /drivers`, `GET /drivers/:id`, `PATCH /drivers/:id`, `DELETE /drivers/:id` (com dependências). |
| Locações | `GET /rentals`, `POST /rentals`, `GET /rentals/:id`, `PATCH /rentals/:id`, `POST /rentals/:id/close` [I/R], validação de vinculações e datas. |
| Manutenções | `GET /vehicles/:id/maintenance`, `POST /vehicles/:id/maintenance`, `GET /maintenance/:id`, `PATCH /maintenance/:id` se autorizada, `POST /maintenance/:id/complete`, `POST /maintenance/:id/cancel`, `DELETE /maintenance/:id` conforme política; `GET /vehicles/:id/maintenance/report.pdf`. |
| Vistorias | `GET /inspections`, `GET /vehicles/:id/inspections`, `POST /vehicles/:id/inspections/request`, `GET/PUT /inspection/photo-slots`, `GET /inspection-public/:token`, `POST /inspection-public/:token/submit`, `POST /inspections/:id/review` [R]. |
| Financeiro — contas | `GET/POST /bank-accounts`, `GET/PATCH /bank-accounts/:id`, `POST /bank-accounts/:id/manual-transactions`, `GET /bank-accounts/:id/statement`, `GET /bank-accounts/:id/statement.csv`. |
| Receber/pagar | `GET /receivables`, `GET /receivables/:id`, `POST /receivables/:id/payments`; `GET/POST /payables`, `GET /payables/:id`, `PATCH /payables/:id`, `POST /payables/:id/payments`, `DELETE /payables/:id` controlado; `GET/POST /expense-categories`. |
| Analytics | `GET /dashboard/summary`, `GET /finance/dashboard?from=&to=`, `GET /reports/by-vehicle?vehicleId=&year=`, `GET /reports/by-client?q=`, `GET /reports/dre?month=&year=`, `GET /reports/dre.pdf?month=&year=`. |
| Alertas/mensagens | `GET /notifications?type=&unread=`, `PATCH /notifications/:id/read`, `POST /notifications/mark-all-read`, `GET/POST/PATCH/DELETE /message-templates`, `POST /message-dispatches`, `GET /message-dispatches/:id`. |
| Assinatura | `GET /subscription`, `GET /subscription/invoices`, `GET /subscription/invoices/:id/link` somente com URL legítima do provedor; upgrades/cancelamento mediante integração real. |
| Arquivos | `POST /files` (multipart ou upload assinado), `GET /files/:id/access-url`, `DELETE /files/:id` sob autorização; validar purpose, tipo e limites. |

**Validações obrigatórias:** Zod por rota com tipos, limites de string/tamanho, datas e URL; anti-injection/escapes; CPF/CNPJ quando preenchido, placa Mercosul/antiga, valores positivos quando cabível, quantidade > 0, `unitPrice >= 0`, odômetro >= 0, datas coerentes, formato de arquivo permitido, checagem org de todo ID associado e tratamento de erros 400/401/403/404/409/422/429/500. `POST` financeiro e disparos aceitam `Idempotency-Key`. Uploads nunca são confiados apenas pelo `Content-Type` do browser.

## 7. Especificação de regras de cálculo e integração

1. **Moeda:** operações internas por centavos inteiros; BRL em `Intl.NumberFormat('pt-BR',{style:'currency',currency:'BRL'})`; diferenças por arredondamento somente em apresentação. Evitar dupla conversão.
2. **Custo OS:** mão de obra + Σ peças; exclua canceladas dos resumos/exportação; custo médio = custo total elegível / quantidade elegível, com 0 seguro.
3. **Receitas:** pagamentos de locação efetivamente recebidos no período; diferenciar valores faturados, recebidos e pendentes. `Faturamento` do dashboard na amostra usa R$ 5.603,00; comprovar regra exata no nível dos dados, pois rótulos diferentes podem misturar conceitos.
4. **Lucro gerencial:** receitas reconhecidas pelo critério do relatório – despesas pagas no período; exemplo **R$ 5.603,00 – R$ 1.894,45 = R$ 3.708,55**; margem **~66,2%**. O total de despesas demonstrado é **Financiamento R$ 1.720,45 + Seguro R$ 174,00**. Preservar metodologia do relatório e explicitar limitações contábeis.
5. **Extrato:** exemplo `7.802,58 + 5.603,00 – 1.894,45 = 11.511,13`; `saldo` mensal = abertura + movimentações elegíveis até data; alteração de período recalcula abertura e final.
6. **Contas a receber:** `pendente = valorTotal − Σ pagamentos confirmados`; nenhum clique simples no menu já define recebimento. Não somar caução como aluguel sem decisão de negócio.
7. **Período e variação percentual:** considerar timezone de negócio, meses/anos e comparador de mesmo comprimento; usar `null`/`—` quando base zero; não apresentar infinito ou porcentagem fictícia.
8. **Disponibilidade de veículo:** derivar de locação vigente/estado operacional; impedir conflito ao cadastrar; aceitar dados históricos com status antigo explícito.
9. **Vistorias agendadas:** regras mensal/semanal, dia da semana e período; gerar notificações sem duplicatas, reprocessar após mudança de contrato. Nova vistoria não substitui histórico.
10. **Recorrência mensal de contas a pagar:** utilizar chave `(seriesId,period)` para gerar uma ocorrência por mês, sem repetição por concorrência e com parada quando desativada.
11. **Externalidades:** adapters de `WhatsAppProvider`, `BillingProvider`, `PostalCodeProvider`, `TrafficFinesProvider`, `BrowserPushProvider`, todos com logs, error handling e modo indisponível honesto. Links oficiais reais só após validação, sem inventar endpoint/preço.

## 8. Segurança, UX técnica e operações

- **Segurança:** hash Argon2id, cookies seguros HttpOnly, CSRF/origin checking, same-site, rate limiting em login/convites/upload/mensagens, helmet/CSP, HTTPS prod, validação estrita, secrets via env, headers, auditoria para exclusões/edições/pagamentos/conclusão de OS, autorização e isolamento de organizações em TODOS os repositórios, URLs assinadas de curta duração, backups, controle de retenção de dados e política LGPD.
- **Qualidade de formulários:** estado tocado/erro, máscaras PT-BR que não corrompem valor enviado, debounce de busca, autocomplete seguro, alteração da rota com formulário sujo pede confirmação [R], resiliência a falhas de rede, toast discreto sem alteração da estética.
- **Operações e observabilidade:** structured logs sem PII, requestId e correlationId; migrations/index setup idempotentes; health/readiness; rate/size limits; pipeline CI com lint, typecheck, testes, build e E2E. Nenhumas credenciais hard-coded.
- **Performance:** lazy-loading por rota, componentes async nos gráficos, índices ajustados por `explain()`, agregações com filtros de tenant antes do `lookup`, virtualização/paginação em grandes tabelas, compressão e thumbnails/AVIF/WEBP quando compatível, não solicitar N+1 registros por linha.
- **Reutilização:** editar e cadastrar veículo/motorista/locação compartilham `Form`/schema; nenhuma repetição de formatter monetário, calendário, status badge ou wrapper de ação; centralizar estados e rótulos.
- **Responsividade e acessibilidade:** manter fidelidade desktop prioritária, compor tema escuro integral, teclado, leitores de tela e operação em telas pequenas.

## 9. Plano de trabalho e entregáveis que a IA deve realizar

**Fase A – Inventário/documentação:** ler as 93 + 2 páginas; criar índice por número de página; mapear componentes e telas; detectar cores/espaçamentos/tipos por amostras; consolidar pendências em `docs/ASSUMPTIONS.md`; criar matriz de rastreabilidade e fluxo navegação. **Não pular para codar sem mapa.**

**Fase B – Design system e shell:** tokens, temas claro/escuro, sidebar colapsada/expandida, topbar, popovers, menus, componente de cabeçalho, grids, tabelas, inputs, badges, modais; comparar contra capturas de shell e dashboard.

**Fase C – Persistência e segurança:** MongoDB, índices/constraints, migrations/seed de teste, arquivos privados, auth, organizações, memberships, RBAC, API OpenAPI, testes de isolamento.

**Fase D – Domínio principal:** CRUD Veículos (inclusive importação), Motoristas, Locações; vinculações e imagens/documentos; telas de detalhes/edição e modais; impedir conflitos referenciais.

**Fase E – Manutenções e Vistorias:** histórico, wizard com persistência e soma, transições de OS, anexos, relatório PDF com comparação à referência; agenda e pedidos de vistoria, galeria, templates de fotos, coleta segura e aprovação.

**Fase F – Financeiro:** banco, lançamento, extrato, pagamentos AR/AP, recorrência, atualização de saldos, cards/gráficos, DRE, relatórios por veículo/cliente e PDFs; validação de aritmética e transações.

**Fase G – Notificações/mensagens/admin:** cron jobs deduplicados, popover e listagem, templates e disparo com provedor/estado real, colaboradores e permissões, perfil, senha e assinatura.

**Fase H – QA visual e funcional:** screenshots Playwright por rota e estado, viewport igual à referência, `pixel/SSIM diff` de imagem recortada somente na área do app; revisão manual para diferenças de fonte/renderização. Corrigir primeiro geometria e hierarquia, depois alinhamentos, tipografia, cores, ícones, estados e responsividade. Relatar percentuais de diferenças, não alegar pixel-perfect sem testes.

**Entregáveis:** repositório completo com código, migrations, seed fictício, `.env.example`, docker-compose, scripts de start/build/test, documentação de arquitetura, `README` com instruções verificadas, OpenAPI, fluxos E2E, matriz de rastreabilidade, golden screenshots gerados e relatório de divergências/pendências. **Nunca apresentar API mock como backend pronto; nunca alegar integração externa não testada.**

## 10. Plano mínimo de testes obrigatórios

| ID | Teste funcional e expectativa |
|---|---|
| T01 | Login/logout, senha, sessão expirada, usuário sem permissão e isolamento entre organizações. |
| T02 | Expandir/colapsar sidebar; abrir todos os submenus; restaurar tema claro/escuro; menu avatar e sino clicáveis/fecháveis por Esc. |
| T03 | Busca, ordenação, filtros, paginação, estado vazio, hover e menus `⋮` das tabelas de veículos, motoristas, locações, receber/pagar. |
| T04 | Criar, visualizar, editar, anexar foto, normalizar placa e prevenir duplicata/duplicidade de locação de veículo. |
| T05 | Importar modelo CSV/XLSX, preview, limite 200, erros por linha, commit idempotente, exportar/baixar modelo válido. |
| T06 | Criar/editar motorista com CPF inválido, CNH expirada, CEP sem serviço, uploads, documento protegido. |
| T07 | Criar/editar locação com datas, motorista, periodicidade, caução, contrato; bloquear conflitos e criar os compromissos aprovados. |
| T08 | Wizard manutenção valida cada etapa, mantém dados ao retroceder, adiciona/remove peças, recalcula subtotal e total exatamente. |
| T09 | Completar/cancelar OS altera relatórios e lançamento bancário apenas uma vez; relatório PDF de EBR7G53 replica resumo e detalhes da amostra (R$ 831,20). |
| T10 | Solicitar vistoria, validar WhatsApp/e-mail/data, registrar envio/indisponibilidade, upload por slots, odômetro, galeria, filtros e aprovação. |
| T11 | Configurar até 12 slots ativos; testar remoção e preservação de fotos de vistorias históricas. |
| T12 | Criar/editar banco, apenas uma conta padrão, lançar Entrada/Saída, comparar extrato e CSV com ordem e soma corretas. |
| T13 | Contas a pagar: categoria/veículo, fornecedor/CNPJ, URL, recorrência sem duplicação, já paga e exclusão controlada. |
| T14 | Recebível vencido, pagamento parcial/total, saldo correto, repetição de request idempotente, status e bankTransactions consistentes. |
| T15 | Dashboard financeiro, gráficos, período personalizado, filtro por veículo, cliente e DRE respeitam valores calculados e exibem vazio/zero sem erro. |
| T16 | Notificação crítica, filtro CNH/Manutenção/Locações, não lidas, marcar lida(s) e popover. |
| T17 | Template, tokens, preview, multi-seleção, rejeição de lista vazia, envio real somente com provedor/estado confirmado. |
| T18 | Colaborador, convites, permissões por módulo/ação e bloqueio 403 em endpoint restrito. |
| T19 | Perfil, mudança de senha e links/estados de assinatura não fingem cobrança concluída. |
| T20 | Screenshots visual regression em 1917 px (sidebar aberta/fechada, claro/escuro, menu, modal, tabelas, wizard, gráficos) e responsividade em 1440/1024/768/390. |
| T21 | API: 400/401/403/404/409/422/429, tentativas de tenant crossover, upload inválido, data conflitante, concorrência/idempotência. |
| T22 | O README reproduz ambiente do zero com banco/armazenamento, seed, testes E2E e build sem passos escondidos. |

## 11. Critérios de aceitação visuais por módulo

1. **Shell:** logo e sidebar reproduzem geometria, azul, contração/expansão, ordem do menu e ativo; topbar mostra os três controles à direita. Conferir págs. 8, 20, 22, 34, 41.
2. **Dashboard:** quatro KPIs, curva verde com tooltip, dois rankings em cards, equivalência claro/escuro. Conferir 14–15 e 20–21.
3. **Cadastros:** campos, títulos de grupos, label e sequência idênticos; dois cards por linha desktop; rodapé/botão preservado. Conferir 3–4, 38–39, 41–42, 64–65, 68–75.
4. **Tabelas:** colunas e hierarquia textual preservadas; menu de ações visualmente alinhado; badges e destaque não rearranjados. Conferir 1–2, 34–36, 45–47, 62–63, 66–67, 91–93.
5. **Manutenção:** stepper de 3 passos, peças dinâmicas, totais, pagamento/conta, garantia vazia e relatório PDF. Conferir 44–54 + ambas as páginas do relatório PDF.
6. **Vistoria:** cartões por carro, filtros, accordions, fotos em grade, modal de solicitação e slots configuráveis. Conferir 55–61.
7. **Financeiro:** os quatro KPIs, gráficos barras/rosca, cards de indicadores e caixa, datas customizadas, extrato, modais. Conferir 80–90.
8. **Admin e mensagens:** empty states, modal permissões, aviso de assinatura/cobranças, popovers, editor e preview. Conferir 11–13, 16–19, 22–26, 32–33.
9. **Responsividade:** sem perda de informação ou ações, sem cortes em modais e tabelas; variantes mobile são [R] (não possuem screenshot de referência).
10. **Sem falsos positivos:** um botão só pode ser considerado funcional se concluir sua ação legítima e registrar resultado persistido ou erro real; abrir um toast estático não satisfaz o requisito.

## 12. Notas sobre ambiguidades que NÃO podem ser apagadas

- As imagens são capturas de novembro de 2026, não prova de valores atuais. Números, nomes e badges são dados **de exemplo**, não valores fixos a embutir em produção.
- A palavra `Cliente` aparece no relatório por cliente e no botão `+ Novo Cliente`, mas não há CRUD de cliente autônomo; o domínio visual tem motoristas/locatários. Investigar e usar mapeamento explícito temporário.
- A página de detalhes mostra `RENTED` onde a lista mostra `Locado`, e o PDF mostra `Locado`; definir tradução do enum, não replicar inconsistência como três estados diferentes.
- No PDF de manutenções a abertura de uma OS é posterior à execução; preservar os dados importados e documentar regra de validação para novos registros.
- Capturas de alertas usam datas aparentemente históricas. O mecanismo de notificação deve se basear na data efetiva, não reproduzir como alerta novo um aviso vencido do seed.
- No screenshot do relatório por veículo há um gráfico temporariamente vazio e mais à frente o gráfico preenchido; contemplar carregamento verdadeiro, erro e estado de dados vazios sem usar área em branco permanente.
- O ícone `Consultar multas` requer serviço externo; o screenshot não comprova acesso ou resultado real.
- Assinatura e pagamentos externos não podem ser simulados como quitados. Provedor de WhatsApp não está identificado; não afirmar sucesso do disparo sem status real.
- Capturas estão dentro de um PDF A4 horizontal com bordas brancas e chrome do navegador. Esses elementos não fazem parte do website.
- A exatidão da família tipográfica, medidas CSS e métricas pixel-perfect exige calibração contra os arquivos; este prompt contém aproximações anotadas, não falsa precisão.

## 13. Inventário individual obrigatório das 93 páginas

A seguir consta o mapeamento por página. Usar este inventário como checklist de cobertura visual e funcional, inclusive para capturas repetidas que demonstram **estados**.

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


## 14. Referência PDF adicional — especificação do documento exportado

**Arquivo de comparação:** `relatorio de manutencao(1).pdf`, 2 páginas A4 retrato. Página 1: topo logomarca FrotaOne, título `RELATÓRIO DE MANUTENÇÕES`, placa/modelo, emissor e data; tabela de identificação, resumo por quantidade e custos, distribuições `Por tipo` e `Por situação`, histórico consolidado, início do detalhamento da OS. Página 2: continuação do primeiro detalhamento (mão de obra/peças/serviço/fornecedor/total), segunda OS e nota sobre exclusão das canceladas, rodapé com `Documento para apresentação ao cliente.` e paginação. Esta segunda referência não é tela web; é um **artefato PDF real que a aplicação deve gerar**.

**Caso de aceitação:** dados da referência com placa `EBR7G53`, VW GOL MPI 2023, 181.652 km, 2 OS corretivas concluídas, mão de obra R$ 250,00, peças R$ 581,20, soma R$ 831,20, média R$ 415,60; OS 0013 em R$ 619,70 e OS 0006 em R$ 211,50. Comparar visual de 2 páginas e totais, fonte/logo, tabelas, quebras, cabeçalho/rodapé e dados. Se o logo não puder ser extraído dos PDFs com licença/autorização, reconstruir com asset fornecido pelo proprietário, sem usar marca de terceiros aleatória.

## 15. Instrução final de execução para a IA desenvolvedora

**Trabalhe na ordem requerida:** (1) conferir anexos e 95 páginas totais, (2) inventário e documentação, (3) arquitetura e modelagem, (4) implementação com dados persistidos, (5) testes por fluxo, (6) screenshot comparisons e correções, (7) documentação das pendências. **Não interrompa o projeto em wireframes, componentes isolados, exemplos sem banco, APIs stub ou README de intenção.** Sempre que um serviço terceiro depender de credenciais, entregar adapter, configuração e tratamento seguro de indisponibilidade, com teste do caminho controlável; registrar o que permanece bloqueado em produção.

**Definição de pronto:** todas as rotas e estados observáveis reproduzidos; CRUD e ações efetivamente persistidos; autenticação/tenant/RBAC; Mongo integrado; cálculos e extrato conciliáveis; wizard e PDF funcionais; visuais claro/escuro comparados; E2E crítico verde; sem dados de demonstração embutidos como resposta da API; nenhum item omitido do inventário de 93 páginas. Para cada pendência não representada nos PDFs, documentar a decisão coerente e sua classificação [I]/[R]/[P], mantendo estrita fidelidade ao que é [O].

> **FIM DO PROMPT MASTER.**
