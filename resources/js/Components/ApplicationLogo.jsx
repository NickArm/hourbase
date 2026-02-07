export default function ApplicationLogo(props) {
    return (
        <svg
            {...props}
            viewBox="0 0 100 100"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
        >
            {/* Outer circle - representing continuous time */}
            <circle 
                cx="50" 
                cy="50" 
                r="42" 
                stroke="currentColor" 
                strokeWidth="6" 
                opacity="0.25"
            />
            
            {/* Progress arc - representing tracked time (3/4 circle) */}
            <path 
                d="M 50 8 A 42 42 0 1 1 20.3 79.7"
                stroke="currentColor" 
                strokeWidth="6" 
                strokeLinecap="round"
                fill="none"
            />
            
            {/* Clock hand pointing to "work time" */}
            <line 
                x1="50" 
                y1="50" 
                x2="50" 
                y2="22" 
                stroke="currentColor" 
                strokeWidth="5" 
                strokeLinecap="round"
            />
            
            {/* Hour markers - 4 key positions (bigger) */}
            <circle cx="50" cy="12" r="4" fill="currentColor" />
            <circle cx="88" cy="50" r="4" fill="currentColor" />
            <circle cx="50" cy="88" r="4" fill="currentColor" />
            <circle cx="12" cy="50" r="4" fill="currentColor" />
            
            {/* Center dot (bigger) */}
            <circle cx="50" cy="50" r="6" fill="currentColor" />
            
            {/* Link symbol - representing "link tasks" (bolder) */}
            <path 
                d="M 62 62 L 68 62 A 7 7 0 0 1 68 76 L 62 76" 
                stroke="currentColor" 
                strokeWidth="4.5" 
                strokeLinecap="round"
                fill="none"
            />
            <path 
                d="M 38 76 L 32 76 A 7 7 0 0 1 32 62 L 38 62" 
                stroke="currentColor" 
                strokeWidth="4.5" 
                strokeLinecap="round"
                fill="none"
            />
            <line 
                x1="40" 
                y1="69" 
                x2="60" 
                y2="69" 
                stroke="currentColor" 
                strokeWidth="4.5" 
                strokeLinecap="round"
            />
        </svg>
    );
}
