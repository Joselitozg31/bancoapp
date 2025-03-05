import UsersTable from '@/components/UsersTable';

export default function AreaPersonal() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">User Data</h1>
      <UsersTable />
    </div>
  );
}