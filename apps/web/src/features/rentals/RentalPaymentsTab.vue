<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { CheckCircle2, FileText, Pencil, Plus, Trash2 } from 'lucide-vue-next';
import {
  formatCentsBRL,
  formatIsoDateBR,
  paymentMethodLabels,
  rentalPaymentCategoryLabels,
  rentalPaymentStatusLabels,
  type PaymentReceiptDTO,
  type RentalPaymentEntry,
  type RentalPaymentsView,
} from '@yudirect/contracts';
import AppButton from '@/components/ui/AppButton.vue';
import ActionMenu, { type ActionItem } from '@/components/ui/ActionMenu.vue';
import ConfirmDialog from '@/components/ui/ConfirmDialog.vue';
import DataTable, { type Column } from '@/components/ui/DataTable.vue';
import SearchInput from '@/components/ui/SearchInput.vue';
import StatusBadge from '@/components/ui/StatusBadge.vue';
import RentalPaymentForm from './RentalPaymentForm.vue';
import { api, ApiRequestError } from '@/lib/api';
import { useAuthStore } from '@/stores/auth';
import { useToastStore } from '@/stores/ui';

/** Aba "Pagamentos" da página da locação (fluxo do Frota One). */
const props = defineProps<{ rentalId: string }>();
const emit = defineEmits<{ changed: [] }>();

const auth = useAuthStore();
const toasts = useToastStore();

const view = ref<RentalPaymentsView | null>(null);
const loading = ref(true);
const query = ref('');
const totalCount = ref(0);
const formMode = ref<'create' | 'edit' | 'pay' | null>(null);
const formEntry = ref<RentalPaymentEntry | null>(null);
const deleteTarget = ref<RentalPaymentEntry | null>(null);
const deleting = ref(false);

const canWrite = computed(() => auth.allows('finance', 'pay') && view.value?.rentalStatus === 'ACTIVE');
const canMutate = computed(() => auth.allows('finance', 'pay') && view.value?.rentalStatus !== 'CANCELED');
const canDelete = computed(() => auth.allows('finance', 'delete') && view.value?.rentalStatus !== 'CANCELED');

const columns: Column[] = [
  { key: 'receipt', label: 'Nº Recibo' },
  { key: 'category', label: 'Categoria' },
  { key: 'description', label: 'Descrição' },
  { key: 'amount', label: 'Valor' },
  { key: 'expected', label: 'Dt. Prevista' },
  { key: 'method', label: 'Forma Pgto.' },
  { key: 'status', label: 'Situação' },
  { key: 'paidAt', label: 'Dt. Pagamento' },
  { key: 'actions', label: 'Ações', width: '80px' },
];

const statusTone = { PAID: 'blue', PENDING: 'amber', OVERDUE: 'red' } as const;

async function load() {
  loading.value = true;
  try {
    view.value = await api.get<RentalPaymentsView>(`/rentals/${props.rentalId}/payments`, {
      query: { q: query.value || undefined },
    });
    if (!query.value) totalCount.value = view.value.entries.length;
  } catch (err) {
    toasts.error('Falha ao carregar os pagamentos', err instanceof ApiRequestError ? err.message : undefined);
  } finally {
    loading.value = false;
  }
}

function openForm(mode: 'create' | 'edit' | 'pay', entry: RentalPaymentEntry | null = null) {
  formMode.value = mode;
  formEntry.value = entry;
}
function closeForm() {
  formMode.value = null;
  formEntry.value = null;
}
function onSaved(next: RentalPaymentsView) {
  view.value = next;
  if (!query.value) totalCount.value = next.entries.length;
  closeForm();
  emit('changed');
  // mantém o filtro de busca aplicado
  if (query.value) void load();
}

function actionsFor(entry: RentalPaymentEntry): ActionItem[] {
  const items: ActionItem[] = [];
  if (entry.status !== 'PAID' && canMutate.value) {
    items.push({ key: 'pay', label: 'Marcar como pago', icon: CheckCircle2 });
    items.push({ key: 'edit', label: 'Editar', icon: Pencil });
  }
  if (canDelete.value) items.push({ key: 'delete', label: 'Excluir', icon: Trash2, danger: true });
  return items;
}

function onAction(key: string, entry: RentalPaymentEntry) {
  if (key === 'pay') openForm('pay', entry);
  else if (key === 'edit') openForm('edit', entry);
  else deleteTarget.value = entry;
}

/* Comprovantes enviados pelo motorista no WhatsApp: o dono confere e dá a baixa no pagamento. */
const receipts = ref<PaymentReceiptDTO[]>([]);
const reviewing = ref<string | null>(null);
const pendingReceipts = computed(() => receipts.value.filter((r) => r.status === 'PENDING_REVIEW').length);
const formatDateTimeBR = (iso: string) =>
  new Date(iso).toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo', dateStyle: 'short', timeStyle: 'short' });

async function loadReceipts() {
  try {
    receipts.value = (await api.get<{ data: PaymentReceiptDTO[] }>(`/rentals/${props.rentalId}/payment-receipts`)).data;
  } catch {
    receipts.value = []; // a lista de pagamentos continua funcionando sem os comprovantes
  }
}

async function markReviewed(receipt: PaymentReceiptDTO) {
  reviewing.value = receipt.id;
  try {
    receipts.value = (
      await api.post<{ data: PaymentReceiptDTO[] }>(`/rentals/${props.rentalId}/payment-receipts/${receipt.id}/review`, {})
    ).data;
    toasts.success('Comprovante marcado como conferido');
  } catch (err) {
    toasts.error('Não foi possível marcar o comprovante', err instanceof ApiRequestError ? err.message : undefined);
  } finally {
    reviewing.value = null;
  }
}

async function confirmDelete() {
  if (!deleteTarget.value) return;
  deleting.value = true;
  try {
    const next = await api.delete<RentalPaymentsView>(`/rentals/${props.rentalId}/payments/${deleteTarget.value.id}`);
    toasts.success(deleteTarget.value.status === 'PAID' ? 'Pagamento estornado' : 'Pagamento excluído');
    deleteTarget.value = null;
    onSaved(next);
  } catch (err) {
    toasts.error('Não foi possível excluir', err instanceof ApiRequestError ? err.message : undefined);
  } finally {
    deleting.value = false;
  }
}

onMounted(() => {
  void load();
  void loadReceipts();
});
</script>

<template>
  <div class="space-y-6">
    <div
      class="rounded-card border border-brand-100 bg-brand-50 px-4 py-3 text-[15px] text-brand-700"
      role="note"
    >
      Utilize esta área para registrar os pagamentos feitos pelo motorista, como diárias/semanais e cobranças por KM excedente.
    </div>

    <div v-if="view" class="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <div class="fo-card p-5" data-card="total">
        <p class="text-[15px] text-ink-soft">Valor Total</p>
        <p class="mt-1 text-[26px] font-bold tabular text-ink">{{ formatCentsBRL(view.summary.totalCents) }}</p>
        <p class="mt-1 text-sm text-ink-muted">Valor total da locação (sem caução)</p>
      </div>
      <div class="fo-card p-5" data-card="paid">
        <p class="text-[15px] text-ink-soft">Valor Pago</p>
        <p class="mt-1 text-[26px] font-bold tabular text-positive">{{ formatCentsBRL(view.summary.paidCents) }}</p>
        <p class="mt-1 text-sm text-ink-muted">Pagamentos realizados</p>
      </div>
      <div class="fo-card p-5" data-card="pending">
        <p class="text-[15px] text-ink-soft">Valor Pendente</p>
        <p class="mt-1 text-[26px] font-bold tabular text-negative">{{ formatCentsBRL(view.summary.pendingCents) }}</p>
        <p class="mt-1 text-sm text-ink-muted">A receber</p>
      </div>
      <div class="fo-card p-5" data-card="deposit">
        <p class="text-[15px] text-ink-soft">Caução</p>
        <p class="mt-1 text-[26px] font-bold tabular text-brand-600">{{ formatCentsBRL(view.summary.depositCents) }}</p>
        <p class="mt-1 text-sm text-ink-muted">Valor separado</p>
      </div>
    </div>

    <div v-if="canWrite && formMode === null">
      <AppButton variant="secondary" @click="openForm('create')">
        <template #icon><Plus class="size-4" /></template>
        Adicionar Pagamento
      </AppButton>
    </div>
    <p v-else-if="view && !canWrite && auth.allows('finance', 'pay')" class="text-sm text-ink-muted">
      Esta locação não está ativa: não aceita novos pagamentos.
    </p>

    <section v-if="receipts.length > 0" class="fo-card p-6" data-section="whatsapp-receipts">
      <h2 class="text-xl font-bold text-ink">Comprovantes recebidos pelo WhatsApp</h2>
      <p class="mt-1 text-sm text-ink-muted">
        {{ pendingReceipts }} pendente(s) de conferência. Confira o comprovante e dê a baixa no pagamento correspondente.
      </p>
      <ul class="mt-4 divide-y divide-line">
        <li v-for="receipt in receipts" :key="receipt.id" class="flex flex-wrap items-center gap-3 py-3">
          <FileText class="size-5 shrink-0 text-ink-soft" aria-hidden="true" />
          <div class="min-w-0 flex-1">
            <a
              v-if="receipt.file"
              :href="receipt.file.url"
              target="_blank"
              rel="noopener"
              class="font-semibold text-brand-600 hover:underline"
            >
              {{ receipt.file.contentType === 'application/pdf' ? 'Abrir PDF' : 'Ver imagem' }}
            </a>
            <span v-else class="font-semibold text-ink">Arquivo indisponível</span>
            <span class="ml-2 text-sm text-ink-muted tabular">{{ formatDateTimeBR(receipt.receivedAt) }}</span>
            <p v-if="receipt.caption" class="text-sm text-ink-soft">“{{ receipt.caption }}”</p>
          </div>
          <StatusBadge
            :label="receipt.status === 'REVIEWED' ? 'Conferido' : 'Pendente'"
            :tone="receipt.status === 'REVIEWED' ? 'blue' : 'amber'"
          />
          <AppButton
            v-if="receipt.status === 'PENDING_REVIEW' && auth.allows('finance', 'pay')"
            variant="secondary"
            :loading="reviewing === receipt.id"
            @click="markReviewed(receipt)"
          >
            Marcar como conferido
          </AppButton>
        </li>
      </ul>
    </section>

    <RentalPaymentForm
      v-if="formMode"
      :rental-id="rentalId"
      :mode="formMode"
      :entry="formEntry"
      @close="closeForm"
      @saved="onSaved"
    />

    <section class="fo-card overflow-hidden">
      <div class="p-6">
        <h2 class="mb-4 text-xl font-bold text-ink">Lista de Pagamentos</h2>
        <SearchInput
          v-model="query"
          placeholder="Filtrar por recibo, categoria, valor, situação..."
          label="Filtrar pagamentos"
          @search="load"
        />
      </div>

      <DataTable
        :columns="columns"
        :rows="view?.entries ?? []"
        :loading="loading"
        caption="Lista de pagamentos da locação"
        empty-message="Nenhum pagamento registrado. Adicione um pagamento para começar"
      >
        <template #cell-receipt="{ row }">
          <span class="whitespace-nowrap font-semibold text-ink">{{ row.receiptNumber }}</span>
        </template>
        <template #cell-category="{ row }">{{ rentalPaymentCategoryLabels[row.category] }}</template>
        <template #cell-description="{ row }">{{ row.description }}</template>
        <template #cell-amount="{ row }">
          <span class="font-semibold tabular">{{ formatCentsBRL(row.amountCents) }}</span>
        </template>
        <template #cell-expected="{ row }">
          <span class="tabular">{{ formatIsoDateBR(row.expectedDate) }}</span>
        </template>
        <template #cell-method="{ row }">{{ row.method ? paymentMethodLabels[row.method] : '—' }}</template>
        <template #cell-status="{ row }">
          <StatusBadge :label="rentalPaymentStatusLabels[row.status]" :tone="statusTone[row.status]" />
        </template>
        <template #cell-paidAt="{ row }">
          <span class="tabular">{{ row.paidAt ? formatIsoDateBR(row.paidAt) : '—' }}</span>
        </template>
        <template #cell-actions="{ row }">
          <ActionMenu
            v-if="actionsFor(row).length > 0"
            :items="actionsFor(row)"
            :label="`Ações do pagamento ${row.receiptNumber}`"
            @select="onAction($event, row)"
          />
        </template>
      </DataTable>

      <p v-if="!loading && (view?.entries.length ?? 0) > 0" class="border-t border-line px-6 py-4 text-sm text-ink-muted">
        Mostrando {{ view?.entries.length }} de {{ totalCount }} pagamentos
      </p>
    </section>

    <ConfirmDialog
      :open="deleteTarget !== null"
      :title="deleteTarget?.status === 'PAID' ? 'Excluir pagamento (estorno)' : 'Excluir pagamento'"
      :message="
        deleteTarget?.status === 'PAID'
          ? `O pagamento ${deleteTarget.receiptNumber} já foi recebido. Ao excluir, o recebimento é estornado: o valor sai do extrato e dos indicadores, e o histórico é preservado.`
          : `Tem certeza que deseja excluir o pagamento ${deleteTarget?.receiptNumber ?? ''}?`
      "
      confirm-label="Excluir"
      danger
      :loading="deleting"
      @cancel="deleteTarget = null"
      @confirm="confirmDelete"
    />
  </div>
</template>
