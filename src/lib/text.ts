interface HighlightSegment {
    text: string;
    highlight: boolean;
}

/**
 * Parst Text mit [Highlight]-Syntax in Segmente.
 *
 * Beispiel: "Ihre [Flinken Finger] sind da!"
 *   → [
 *       { text: "Ihre ", highlight: false },
 *       { text: "Flinken Finger", highlight: true },
 *       { text: " sind da!", highlight: false }
 *     ]
 *
 * Mehrere Highlights, leere Klammern und unbalancierte Klammern
 * werden robust behandelt — im Zweifel als Plain-Text gerendert.
 */
export function parseHighlights(text: string): HighlightSegment[] {
    if (!text) return [];

    const segments: HighlightSegment[] = [];
    const regex = /\[([^\]]+)]/g;
    let lastIndex = 0;
    let match: RegExpExecArray | null;

    while ((match = regex.exec(text)) !== null) {
        // Text vor dem Match
        if (match.index > lastIndex) {
            segments.push({
                text: text.slice(lastIndex, match.index),
                highlight: false,
            });
        }

        // Der Match selbst (Inhalt innerhalb der Klammern)
        segments.push({
            text: match[1],
            highlight: true,
        });

        lastIndex = match.index + match[0].length;
    }

    // Rest nach dem letzten Match
    if (lastIndex < text.length) {
        segments.push({
            text: text.slice(lastIndex),
            highlight: false,
        });
    }

    // Kein Match gefunden → kompletter Text als Plain
    if (segments.length === 0) {
        segments.push({ text, highlight: false });
    }

    return segments;
}