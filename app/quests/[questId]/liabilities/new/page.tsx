import { createLiabilityAction } from '@/app/actions/liability-actions';
import { SubmitButton } from '@/components/forms/SubmitButton';
import { Card } from '@/components/ui/Card';
import { SectionTitle } from '@/components/ui/SectionTitle';

export default async function NewLiabilityPage({ params }: { params: Promise<{ questId: string }> }) {
  const { questId } = await params;

  return (
    <div className="max-w-2xl">
      <SectionTitle title="Add Liability" subtitle="Track mortgages, student loans, credit cards, and other debts." />
      <Card>
        <form action={createLiabilityAction} className="grid gap-4">
          <input type="hidden" name="questId" value={questId} />
          <select name="liabilityType" className="rounded-xl border border-slate-300 p-3" required>
            <option value="">Select type</option>
            <option value="mortgage">Mortgage</option>
            <option value="student_loan">Student Loan</option>
            <option value="credit_card">Credit Card</option>
            <option value="auto_loan">Auto Loan</option>
            <option value="personal_loan">Personal Loan</option>
            <option value="heloc">HELOC</option>
            <option value="recurring_obligation">Recurring Obligation</option>
          </select>
          <input name="lenderName" placeholder="Lender name" className="rounded-xl border border-slate-300 p-3" />
          <input name="currentBalance" placeholder="Current balance" type="number" step="0.01" className="rounded-xl border border-slate-300 p-3" />
          <input name="interestRate" placeholder="Interest rate (%)" type="number" step="0.01" className="rounded-xl border border-slate-300 p-3" />
          <input name="monthlyPayment" placeholder="Monthly payment" type="number" step="0.01" className="rounded-xl border border-slate-300 p-3" required />
          <textarea name="notes" placeholder="Notes" className="rounded-xl border border-slate-300 p-3" rows={3} />
          <SubmitButton label="Save Liability" />
        </form>
      </Card>
    </div>
  );
}