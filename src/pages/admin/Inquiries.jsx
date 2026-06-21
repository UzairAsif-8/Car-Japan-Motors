import { useState, useEffect } from 'react';
import { Phone, MessageCircle, Mail } from 'lucide-react';
import AdminTable from '../../components/admin/AdminTable';
import Badge from '../../components/ui/Badge';
import { Skeleton } from '../../components/ui/Skeleton';
import useAsync from '../../hooks/useAsync';
import { getInquiries, updateInquiryStatus } from '../../services/inquiryService';
import { formatDate, cn } from '../../lib/format';
import { buildWhatsAppLink } from '../../constants';

const FILTERS = [
  { value: 'all', label: 'All' },
  { value: 'new', label: 'New' },
  { value: 'contacted', label: 'Contacted' },
];

export default function Inquiries() {
  const { data, loading } = useAsync(() => getInquiries(), []);
  const [inquiries, setInquiries] = useState([]);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    if (data) setInquiries(data);
  }, [data]);

  const toggleStatus = (id) => {
    let nextStatus = 'contacted';
    setInquiries((prev) =>
      prev.map((i) => {
        if (i._id !== id) return i;
        nextStatus = i.status === 'new' ? 'contacted' : 'new';
        return { ...i, status: nextStatus };
      })
    );
    // Persist (best-effort); UI already updated optimistically.
    updateInquiryStatus(id, nextStatus).catch(() => {});
  };

  const filtered = filter === 'all' ? inquiries : inquiries.filter((i) => i.status === filter);

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-extrabold tracking-tight text-ink">Inquiries</h1>
          <p className="mt-1 text-ink-500">Customer leads from across the website.</p>
        </div>
        <div className="inline-flex items-center gap-1 rounded-full border border-ink-100 bg-white p-1">
          {FILTERS.map((f) => (
            <button
              key={f.value}
              onClick={() => setFilter(f.value)}
              className={cn(
                'rounded-full px-4 py-2 text-sm font-semibold transition-colors',
                filter === f.value ? 'bg-ink text-white' : 'text-ink-500 hover:text-ink'
              )}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-6">
        {loading ? (
          <Skeleton className="h-96 rounded-2xl" />
        ) : (
          <AdminTable
            keyField="_id"
            data={filtered}
            empty="No inquiries in this view."
            columns={[
              {
                key: 'name',
                header: 'Customer',
                render: (r) => (
                  <div>
                    <p className="font-semibold text-ink">{r.name}</p>
                    <p className="text-xs text-ink-400">{formatDate(r.createdAt)}</p>
                  </div>
                ),
              },
              {
                key: 'carName',
                header: 'Interested In',
                render: (r) => <span className="text-ink-700">{r.carName || 'General'}</span>,
              },
              {
                key: 'message',
                header: 'Message',
                render: (r) => <span className="line-clamp-2 max-w-xs text-ink-500">{r.message}</span>,
              },
              {
                key: 'status',
                header: 'Status',
                render: (r) => (
                  <button onClick={() => toggleStatus(r._id)}>
                    <Badge tone={r.status === 'new' ? 'brand' : 'success'}>{r.status}</Badge>
                  </button>
                ),
              },
              {
                key: 'actions',
                header: 'Contact',
                align: 'right',
                render: (r) => (
                  <div className="inline-flex items-center justify-end gap-2">
                    <a href={`tel:${r.phone}`} className="grid h-9 w-9 place-items-center rounded-lg text-ink-500 hover:bg-ink-50 hover:text-ink" aria-label="Call">
                      <Phone className="h-[18px] w-[18px]" />
                    </a>
                    <a href={buildWhatsAppLink(`Hi ${r.name}, thank you for your interest in ${r.carName || 'our inventory'}.`)} target="_blank" rel="noreferrer" className="grid h-9 w-9 place-items-center rounded-lg text-[#1faf54] hover:bg-emerald-50" aria-label="WhatsApp">
                      <MessageCircle className="h-[18px] w-[18px]" />
                    </a>
                    {r.email && (
                      <a href={`mailto:${r.email}`} className="grid h-9 w-9 place-items-center rounded-lg text-ink-500 hover:bg-ink-50 hover:text-ink" aria-label="Email">
                        <Mail className="h-[18px] w-[18px]" />
                      </a>
                    )}
                  </div>
                ),
              },
            ]}
          />
        )}
      </div>
    </div>
  );
}
