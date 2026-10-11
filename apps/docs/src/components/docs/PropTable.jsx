import styles from './PropTable.module.css';

/** Renders `component.docs.props` as a documentation table. */
export default function PropTable({ props, fallback = 'This component accepts no props.' }) {
  if (!props || props.length === 0) {
    return <p className={styles.empty}>{fallback}</p>;
  }

  return (
    <div className={styles.wrap}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th scope="col">Name</th>
            <th scope="col">Type</th>
            <th scope="col">Default</th>
            <th scope="col">Description</th>
          </tr>
        </thead>
        <tbody>
          {props.map((prop) => (
            <tr key={prop.name}>
              <td>
                <code>{prop.name}</code>
              </td>
              <td>
                <code>{prop.type}</code>
              </td>
              <td>
                <code>{prop.default ?? '—'}</code>
              </td>
              <td>{prop.description}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}