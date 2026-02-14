export default function Footer() {
  return (
    <footer className="bg-gray-800 dark:bg-gray-900 text-white py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">AbdurRaheem Store</h3>
            <p className="text-gray-300 dark:text-gray-400">
              Your one-stop shop for quality products at great prices.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <a href="/" className="text-gray-300 dark:text-gray-400 hover:text-white">
                  Home
                </a>
              </li>
              <li>
                <a href="/products" className="text-gray-300 dark:text-gray-400 hover:text-white">
                  Products
                </a>
              </li>
              <li>
                <a href="/cart" className="text-gray-300 dark:text-gray-400 hover:text-white">
                  Cart
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact</h3>
            <p className="text-gray-300 dark:text-gray-400">Email: info@abdurraheemstore.com</p>
            <p className="text-gray-300 dark:text-gray-400">Phone: (123) 456-7890</p>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-gray-700 dark:border-gray-600 text-center">
          <p className="text-gray-300 dark:text-gray-400">
            &copy; 2024 AbdurRaheem Store. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}