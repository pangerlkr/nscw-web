export default function FloatingSocials() {
  return (
    <div className="fixed right-5 bottom-8 z-40 flex flex-col gap-3" id="floating-social" data-testid="floating-socials">
      <a
        href="https://www.instagram.com/womencomnagaland"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Instagram"
        className="w-11 h-11 rounded-full bg-white shadow-lg border border-outline-variant/20 flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-xl"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="#E1306C" strokeWidth="1.8">
          <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
          <circle cx="12" cy="12" r="4" />
          <circle cx="17.5" cy="6.5" r="1" fill="#E1306C" stroke="none" />
        </svg>
      </a>
      <a
        href="https://x.com/NSCW_Nagaland"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="X (Twitter)"
        className="w-11 h-11 rounded-full bg-white shadow-lg border border-outline-variant/20 flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-xl"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-4 h-4" fill="#0f1419">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.74l7.73-8.835L1.254 2.25H8.08l4.258 5.632 5.906-5.632zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      </a>
      <a
        href="https://www.facebook.com/profile.php?id=100077706340289"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Facebook"
        className="w-11 h-11 rounded-full bg-white shadow-lg border border-outline-variant/20 flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-xl"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-5 h-5" fill="#1877F2">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
        </svg>
      </a>
    </div>
  );
}
