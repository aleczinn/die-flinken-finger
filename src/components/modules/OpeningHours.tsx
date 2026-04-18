import { OpeningHoursItem } from '@/lib/storyblok-queries';
import { Locale } from "@/lib/locale/locales";
import { t } from "@/lib/i18n";

interface OpeningHoursProps {
    locale: Locale
    items: OpeningHoursItem[];
}

export default function OpeningHours({ locale, items }: OpeningHoursProps) {
    if (!items?.length) {
        return null;
    }

    return (
        <dl className="grid grid-cols-[auto_1fr] gap-x-8 gap-y-2">
            {items.map((item) => (
                <div key={item._uid} className="contents">
                    {/* Tage */}
                    <dt className="text-sm">
                        {formatDays(item.days)}
                    </dt>

                    {/* Zeiten */}
                    <dd className="text-sm">
                        {item.closed
                            ? <span className="">{t(locale, 'generic.closed')}</span>
                            : item.note
                                ? item.note
                                : `${item.open} – ${item.close} Uhr`
                        }
                    </dd>
                </div>
            ))}
        </dl>
    );
}

function formatDays(days: string[]): string {
    if (!days?.length) {
        return '';
    }

    if (days.length === 1) {
        return `${days[0]}.`;
    }

    // Aufeinanderfolgende Tage zusammenfassen: ["Mo","Di","Mi"] → "Mo–Mi"
    const order = ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'];
    const indices = days.map((d) => order.indexOf(d)).sort((a, b) => a - b);

    const ranges: string[] = [];
    let start = indices[0];
    let end = indices[0];

    for (let i = 1; i < indices.length; i++) {
        if (indices[i] === end + 1) {
            // Folgetag -> Range erweitern
            end = indices[i];
        } else {
            // Lücke -> Range abschließen
            ranges.push(end > start ? `${order[start]}.–${order[end]}.` : order[start]);
            start = indices[i];
            end = indices[i];
        }
    }
    ranges.push(end > start ? `${order[start]}.–${order[end]}.` : order[start]);

    return ranges.join(', ');
}