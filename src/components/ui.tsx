import { AlertCircle, type LucideIcon } from 'lucide-react';

export function EmptyState({
  title,
  description,
  icon: Icon = AlertCircle,
}: {
  title: string;
  description?: string;
  icon: LucideIcon;
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-ink-200 bg-ink-50/50 px-6 py-12 text-center">
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-ink-100 text-ink-500">
        <Icon className="h-7 w-7" />
      </div>
      <h3 className="text-base font-bold text-ink-800">{title}</h3>
      {description && <p className="mt-1 max-w-sm text-sm text-ink-500">{description}</p>}
    </div>
  );
}

export function LoadingState({ label = 'Memuat...' }: { label?: string }) {
  return (
    <div className="flex items-center justify-center py-16">
      <div className="flex flex-col items-center gap-3">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary-200 border-t-primary-600" />
        <p className="text-sm font-medium text-ink-500">{label}</p>
      </div>
    </div>
  );
}

export function ErrorState({ message }: { message: string }) {
  return (
    <div className="flex items-center justify-center py-16">
      <div className="flex flex-col items-center gap-2 text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-50 text-red-500">
          <AlertCircle className="h-6 w-6" />
        </div>
        <p className="text-sm font-semibold text-ink-800">Terjadi kesalahan</p>
        <p className="max-w-sm text-sm text-ink-500">{message}</p>
      </div>
    </div>
  );
}

export function PageHeader({
  title,
  subtitle,
  icon: Icon,
}: {
  title: string;
  subtitle?: string;
  icon: LucideIcon;
}) {
  return (
    <div className="mb-8 animate-slide-up">
      <div className="flex items-center gap-3">
        {Icon && (
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-500 to-primary-700 text-white shadow-lg shadow-primary-500/30">
            <Icon className="h-6 w-6" strokeWidth={2.5} />
          </div>
        )}
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-ink-900 sm:text-3xl">{title}</h1>
          {subtitle && <p className="mt-1 text-sm text-ink-500 sm:text-base">{subtitle}</p>}
        </div>
      </div>
    </div>
  );
}
