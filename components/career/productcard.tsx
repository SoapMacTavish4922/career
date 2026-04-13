export default function ProductCard() {
  return (
    <div className="border rounded-lg p-4 shadow hover:shadow-lg transition">
      <div className="h-40 bg-gray-200 mb-4"></div>
      <h3 className="font-semibold text-lg">i-EMS</h3>
      <p className="text-gray-500 text-sm mb-3">
        Short product description.  
      </p>
      <button className="bg-blue-600 text-white px-4 py-2 rounded">
        Buy Now
      </button>
    </div>
  );
}