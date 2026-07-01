import { Component } from 'react';

/* -------------------------------------------------------
   ErrorBoundary
   Catches any unhandled runtime error in the component tree
   and renders a themed recovery screen instead of a white page.
------------------------------------------------------- */
export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    // Log for debugging — replace with a real logger in production if needed
    console.error('[ErrorBoundary]', error, info.componentStack);
  }

  render() {
    if (!this.state.hasError) return this.props.children;

    return (
      <div style={{
        position: 'fixed',
        inset: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '16px',
        background: 'var(--bg-dusk-1)',
        color: 'var(--parchment)',
        fontFamily: "'Inter', sans-serif",
        textAlign: 'center',
        padding: '24px',
      }}>
        <span style={{ fontSize: '48px' }}>🤠</span>
        <p style={{ fontSize: '18px', margin: 0, color: 'var(--glow)' }}>
          algo deu errado por aqui…
        </p>
        <p style={{ fontSize: '13px', opacity: 0.6, margin: 0 }}>
          tenta recarregar a página
        </p>
        <button
          type="button"
          onClick={() => window.location.reload()}
          style={{
            marginTop: '8px',
            padding: '10px 24px',
            background: 'var(--ember)',
            color: 'var(--parchment)',
            border: 'none',
            borderRadius: '999px',
            fontFamily: 'inherit',
            fontSize: '14px',
            cursor: 'pointer',
          }}
        >
          recarregar
        </button>
      </div>
    );
  }
}
