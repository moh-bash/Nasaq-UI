import { Component } from 'react';
import styles from './ErrorBoundary.module.css';

/*
  Route/preview-level boundary. Keeps a generator bug from blanking the whole
  docs shell and gives the reader a way back without a hard reload.
*/
export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, info) {
    // Surface details in the console so bug reports include the stack.
    console.error('Nasaq UI preview error', error, info);
  }

  render() {
    const { error } = this.state;
    if (!error) return this.props.children;

    return (
      <div className={styles.fallback} role="alert">
        <h2 className={styles.title}>Something went wrong here</h2>
        <p className={styles.text}>
          {this.props.label || 'This part of the page failed to render.'} The rest of the docs are still
          usable.
        </p>
        <div className={styles.actions}>
          <button type="button" className={styles.retry} onClick={() => this.setState({ error: null })}>
            Try again
          </button>
          <button type="button" className={styles.reload} onClick={() => window.location.reload()}>
            Reload page
          </button>
        </div>
      </div>
    );
  }
}
