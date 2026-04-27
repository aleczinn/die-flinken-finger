// src/components/icons/IconMenuAnimated.tsx
export default function IconMenuAnimated({ isOpen, className }: { isOpen: boolean; className?: string }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg"
             width="24"
             height="24"
             viewBox="0 0 24 24"
             fill="currentColor"
             className={className}
             aria-hidden="true"
        >
            {/* Oberer Strich → rotiert auf 45° und wandert in die Mitte */}
            <rect x="0" y="5" width="24" height="2" rx="1"
                  className={`origin-center transition-transform duration-300 ease-in-out ${isOpen ? 'translate-y-1.5 rotate-45' : ''}`}
                  style={{ transformBox: 'fill-box' }}
            />

            {/* Mittlerer Strich → fadet weg */}
            <rect x="0" y="11" width="24" height="2" rx="1"
                  className={`origin-center transition-opacity duration-200 ${isOpen ? 'opacity-0' : 'opacity-100'}`}
                  style={{ transformBox: 'fill-box' }}
            />

            {/* Unterer Strich → rotiert auf -45° und wandert in die Mitte */}
            <rect x="0" y="17" width="24" height="2" rx="1"
                  className={`origin-center transition-transform duration-300 ease-in-out ${isOpen ? '-translate-y-1.5 -rotate-45' : ''}`}
                  style={{ transformBox: 'fill-box' }}
            />
        </svg>
    );
}