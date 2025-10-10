interface GenericPageProps {
  title: string;
  description: string;
  items?: string[];
}

export default function GenericPage({ title, description, items = [] }: GenericPageProps) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-800">{title}</h1>
        <p className="text-gray-600 mt-2">{description}</p>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Available Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {items.map((item, idx) => (
            <div key={idx} className="border border-gray-200 p-4 rounded-lg hover:shadow-md transition">
              <p className="font-medium text-gray-800">{item}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
        <p className="text-blue-800">
          💡 This is a demo page. In production, this would contain full {title.toLowerCase()} functionality.
        </p>
      </div>
    </div>
  );
}
