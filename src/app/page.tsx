// Temporary entry point for DB testing. Will be refactored into the main Dashboard/Landing page.

import prisma from "@/lib/prisma";

export default async function Home() {
  const user = await prisma.user.upsert({
    where: { email: 'jairo@test.com' },
    update: {},
    create: {
      email: 'jairo@test.com',
      name: 'Jairo',
      password: 'password123',
    },
  });

  return (
    <main className="p-10 font-sans">
      <h1 className="text-3xl font-bold mb-4">¡PlanIt conectado a la nube! 🚀</h1>
      <div className="bg-gray-900 text-green-400 p-6 rounded-xl shadow-lg overflow-auto">
        <pre>{JSON.stringify(user, null, 2)}</pre>
      </div>
    </main>
  );
}