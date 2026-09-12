export default async function Home() {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/health`, {
    cache: "no-store",
  });

  const health = await response.json();

  return (
    <main>
      <h1>Developer Community</h1>

      {health.success ? (
        <>
          <p>API: {health.data.api}</p>
          <p>Database: {health.data.database}</p>
        </>
      ) : (
        <p>API: {health.message ?? "unreachable"}</p>
      )}
    </main>
  );
}
