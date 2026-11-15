# WhatsApp da locadora: formulário de vistoria, manutenção e comprovante (lado YuDirect)

> Registro de **14/11/2026**. O lado Whaply está em `docs/architecture/VISTORIA_WHATSAPP_FLOW_IMPLEMENTACAO.md` do repositório Whaply.
> O plano original da integração continua em `yudirect-whaply-vistoria-plan.md`.

## O que mudou no YuDirect

| Mudança | Arquivos principais |
|---|---|
| **Canal das fotos por locadora** (`photoChannel`: `CHAT` padrão ou `FLOW`), fixado na vistoria ao planejar a coleta | `packages/contracts/src/whaply.ts`, `services/inspection-schedule.ts`, `services/whatsapp-inspection.ts` (`newCollection`) |
| Pedido ao Whaply com `collectionMode: 'FLOW'`, template do formulário e **sem** botão de link; o parâmetro 4 do texto passa a ser a **lista dos ângulos** | `createMessageIntent` em `services/whatsapp-inspection.ts` (`listAngles`) |
| Configuração "Como o motorista envia as fotos" | `WhatsappSettingsCard.vue`, `modules/whatsapp/routes.ts` |
| **Chamado de manutenção** vindo do WhatsApp (`maintenance.requested`) vira pedido de manutenção do motorista | `services/whatsapp-locadora.ts`, `insertMaintenanceRequest` em `services/driver-portal.ts` |
| **Comprovante de pagamento** (`payment.receipt_received`) vira comprovante pendente de conferência na aba Pagamentos | `paymentReceipts`, rotas `GET /rentals/:id/payment-receipts` e `POST …/:receiptId/review`, `RentalPaymentsTab.vue` |
| Correções da coleta que estavam só na branch `estab/a5-whaply-contrato`: foto sem vínculo vai para a locadora certa; conclusão antes da última foto é reavaliada; bateria E2E entre sistemas | `1339174`, `c4a9003`, `3dd2d9d` |

## Configuração por locadora
`organizations.settings.inspectionWhatsapp`: `enabled`, `sendTime`, `reminderAfterHours`, `maxReminders`, `collectionTtlHours`, `instructions`, **`photoChannel`**. Só o dono (permissão `inspections:update`) muda. A mudança vale para vistorias **planejadas depois**; uma coleta já planejada mantém o canal. A correção de vistoria segue o canal da coleta original.

## Templates por canal
| Canal | Pedido | Lembrete | Correção |
|---|---|---|---|
| CHAT | `yudirect_vistoria_solicitacao` | `…_lembrete` | `…_correcao` |
| FLOW | `yudirect_vistoria_solicitacao_flow_v2` | `yudirect_vistoria_lembrete_flow` | `yudirect_vistoria_correcao_flow` |

Variáveis: `WHAPLY_TEMPLATE_REQUEST/REMINDER/CORRECTION` e as versões `_FLOW`. Os templates precisam existir **aprovados** na WABA da locadora; sem template aprovado o Whaply responde 422 e o YuDirect cai no link manual.

## Eventos novos (Whaply → YuDirect)
- `maintenance.requested` → `handleMaintenanceRequested`: busca as fotos por referência, confere o sha256, cria o pedido (`sourceEventId` único: um por evento), categoria pela peça (freios/motor→MECHANICAL, pneus→TIRES, elétrica→ELECTRICAL, outro→OTHER).
- `payment.receipt_received` → `handleReceiptReceived`: novo arquivo `PAYMENT_RECEIPT` (imagem ou PDF, 10 MB), `paymentReceipts` (único por `eventId`), alerta ao dono. **A baixa continua manual.**
- Locadora do evento: `WHAPLY_ORGANIZATION_ID` ou, sem ela, a única com a coleta pelo WhatsApp ligada (com duas, o evento não é associado a nenhuma). Motorista: pelo telefone, com ou sem o nono dígito; número desconhecido vira alerta.

## Índices criados na inicialização (aditivos)
`paymentReceipts` (`eventId` único, `by_rental`, `by_org_status`) e `maintenanceRequests.sourceEventId` (único parcial).

## Ativação (checklist)
1. Whaply com `YUDIRECT_*` e templates/Flow aprovados na WABA da locadora.
2. YuDirect: `WHAPLY_INTEGRATION_ENABLED=true`, `WHAPLY_API_URL=https://api.whaply.com`, chaves HMAC (uma por direção, idênticas às do Whaply com os papéis invertidos), `WHAPLY_ORGANIZATION_ID`.
3. Dono liga "Solicitar fotos automaticamente pelo WhatsApp" em Configurações de Vistoria, escolhe o canal e registra o consentimento dos motoristas.
4. Primeiro teste com um motorista interno.

## Testes
`whatsapp-locadora.test.ts` (eventos de manutenção/comprovante), `whatsapp-flow-channel.test.ts` (canal e templates), `e2e-whaply-cross.test.ts` (formulário completo com fotos cifradas, manutenção e comprovante, com o código real do Whaply via `WHAPLY_E2E_DIR`).
