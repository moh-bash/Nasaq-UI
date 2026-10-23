import styles from './PropTable.module.css';

function slug(value) {
  return String(value).toLowerCase().replace(/[^a-z0-9]+/g, '-');
}

/** Renders `component.docs.props` as a documentation table with row anchors. */
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
            <th scope="col">Required</th>
            <th scope="col">Description</th>
          </tr>
        </thead>
        <tbody>
          {props.map((prop) => {
            const id = `prop-${slug(prop.name)}`;
            const required = prop.required ?? prop.default === undefined;
            return (
              <tr key={prop.name} id={id}>
                <td>
                  <a className={styles.anchor} href={`#${id}`}>
                    <code>{prop.name}</code>
                  </a>
                </td>
                <td>
                  <code>{prop.type}</code>
                </td>
                <td>
                  <code>{prop.default ?? '—'}</code>
                </td>
                <td>{required ? 'Yes' : 'No'}</td>
                <td>{prop.description}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
