export default function Footer() {
  return (
    <footer className="bg-gray-900 py-8 mt-12">
      <div className="max-w-5xl mx-auto px-6 flex flex-col sm:flex-row justify-between items-center">

        <span className="text-2xl font-bold text-blue-700 tracking-tight text-white">
               PayPro<span className="text-green-600">X</span>
       </span>
        <div className="text-gray-400 text-sm mt-3 sm:mt-0">
          &copy; {new Date().getFullYear()} PayProX. All rights reserved.
        </div>
      </div>
    </footer>
  );
}