import Link from 'next/link';
export default function Home() {
  return (
    <div>
      <h1 className="text-3xl font-bold underline">Welcome to the app </h1>
      <Link href="/login" legacyBehavior>
        <a className="text-black-500">Go to Login</a>
      </Link>
    </div>
  );
}
