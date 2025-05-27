export default function Footer() {
  return (
    <footer className="bg-warning text-dark py-5 mt-5">
      <div className="container">
        <div className="row gx-4 gy-4">
          {/* Logo & Description */}
          <div className="col-12 col-md-3">
            <h2 className="fw-bold mb-3">SpainStore</h2>
            <p>أفضل المنتجات بأفضل الأسعار مع خدمة مميزة وسرعة في التوصيل.</p>
          </div>

          {/* Quick Links */}
          <div className="col-12 col-md-3">
            <h3 className="h5 fw-semibold mb-3">روابط سريعة</h3>
            <ul className="list-unstyled">
              <li><a href="/" className="text-decoration-none text-dark">الرئيسية</a></li>
              <li><a href="/products" className="text-decoration-none text-dark">المنتجات</a></li>
              <li><a href="/categories" className="text-decoration-none text-dark">الأقسام</a></li>
              <li><a href="/contact" className="text-decoration-none text-dark">اتصل بنا</a></li>
              <li><a href="/privacy" className="text-decoration-none text-dark">سياسة الخصوصية</a></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="col-12 col-md-3">
            <h3 className="h5 fw-semibold mb-3">تواصل معنا</h3>
            <p className="mb-1">العنوان: شارع الملك، المدينة، المغرب</p>
            <p className="mb-1">الهاتف: +212 600 123 456</p>
            <p className="mb-1">البريد الإلكتروني: info@spainstore.com</p>
            <p className="mb-0">أوقات العمل: 9 صباحاً - 6 مساءً</p>
          </div>

          {/* Newsletter */}
          <div className="col-12 col-md-3">
            <h3 className="h5 fw-semibold mb-3">اشترك في نشرتنا</h3>
            <form className="d-flex flex-column gap-2">
              <input
                type="email"
                placeholder="بريدك الإلكتروني"
                className="form-control"
              />
              <button type="submit" className="btn btn-warning text-white">
                اشترك
              </button>
            </form>
          </div>
        </div>

        <div className="mt-4 pt-3 border-top text-center small">
          &copy; {new Date().getFullYear()} SpainStore. جميع الحقوق محفوظة.
        </div>
      </div>
    </footer>
  );
}
