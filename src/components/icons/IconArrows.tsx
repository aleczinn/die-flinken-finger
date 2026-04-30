export default function IconArrows({ className }: { className?: string }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg"
             width="18"
             height="18"
             viewBox="0 0 18 18"
             fill="none"
             stroke="currentColor"
             className={className}
             aria-hidden="true"
        >
            <path d="M6.5 4L2 9l4.5 5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M11.5 4L16 9l-4.5 5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
    );
}
