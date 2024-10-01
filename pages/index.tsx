import React from 'react';
import Head from 'next/head';
import styles from '../styles/Home.module.css';

const Home: React.FC = () => {
  return (
    <div className={styles.container}>
      <Head>
        <title>Balanceè DevOps Submission</title>
        <meta name="description" content="Jotham Arinze DevOps submission for the Balanceè" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          Hello, Hello
        </h1>
        <p className={styles.description}>
          This is Jotham Arinze DevOps submission for the Balanceè
        </p>
      </main>
    </div>
  );
};

export default Home;